/**
 * @file controllers/bookingController.js
 * @description Contains route handler logic for booking endpoints.
 */

 import { dbConnection } from "../db/dbClient.js";
 import crypto from "crypto";
 import { validateDates } from "../utils/validation.js";
 
 /**
  * [POST] /api/booking/create
  * Creates a new booking for a listing.
  */
 export const createBooking = async (req, res) => {
   const user_id = req.user.id;
   const { listing_id, start_date, end_date } = req.body;
 
   if (!listing_id || !start_date || !end_date) {
     return res
       .status(400)
       .json({ error: "listing_id, start_date, and end_date are required." });
   }
 
   const dateError = validateDates(start_date, end_date);
   if (dateError) {
     return res.status(400).json({ error: dateError });
   }
 
   try {
     const booking_id = crypto.randomUUID();
     const query = `
       INSERT INTO "booking" (
         booking_id, listing_id, user_id, start_date, end_date
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;
     `;
     const values = [booking_id, listing_id, user_id, start_date, end_date];
 
     const result = await dbConnection.query(query, values);
     res.status(201).json(result.rows[0]);
   } catch (err) {
     console.error("Error creating booking:", err);
     if (err.code === "23503") {
       return res.status(404).json({ error: "Listing not found." });
     }
     res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [DELETE] /api/booking/:bookingId
  * Deletes a specific booking.
  */
 export const deleteBooking = async (req, res) => {
   const user_id = req.user.id;
   const { bookingId } = req.params;
 
   if (!bookingId) {
     return res.status(400).json({ error: "Booking ID is required." });
   }
 
   try {
     const query = `
       DELETE FROM "booking"
       WHERE booking_id = $1 AND user_id = $2
       RETURNING booking_id;
     `;
     const values = [bookingId, user_id];
     const result = await dbConnection.query(query, values);
 
     if (result.rowCount === 0) {
       return res
         .status(404)
         .json({ error: "Booking not found or user not authorized." });
     }
 
     res.status(200).json({
       message: "Booking deleted successfully.",
       bookingId: result.rows[0].booking_id,
     });
   } catch (err) {
     console.error("Error deleting booking:", err);
     res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [GET] /api/booking/pending
  * Fetches all 'Pending' bookings for the authenticated user.
  */
 export const getPendingBookings = async (req, res) => {
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
 };
 
 /**
  * [GET] /api/booking/approved
  * Fetches all 'Approved' (upcoming) bookings for the authenticated user.
  */
 export const getApprovedBookings = async (req, res) => {
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
 };
 
 /**
  * [GET] /api/booking/past
  * Fetches all 'Completed' or 'Rejected' bookings for the authenticated user.
  */
 export const getPastBookings = async (req, res) => {
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
 };
 
 /**
  * [GET] /api/booking/requests
  * Fetches all 'Pending' booking requests for listings owned by the host.
  */
 export const getBookingRequests = async (req, res) => {
   const host_id = req.user.id;
 
   try {
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
 };
 
 /**
  * [PUT] /api/booking/:bookingId
  * Updates the status of a booking (Host action).
  */
 export const updateBookingStatus = async (req, res) => {
   const host_id = req.user.id;
   const { bookingId } = req.params;
   const { status } = req.body;
 
   if (!status || (status !== "Approved" && status !== "Rejected")) {
     return res
       .status(400)
       .json({ error: "Invalid status. Must be 'Approved' or 'Rejected'." });
   }
 
   try {
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
 };