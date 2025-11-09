/**
 * @file routes/listingRoutes.js
 * @description Defines API routes for listing-related actions.
 * Prefixes: /api/listing and /api/listings
 */

 import express from "express";
 import isAuthenticated from "../middleware/isAuthenticated.js";
 import {
   createListing,
   deleteListing,
   getMyListings,
   searchListings,
   getHostListings,
   updateListing,
   getListingRequests,
 } from "../controllers/listingController.js";
 
 const router = express.Router();
 
 // --- Routes prefixed with /api/listing ---
 
 /**
  * [POST] /api/listing/create
  * Creates a new listing.
  */
 router.post("/create", isAuthenticated, createListing);
 
 /**
  * [DELETE] /api/listing/:listingId
  * Deletes a specific listing owned by the user.
  */
 router.delete("/:listingId", isAuthenticated, deleteListing);
 
 /**
  * [PUT] /api/listing/:listingId
  * Updates a specific listing owned by the user.
  */
 router.put("/:listingId", isAuthenticated, updateListing);
 
 /**
  * [GET] /api/listing/:listingId/requests
  * Gets all booking requests for a specific listing owned by the host.
  */
 router.get("/:listingId/requests", isAuthenticated, getListingRequests);
 
 // --- Routes prefixed with /api/listings ---
 
 /**
  * [GET] /api/listings/my-listings
  * Fetches all listings created by the authenticated user.
  */
 router.get("/my-listings", isAuthenticated, getMyListings);
 
 /**
  * [GET] /api/listings/search
  * Public endpoint to search for listings.
  */
 router.get("/search", searchListings);
 
 /**
  * [GET] /api/listings
  * Fetches all listings for the authenticated host.
  * (Note: This seems similar to /my-listings, adjust if needed)
  */
 router.get("/", isAuthenticated, getHostListings);
 
 export default router;