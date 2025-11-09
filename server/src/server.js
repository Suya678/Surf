import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./utils/auth.js";
import { dbConnection } from "./db/dbClient.js";
import { toNodeHandler } from "better-auth/node";
import crypto from "crypto"; // Import crypto for generating UUIDs
import isAuthenticated from "./middleware/isAuthenticated.js"; // Import the auth middleware
import getCoordinates from "./utils/getCordinates.js";
const app = express();
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Just checking the if db is connected, it will throw an error if not
try {
  await dbConnection.query(`Select 1`);
  console.log("Database connected successfully.");
} catch (err) {
  console.error("Database connection failed:", err);
  process.exit(1); // Exit if DB connection fails
}

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "HomeSurf API",
    version: "1.0",
  });
});

/**
 * [GET] /api/user/check-onboarding
 * Checks if the currently authenticated user has completed the onboarding process.
 * Returns a boolean value.
 *
 * This endpoint is protected and requires authentication.
 */
app.get("/api/user/check-onboarding", isAuthenticated, async (req, res) => {
  const { id } = req.user; // Get the user ID from the authenticated session

  try {
    const query = `
      SELECT "onboardingCompleted"
      FROM "user"
      WHERE id = $1;
    `;
    const values = [id];

    const result = await dbConnection.query(query, values);

    if (result.rowCount === 0) {
      // This case should be rare if the user has a valid session
      return res.status(404).json({ error: "User not found." });
    }

    // Send back the boolean value
    // The '!!' ensures it's always a boolean (e.g., handles null)
    res
      .status(200)
      .json({ onboardingCompleted: !!result.rows[0].onboardingCompleted });
  } catch (err) {
    console.error("Error checking user onboarding status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [POST] /api/user/update-onboarding
 * Updates a user's account type and onboarding status.
 *
 * Request Body:
 * {
 * "id": "user_id_from_auth",
 * "accountType": "guest" | "host",
 * "onboardingCompleted": true | false
 * }
 *
 * NOTE: I've named this endpoint `/api/user/update-onboarding` as it's more
 * descriptive of what it does (updating) than '/create-user',
 * since 'better-auth' likely already handled the user creation.
 *
 * SECURITY NOTE: This endpoint is currently UNPROTECTED.
 * Any person can update any user's profile if they know their ID.
 * You should protect this route using authentication middleware.
 * If you use `auth.protect()`, you could get the user ID from
 * `req.user.id` instead of passing it in the body.
 */
app.post("/api/user/update-onboarding", isAuthenticated, async (req, res) => {
  const { accountType, age, gender, race, bio } = req.body;
  const { id } = req.user; // Get the user ID from the authenticated session
  const ageParsed = Number(age);

  // --- Input Validation ---
  // We no longer need to check for ID, as the middleware guarantees it

  // Optional: Add more specific validation as needed
  if (age && typeof ageParsed !== "number") {
    return res.status(400).json({ error: "Age must be a number." });
  }
  // --- End Validation ---

  try {
    // This query performs an "UPSERT"
    // It tries to INSERT a new row.
    // If a row with the same `id` already exists (ON CONFLICT),
    // it will UPDATE that existing row with the new values.
    const query = `
WITH upserted_info AS (
  INSERT INTO "user_info" (id, age, gender, race, bio)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (id) DO UPDATE SET
    age = EXCLUDED.age,
    gender = EXCLUDED.gender,
    race = EXCLUDED.race,
    bio = EXCLUDED.bio
  RETURNING *
)
UPDATE "user"
SET "onboardingCompleted" = TRUE,
    "accountType" = $6
WHERE id = $1
RETURNING *;
`;

    const values = [
      id,
      ageParsed || null,
      gender || null,
      race || null,
      bio || null,
      accountType || null,
    ];

    const result = await dbConnection.query(query, values);

    // Send back the inserted/updated user info data
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error upserting user info:", err);
    // Check for foreign key violation (user ID doesn't exist in 'user' table)
    if (err.code === "23503") {
      return res.status(404).json({
        error: "User not found. Cannot update info for non-existent user.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [POST] /api/user/update-info
 * Inserts or updates a user's profile information in the user_info table.
 * This performs an "UPSERT" operation.
 *
 * Request Body:
 * {
 * "id": "user_id_from_auth",
 * "age": 30,
 * "gender": "male",
 * "race": "some_race",
 * "bio": "A short bio about the user."
 * }
 *
 * SECURITY NOTE: This endpoint is currently UNPROTECTED.
 * This is especially sensitive as it handles personal info (age, gender, race).
 * You should protect this route using authentication middleware.
 * If you use `auth.protect()`, you could get the user ID from
 * `req.user.id` instead of passing it in the body.
 */
app.post("/api/user/update-info", isAuthenticated, async (req, res) => {
  const { accountType, age, gender, race, bio } = req.body;
  const { id } = req.user; // Get the user ID from the authenticated session

  // --- Input Validation ---
  // We no longer need to check for ID, as the middleware guarantees it

  // Optional: Add more specific validation as needed
  if (age && typeof age !== "number") {
    return res.status(400).json({ error: "Age must be a number." });
  }
  // --- End Validation ---

  try {
    // This query performs an "UPSERT"
    // It tries to INSERT a new row.
    // If a row with the same `id` already exists (ON CONFLICT),
    // it will UPDATE that existing row with the new values.
    const query = `
      INSERT INTO "user_info" (id, age, gender, race, bio)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        race = EXCLUDED.race,
        bio = EXCLUDED.bio
      RETURNING *;
    `;
    // Note: `EXCLUDED` refers to the values from the original INSERT attempt.
    // We pass `null` if a value is not provided in the request body.
    const values = [id, age || null, gender || null, race || null, bio || null];

    const result = await dbConnection.query(query, values);

    // Send back the inserted/updated user info data
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error upserting user info:", err);
    // Check for foreign key violation (user ID doesn't exist in 'user' table)
    if (err.code === "23503") {
      return res.status(404).json({
        error: "User not found. Cannot update info for non-existent user.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [POST] /api/listing/create
 * Creates a new listing and its coordinates.
 *
 * This endpoint is protected.
 *
 * Request Body:
 * {
 * "title": "My Listing",
 * "description": "A great place.",
 * "address": "123 Main St",
 * "city": "Anytown",
 * "province": "CA",
 * "postal_code": "12345",
 * "guest_limit": 4,
 * "image" : "http..."
 * }
 */
app.post("/api/listing/create", isAuthenticated, async (req, res) => {
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

  // --- Enhanced Validation ---
  if (!title || !address || !city || !province || !postal_code || !url) {
    return res.status(400).json({
      error:
        "title, address, city, province, postal_code, and image are required.",
    });
  }

  // Validate availability dates if provided
  if (available_from && available_to) {
    const fromDate = new Date(available_from);
    const toDate = new Date(available_to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Please use YYYY-MM-DD.",
      });
    }

    if (toDate <= fromDate) {
      return res.status(400).json({
        error: "End date must be after start date.",
      });
    }
  }

  // Validate postal code format (Canadian)
  const postalCodePattern = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
  if (!postalCodePattern.test(postal_code)) {
    return res.status(400).json({
      error: "Invalid Canadian postal code format (e.g., A1A 1A1)",
    });
  }

  // Validate guest limit
  if (isNaN(guest_limit) || guest_limit < 1) {
    return res.status(400).json({
      error: "Guest limit must be at least 1",
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      error: "Invalid image URL format",
    });
  }

  // --- Geocoding with better error handling ---
  let coordinates;
  try {
    coordinates = await getCoordinates(address, city, province, postal_code);

    if (!coordinates) {
      return res.status(400).json({
        error:
          "Could not verify address. Please ensure the street address, city, province, and postal code are correct and match a real location in Canada.",
      });
    }

    console.log(`Geocoded address: ${coordinates.formattedAddress}`);
  } catch (err) {
    console.error("Geocoding error:", err);
    return res.status(503).json({
      error:
        "Address verification service temporarily unavailable. Please try again later.",
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
        listing_id,
        user_id,
        title,
        description,
        address,
        city,
        province,
        postal_code,
        guest_limit,
        url,
        available_from,
        available_to
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
      return res.status(404).json({
        error: "User not found. Cannot create listing for non-existent user.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});
/**
 * [DELETE] /api/listing/:listingId
 * Deletes a specific listing.
 *
 * This endpoint is protected. A user can only delete their *own* listings.
 * The listing ID is passed as a URL parameter.
 */
app.delete("/api/listing/:listingId", isAuthenticated, async (req, res) => {
  const user_id = req.user.id; // Get the user ID from the authenticated session
  const { listingId } = req.params; // Get the listing ID from the URL

  // --- Input Validation ---
  if (!listingId) {
    return res.status(400).json({ error: "Listing ID is required." });
  }
  // --- End Validation ---

  try {
    // The query ensures that the user can ONLY delete a listing
    // that both exists (matches listing_id) AND belongs to them (matches user_id).
    const query = `
      DELETE FROM "listing"
      WHERE listing_id = $1 AND user_id = $2
      RETURNING listing_id;
    `;
    const values = [listingId, user_id];

    const result = await dbConnection.query(query, values);

    // If rowCount is 0, it means either:
    // 1. The listing doesn't exist.
    // 2. The listing exists, but this user doesn't own it.
    // In both cases, we return a 404 to avoid leaking information.
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Listing not found or user not authorized." });
    }

    // Send back a success message
    res.status(200).json({
      message: "Listing deleted successfully.",
      listingId: result.rows[0].listing_id,
    });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [POST] /api/booking/create
 * Creates a new booking for a listing.
 *
 * This endpoint is protected. A user creates a booking for a listing.
 *
 * Request Body:
 * {
 * "listing_id": "the_id_of_the_listing_to_book",
 * "start_date": "YYYY-MM-DD",
 * "end_date": "YYYY-MM-DD"
 * }
 */
app.post("/api/booking/create", isAuthenticated, async (req, res) => {
  const user_id = req.user.id; // Get the user ID from the authenticated session
  const { listing_id, start_date, end_date } = req.body;

  // --- Input Validation ---
  if (!listing_id || !start_date || !end_date) {
    return res
      .status(400)
      .json({ error: "listing_id, start_date, and end_date are required." });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      error: "Invalid date format. Please use YYYY-MM-DD.",
    });
  }

  if (endDate <= startDate) {
    return res
      .status(400)
      .json({ error: "End date must be after start date." });
  }
  // --- End Validation ---

  try {
    // Generate a new unique booking_id
    const booking_id = crypto.randomUUID();

    const query = `
      INSERT INTO "booking" (
        booking_id,
        listing_id,
        user_id,
        start_date,
        end_date
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    // The 'status' column will default to 'Pending' as per your table schema.

    const values = [booking_id, listing_id, user_id, startDate, endDate];

    const result = await dbConnection.query(query, values);

    // Send back the newly created booking data
    res.status(201).json(result.rows[0]); // 201 Created
  } catch (err) {
    console.error("Error creating booking:", err);
    // Check for foreign key violation (listing_id doesn't exist)
    if (err.code === "23503") {
      return res.status(404).json({
        error:
          "Listing not found. Cannot create booking for non-existent listing.",
      });
    }
    // Add check for date range overlaps if needed (more complex query)
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [DELETE] /api/booking/:bookingId
 * Deletes a specific booking.
 *
 * This endpoint is protected. A user can only delete their *own* booking.
 * The booking ID is passed as a URL parameter.
 *
 * Note: A listing *owner* would need a different endpoint/logic
 * to delete (or 'reject') a booking.
 */
app.delete("/api/booking/:bookingId", isAuthenticated, async (req, res) => {
  const user_id = req.user.id; // Get the user ID from the authenticated session
  const { bookingId } = req.params; // Get the booking ID from the URL

  // --- Input Validation ---
  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required." });
  }
  // --- End Validation ---

  try {
    // The query ensures that the user can ONLY delete a booking
    // that both exists (matches booking_id) AND belongs to them (matches user_id).
    const query = `
      DELETE FROM "booking"
      WHERE booking_id = $1 AND user_id = $2
      RETURNING booking_id;
    `;
    const values = [bookingId, user_id];

    const result = await dbConnection.query(query, values);

    // If rowCount is 0, it means either:
    // 1. The booking doesn't exist.
    // 2. The booking exists, but this user didn't make it.
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Booking not found or user not authorized." });
    }

    // Send back a success message
    res.status(200).json({
      message: "Booking deleted successfully.",
      bookingId: result.rows[0].booking_id,
    });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/listings/my-listings
 * Fetches all listings created by the currently authenticated user.
 *
 * This endpoint is protected and requires authentication.
 */
app.get("/api/listings/my-listings", isAuthenticated, async (req, res) => {
  const user_id = req.user.id; // Get the user ID from the authenticated session

  try {
    const query = `
      SELECT *
      FROM "listing"
      WHERE user_id = $1
      ORDER BY "title" ASC;
    `;
    const values = [user_id];

    const result = await dbConnection.query(query, values);

    // Send back the list of listings (will be an empty array if none are found)
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching user's listings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/booking/pending
 * Fetches all 'Pending' booking for the authenticated user.
 */
app.get("/api/booking/pending", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;
  console.log("here");

  try {
    const query = `
      SELECT * FROM "booking"
      WHERE user_id = $1 AND status = 'Pending'
    `;
    const values = [user_id];
    const result = await dbConnection.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching pending booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/booking/approved
 * Fetches all 'Approved' (upcoming) booking for the authenticated user.
 */
app.get("/api/booking/approved", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;

  try {
    const query = `
      SELECT * FROM "booking"
      WHERE user_id = $1 AND status = 'Approved'
    `;
    const values = [user_id];
    const result = await dbConnection.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching approved booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/booking/past
 * Fetches all 'Completed' or 'Rejected' booking for the authenticated user.
 */
app.get("/api/booking/past", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;

  try {
    const query = `
      SELECT * FROM "booking"
      WHERE user_id = $1 AND (status = 'Completed' OR status = 'Rejected')
    `;
    const values = [user_id];
    const result = await dbConnection.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching past booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/booking/requests
 * Fetches all 'Pending' booking requests for listings owned by the
 * authenticated user (for hosts).
 */
app.get("/api/booking/requests", isAuthenticated, async (req, res) => {
  const host_id = req.user.id; // This is the host's user ID

  try {
    // This query joins booking with listings to ensure the user
    // only gets requests for listings they own.
    const query = `
      SELECT b.*
      FROM "booking" b
      JOIN "listing" l ON b.listing_id = l.listing_id
      WHERE l.user_id = $1 AND b.status = 'Pending';
    `;
    const values = [host_id];
    const result = await dbConnection.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching booking requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [PUT] /api/booking/:bookingId
 * Updates the status of a booking (e.g., 'Approved' or 'Rejected').
 *
 * This endpoint is for hosts. It securely checks that the host
 * owns the listing associated with the booking before updating.
 *
 * Request Body:
 * {
 * "status": "Approved" | "Rejected"
 * }
 */
app.put("/api/booking/:bookingId", isAuthenticated, async (req, res) => {
  const host_id = req.user.id; // The person making the request
  const { bookingId } = req.params;
  const { status } = req.body;

  // --- Input Validation ---
  if (!status || (status !== "Approved" && status !== "Rejected")) {
    return res
      .status(400)
      .json({ error: "Invalid status. Must be 'Approved' or 'Rejected'." });
  }
  // --- End Validation ---

  try {
    // This is a secure update. It joins the tables to ensure
    // the authenticated user (host_id) owns the listing
    // that the booking (bookingId) belongs to.
    const query = `
      UPDATE "booking" b
      SET status = $1
      FROM "listing" l
      WHERE b.listing_id = l.listing_id
        AND b.booking_id = $2
        AND l.user_id = $3
      RETURNING b.*;
    `;
    const values = [status, bookingId, host_id];

    const result = await dbConnection.query(query, values);

    // If rowCount is 0, the booking wasn't found or the user wasn't authorized.
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Booking not found or user not authorized." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/listings/search", async (req, res) => {
  const { city, province, checkin, checkout, guests } = req.query;

  if (!city) {
    return res.status(400).json({
      error: "City is required.",
    });
  }

  try {
    const minGuests = parseInt(guests || 1);

    let query;
    let values;

    if (checkin && checkout) {
      // With date filtering - check both booking conflicts AND listing availability
      if (province) {
        query = `
          SELECT l.*, c.latitude, c.longitude
          FROM "listing" l
          JOIN "coordinates" c ON l.listing_id = c.listing_id
          WHERE LOWER(l.city) = LOWER($1)
            AND LOWER(l.province) = LOWER($2)
            AND l.guest_limit >= $3
            -- Check if listing availability window includes requested dates
            AND (
              l.available_from IS NULL 
              OR (l.available_from <= $4 AND l.available_to >= $5)
            )
            -- Check for booking conflicts
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
            -- Check if listing availability window includes requested dates
            AND (
              l.available_from IS NULL 
              OR (l.available_from <= $3 AND l.available_to >= $4)
            )
            -- Check for booking conflicts
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
      // Without date filtering - just show all listings
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
});

/**
 * [PUT] /api/booking/:bookingId
 * Gets all listings for a user
 *
 * Request Body:
 * {
 * "status": "Approved" | "Rejected"
 * }
 */
app.get("/api/listings", isAuthenticated, async (req, res) => {
  try {
    const host_id = req.user.id;

    if (!host_id) {
      return res.status(400).json({ error: "User ID missing in headers" });
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
});

/**
 * [PUT] /api/listing/:listingId
 * Updates an existing listing.
 *
 * This endpoint is protected. A user can only update their own listings.
 */
app.put("/api/listing/:listingId", isAuthenticated, async (req, res) => {
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
  if (!title || !address || !city || !province || !postal_code || !url) {
    return res.status(400).json({
      error: "All fields are required.",
    });
  }

  // Validate postal code format (Canadian)
  const postalCodePattern = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
  if (!postalCodePattern.test(postal_code)) {
    return res.status(400).json({
      error: "Invalid Canadian postal code format (e.g., A1A 1A1)",
    });
  }

  // Validate guest limit
  if (isNaN(guest_limit) || guest_limit < 1) {
    return res.status(400).json({
      error: "Guest limit must be at least 1",
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      error: "Invalid image URL format",
    });
  }
  console.log("here");
  try {
    await dbConnection.query("BEGIN");

    // Verify ownership
    const ownerCheck = await dbConnection.query(
      "SELECT user_id FROM listing WHERE listing_id = $1",
      [listingId]
    );

    if (ownerCheck.rows.length === 0) {
      await dbConnection.query("ROLLBACK");
      return res.status(404).json({ error: "Listing not found" });
    }

    if (ownerCheck.rows[0].user_id !== user_id) {
      await dbConnection.query("ROLLBACK");
      return res.status(403).json({ error: "Unauthorized" });
    }

    // If address changed, re-geocode
    let shouldUpdateCoordinates = false;
    const oldListing = ownerCheck.rows[0];

    const oldAddress = await dbConnection.query(
      "SELECT address, city, province, postal_code FROM listing WHERE listing_id = $1",
      [listingId]
    );

    const oldData = oldAddress.rows[0];
    if (
      oldData.address !== address ||
      oldData.city !== city ||
      oldData.province !== province ||
      oldData.postal_code !== postal_code
    ) {
      shouldUpdateCoordinates = true;
    }

    let coordinates;
    if (shouldUpdateCoordinates) {
      coordinates = await getCoordinates(address, city, province, postal_code);
      if (!coordinates) {
        await dbConnection.query("ROLLBACK");
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

    const result = await dbConnection.query(updateQuery, updateValues);

    // Update coordinates if address changed
    if (shouldUpdateCoordinates && coordinates) {
      await dbConnection.query(
        "UPDATE coordinates SET latitude = $1, longitude = $2 WHERE listing_id = $3",
        [coordinates.latitude, coordinates.longitude, listingId]
      );
    }

    await dbConnection.query("COMMIT");
    res.status(200).json(result.rows[0]);
  } catch (err) {
    await dbConnection.query("ROLLBACK");
    console.error("Error updating listing:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/listing/:listingId/requests
 * Gets all booking requests for a specific listing.
 * Only the listing owner can access this.
 */
app.get(
  "/api/listing/:listingId/requests",
  isAuthenticated,
  async (req, res) => {
    const host_id = req.user.id;
    const { listingId } = req.params;

    try {
      // Verify ownership and get requests
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
  }
);

/**
 * [GET] /api/booking/pending
 * Fetches all 'Pending' booking for the authenticated user with listing details.
 */
app.get("/api/booking/pending", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;

  try {
    const query = `
      SELECT 
        b.*,
        l.title as listing_title,
        l.city as listing_city,
        l.province as listing_province,
        l.url as listing_image
      FROM "booking" b
      JOIN "listing" l ON b.listing_id = l.listing_id
      WHERE b.user_id = $1 AND b.status = 'Pending'
      ORDER BY b.start_date ASC
    `;
    const values = [user_id];
    const result = await dbConnection.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching pending booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/booking/approved
 * Fetches all 'Approved' (upcoming) booking for the authenticated user.
 */
app.get("/api/booking/approved", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;

  try {
    const query = `
      SELECT 
        b.*,
        l.title as listing_title,
        l.city as listing_city,
        l.province as listing_province,
        l.url as listing_image
      FROM "booking" b
      JOIN "listing" l ON b.listing_id = l.listing_id
      WHERE b.user_id = $1 AND b.status = 'Approved'
      ORDER BY b.start_date ASC
    `;
    const values = [user_id];
    const result = await dbConnection.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching approved booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * [GET] /api/booking/past
 * Fetches all 'Completed' or 'Rejected' booking for the authenticated user.
 */
app.get("/api/booking/past", isAuthenticated, async (req, res) => {
  const user_id = req.user.id;

  try {
    const query = `
      SELECT 
        b.*,
        l.title as listing_title,
        l.city as listing_city,
        l.province as listing_province,
        l.url as listing_image
      FROM "booking" b
      JOIN "listing" l ON b.listing_id = l.listing_id
      WHERE b.user_id = $1 AND (b.status = 'Completed' OR b.status = 'Rejected')
      ORDER BY b.start_date DESC
    `;
    const values = [user_id];
    const result = await dbConnection.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching past booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Listening on: " +
      (process.env.BETTER_AUTH_URL ||
        `http://localhost:${process.env.PORT || 3000}`)
  );
});
