/**
 * @file routes/bookingRoutes.js
 * @description Defines API routes for booking-related actions.
 * All routes in this file are prefixed with /api/booking.
 */

 import express from "express";
 import isAuthenticated from "../middleware/isAuthenticated.js";
 import {
   createBooking,
   deleteBooking,
   getPendingBookings,
   getApprovedBookings,
   getPastBookings,
   getBookingRequests,
   updateBookingStatus,
 } from "../controllers/bookingController.js";
 
 const router = express.Router();
 
 /**
  * [POST] /api/booking/create
  * Creates a new booking for a listing.
  */
 router.post("/create", isAuthenticated, createBooking);
 
 /**
  * [GET] /api/booking/pending
  * Fetches all 'Pending' bookings for the authenticated user.
  */
 router.get("/pending", isAuthenticated, getPendingBookings);
 
 /**
  * [GET] /api/booking/approved
  * Fetches all 'Approved' (upcoming) bookings for the authenticated user.
  */
 router.get("/approved", isAuthenticated, getApprovedBookings);
 
 /**
  * [GET] /api/booking/past
  * Fetches all 'Completed' or 'Rejected' bookings for the authenticated user.
  */
 router.get("/past", isAuthenticated, getPastBookings);
 
 /**
  * [GET] /api/booking/requests
  * Fetches 'Pending' requests for listings owned by the authenticated host.
  */
 router.get("/requests", isAuthenticated, getBookingRequests);
 
 /**
  * [DELETE] /api/booking/:bookingId
  * Deletes a specific booking made by the user.
  */
 router.delete("/:bookingId", isAuthenticated, deleteBooking);
 
 /**
  * [PUT] /api/booking/:bookingId
  * Updates a booking's status (Host action: Approve/Reject).
  */
 router.put("/:bookingId", isAuthenticated, updateBookingStatus);
 
 export default router;