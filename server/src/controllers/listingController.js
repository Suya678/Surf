/**
 * @file controllers/listingController.js
 * @description Contains route handler logic for listing endpoints.
 */

 import { dbConnection } from "../db/dbClient.js";
 import getCoordinates from "../utils/getCordinates.js";
 import crypto from "crypto";
 import { validateListingInput, validateDates } from "../utils/validation.js";
 
 /**
  * [POST] /api/listing/create
  * Creates a new listing and its coordinates.
  */
 export const createListing = async (req, res) => {
   const user_id = req.user.id;
   const {
     title,
     description,
     address,
     city,
     province,
     postal_code,
     guest_limit,
     image: url,
     available_from,
     available_to,
   } = req.body;
 
   // --- Validation ---
   const validationError = validateListingInput(req.body);
   if (validationError) {
     return res.status(400).json({ error: validationError });
   }
 
   if (available_from && available_to) {
     const dateError = validateDates(available_from, available_to);
     if (dateError) {
       return res.status(400).json({ error: dateError });
     }
   }
   // --- End Validation ---
 
   // --- Geocoding ---
   let coordinates;
   try {
     coordinates = await getCoordinates(address, city, province, postal_code);
     if (!coordinates) {
       return res.status(400).json({
         error:
           "Could not verify address. Please ensure all address fields are correct.",
       });
     }
     console.log(`Geocoded address: ${coordinates.formattedAddress}`);
   } catch (err) {
     console.error("Geocoding error:", err);
     return res.status(503).json({
       error: "Address verification service temporarily unavailable.",
     });
   }
 
   // --- Database Transaction ---
   const client = await dbConnection.connect();
   try {
     const listing_id = crypto.randomUUID();
     await client.query("BEGIN");
 
     // 1. Insert into listing table
     const listingQuery = `
       INSERT INTO "listing" (
         listing_id, user_id, title, description, address, city,
         province, postal_code, guest_limit, url, available_from, available_to
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *;
     `;
     const listingValues = [
       listing_id,
       user_id,
       title,
       description,
       address,
       city,
       province,
       postal_code.toUpperCase().replace(/\s/g, ""),
       guest_limit,
       url,
       available_from || null,
       available_to || null,
     ];
     const listingResult = await client.query(listingQuery, listingValues);
 
     // 2. Insert into coordinates table
     const coordinatesQuery = `
       INSERT INTO "coordinates" (listing_id, latitude, longitude)
       VALUES ($1, $2, $3);
     `;
     const coordinateValues = [
       listing_id,
       coordinates.latitude,
       coordinates.longitude,
     ];
     await client.query(coordinatesQuery, coordinateValues);
 
     await client.query("COMMIT");
     res.status(201).json({
       ...listingResult.rows[0],
       verifiedAddress: coordinates.formattedAddress,
     });
   } catch (err) {
     await client.query("ROLLBACK");
     console.error("Error creating listing (transaction rolled back):", err);
     if (err.code === "23503") {
       return res.status(404).json({ error: "User not found." });
     }
     res.status(500).json({ error: "Internal server error" });
   } finally {
     client.release();
   }
 };
 
 /**
  * [DELETE] /api/listing/:listingId
  * Deletes a specific listing.
  */
 export const deleteListing = async (req, res) => {
   const user_id = req.user.id;
   const { listingId } = req.params;
 
   if (!listingId) {
     return res.status(400).json({ error: "Listing ID is required." });
   }
 
   try {
     const query = `
       DELETE FROM "listing"
       WHERE listing_id = $1 AND user_id = $2
       RETURNING listing_id;
     `;
     const values = [listingId, user_id];
     const result = await dbConnection.query(query, values);
 
     if (result.rowCount === 0) {
       return res
         .status(404)
         .json({ error: "Listing not found or user not authorized." });
     }
 
     res.status(200).json({
       message: "Listing deleted successfully.",
       listingId: result.rows[0].listing_id,
     });
   } catch (err) {
     console.error("Error deleting listing:", err);
     res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [GET] /api/listings/my-listings
  * Fetches all listings created by the currently authenticated user.
  */
 export const getMyListings = async (req, res) => {
   const user_id = req.user.id;
 
   try {
     const query = `
       SELECT *
       FROM "listing"
       WHERE user_id = $1
       ORDER BY "title" ASC;
     `;
     const values = [user_id];
     const result = await dbConnection.query(query, values);
     res.status(200).json(result.rows);
   } catch (err) {
     console.error("Error fetching user's listings:", err);
     res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [GET] /api/listings/search
  * Searches for listings based on query parameters.
  */
 export const searchListings = async (req, res) => {
   const { city, province, checkin, checkout, guests } = req.query;
 
   if (!city) {
     return res.status(400).json({ error: "City is required." });
   }
 
   try {
     const minGuests = parseInt(guests || 1);
     let query;
     let values;
 
     if (checkin && checkout) {
       // With date filtering
       if (province) {
         query = `
           SELECT l.*, c.latitude, c.longitude
           FROM "listing" l
           JOIN "coordinates" c ON l.listing_id = c.listing_id
           WHERE LOWER(l.city) = LOWER($1)
             AND LOWER(l.province) = LOWER($2)
             AND l.guest_limit >= $3
             AND (
               l.available_from IS NULL 
               OR (l.available_from <= $4 AND l.available_to >= $5)
             )
             AND NOT EXISTS (
               SELECT 1
               FROM "booking" b
               WHERE b.listing_id = l.listing_id
                 AND (b.status = 'Pending' OR b.status = 'Approved')
                 AND (b.start_date < $6 AND b.end_date > $4)
             )
           ORDER BY l.title ASC;
         `;
         values = [city, province, minGuests, checkin, checkout, checkout];
       } else {
         query = `
           SELECT l.*, c.latitude, c.longitude
           FROM "listing" l
           JOIN "coordinates" c ON l.listing_id = c.listing_id
           WHERE LOWER(l.city) = LOWER($1)
             AND l.guest_limit >= $2
             AND (
               l.available_from IS NULL 
               OR (l.available_from <= $3 AND l.available_to >= $4)
             )
             AND NOT EXISTS (
               SELECT 1
               FROM "booking" b
               WHERE b.listing_id = l.listing_id
                 AND (b.status = 'Pending' OR b.status = 'Approved')
                 AND (b.start_date < $5 AND b.end_date > $3)
             )
           ORDER BY l.title ASC;
         `;
         values = [city, minGuests, checkin, checkout, checkout];
       }
     } else {
       // Without date filtering
       if (province) {
         query = `
           SELECT l.*, c.latitude, c.longitude
           FROM "listing" l
           JOIN "coordinates" c ON l.listing_id = c.listing_id
           WHERE LOWER(l.city) = LOWER($1)
             AND LOWER(l.province) = LOWER($2)
             AND l.guest_limit >= $3
           ORDER BY l.title ASC;
         `;
         values = [city, province, minGuests];
       } else {
         query = `
           SELECT l.*, c.latitude, c.longitude
           FROM "listing" l
           JOIN "coordinates" c ON l.listing_id = c.listing_id
           WHERE LOWER(l.city) = LOWER($1)
             AND l.guest_limit >= $2
           ORDER BY l.title ASC;
         `;
         values = [city, minGuests];
       }
     }
 
     const result = await dbConnection.query(query, values);
     res.status(200).json(result.rows);
   } catch (err) {
     console.error("Error during search:", err);
     res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [GET] /api/listings
  * Fetches all listings for the authenticated host.
  */
 export const getHostListings = async (req, res) => {
   try {
     const host_id = req.user.id;
 
     if (!host_id) {
       return res.status(400).json({ error: "User ID missing" });
     }
 
     const query = `
       SELECT *
       FROM "listing"
       WHERE user_id = $1
       ORDER BY listing_id DESC;
     `;
     const result = await dbConnection.query(query, [host_id]);
     return res.status(200).json(result.rows);
   } catch (err) {
     console.error("Error fetching user listings:", err);
     return res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [PUT] /api/listing/:listingId
  * Updates an existing listing.
  */
 export const updateListing = async (req, res) => {
   const user_id = req.user.id;
   const { listingId } = req.params;
   const {
     title,
     description,
     address,
     city,
     province,
     postal_code,
     guest_limit,
     image: url,
   } = req.body;
 
   // --- Validation ---
   const validationError = validateListingInput(req.body);
   if (validationError) {
     return res.status(400).json({ error: validationError });
   }
   // --- End Validation ---
 
   const client = await dbConnection.connect();
   try {
     await client.query("BEGIN");
 
     // Verify ownership and get old address data
     const ownerCheckQuery =
       "SELECT user_id, address, city, province, postal_code FROM listing WHERE listing_id = $1";
     const ownerCheck = await client.query(ownerCheckQuery, [listingId]);
 
     if (ownerCheck.rows.length === 0) {
       await client.query("ROLLBACK");
       return res.status(404).json({ error: "Listing not found" });
     }
 
     if (ownerCheck.rows[0].user_id !== user_id) {
       await client.query("ROLLBACK");
       return res.status(403).json({ error: "Unauthorized" });
     }
 
     // Check if address changed
     let shouldUpdateCoordinates = false;
     const oldData = ownerCheck.rows[0];
     if (
       oldData.address !== address ||
       oldData.city !== city ||
       oldData.province !== province ||
       oldData.postal_code !== postal_code.toUpperCase().replace(/\s/g, "")
     ) {
       shouldUpdateCoordinates = true;
     }
 
     let coordinates;
     if (shouldUpdateCoordinates) {
       coordinates = await getCoordinates(address, city, province, postal_code);
       if (!coordinates) {
         await client.query("ROLLBACK");
         return res.status(400).json({
           error: "Could not verify new address.",
         });
       }
     }
 
     // Update listing
     const updateQuery = `
       UPDATE listing 
       SET title = $1, description = $2, address = $3, city = $4, 
           province = $5, postal_code = $6, guest_limit = $7, url = $8
       WHERE listing_id = $9 AND user_id = $10
       RETURNING *
     `;
     const updateValues = [
       title,
       description,
       address,
       city,
       province,
       postal_code.toUpperCase().replace(/\s/g, ""),
       guest_limit,
       url,
       listingId,
       user_id,
     ];
     const result = await client.query(updateQuery, updateValues);
 
     // Update coordinates if address changed
     if (shouldUpdateCoordinates && coordinates) {
       await client.query(
         "UPDATE coordinates SET latitude = $1, longitude = $2 WHERE listing_id = $3",
         [coordinates.latitude, coordinates.longitude, listingId]
       );
     }
 
     await client.query("COMMIT");
     res.status(200).json(result.rows[0]);
   } catch (err) {
     await client.query("ROLLBACK");
     console.error("Error updating listing:", err);
     res.status(500).json({ error: "Internal server error" });
   } finally {
     client.release();
   }
 };
 
 /**
  * [GET] /api/listing/:listingId/requests
  * Gets all booking requests for a specific listing.
  */
 export const getListingRequests = async (req, res) => {
   const host_id = req.user.id;
   const { listingId } = req.params;
 
   try {
     const query = `
       SELECT b.*, u.name as guest_name, u.email as guest_email
       FROM booking b
       JOIN listing l ON b.listing_id = l.listing_id
       JOIN "user" u ON b.user_id = u.id
       WHERE l.listing_id = $1 AND l.user_id = $2
       ORDER BY b.start_date ASC
     `;
     const values = [listingId, host_id];
     const result = await dbConnection.query(query, values);
     res.status(200).json(result.rows);
   } catch (err) {
     console.error("Error fetching listing requests:", err);
     res.status(500).json({ error: "Internal server error" });
   }
 };