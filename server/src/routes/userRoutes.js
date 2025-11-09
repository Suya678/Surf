/**
 * @file routes/userRoutes.js
 * @description Defines API routes for user-related actions.
 * All routes in this file are prefixed with /api/user.
 */

 import express from "express";
 import isAuthenticated from "../middleware/isAuthenticated.js";
 import {
   checkOnboarding,
   updateOnboarding,
   updateInfo,
 } from "../controllers/userController.js";
 
 const router = express.Router();
 
 /**
  * [GET] /api/user/check-onboarding
  * Checks if the authenticated user has completed onboarding.
  */
 router.get("/check-onboarding", isAuthenticated, checkOnboarding);
 
 /**
  * [POST] /api/user/update-onboarding
  * Updates the authenticated user's account type and onboarding status.
  */
 router.post("/update-onboarding", isAuthenticated, updateOnboarding);
 
 /**
  * [POST] /api/user/update-info
  * Inserts or updates the authenticated user's profile information.
  */
 router.post("/update-info", isAuthenticated, updateInfo);
 
 export default router;