/**
 * @file controllers/userController.js
 * @description Contains route handler logic for user endpoints.
 */

 import { dbConnection } from "../db/dbClient.js";

 /**
  * [GET] /api/user/check-onboarding
  * Checks if the currently authenticated user has completed the onboarding process.
  */
 export const checkOnboarding = async (req, res) => {
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
       return res.status(404).json({ error: "User not found." });
     }
 
     res
       .status(200)
       .json({ onboardingCompleted: !!result.rows[0].onboardingCompleted });
   } catch (err) {
     console.error("Error checking user onboarding status:", err);
     res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [POST] /api/user/update-onboarding
  * Updates a user's account type and onboarding status.
  * This also upserts their initial info into user_info.
  */
 export const updateOnboarding = async (req, res) => {
   const { accountType, age, gender, race, bio } = req.body;
   const { id } = req.user; // Get the user ID from the authenticated session
   const ageParsed = Number(age);
 
   if (age && isNaN(ageParsed)) {
     return res.status(400).json({ error: "Age must be a number." });
   }
 
   try {
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
     res.status(200).json(result.rows[0]);
   } catch (err) {
     console.error("Error upserting user info:", err);
     if (err.code === "23503") {
       return res.status(404).json({
         error: "User not found. Cannot update info for non-existent user.",
       });
     }
     res.status(500).json({ error: "Internal server error" });
   }
 };
 
 /**
  * [POST] /api/user/update-info
  * Inserts or updates a user's profile information in the user_info table.
  */
 export const updateInfo = async (req, res) => {
   const { age, gender, race, bio } = req.body;
   const { id } = req.user; // Get the user ID from the authenticated session
 
   if (age && typeof age !== "number") {
     return res.status(400).json({ error: "Age must be a number." });
   }
 
   try {
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
     const values = [id, age || null, gender || null, race || null, bio || null];
 
     const result = await dbConnection.query(query, values);
     res.status(200).json(result.rows[0]);
   } catch (err) {
     console.error("Error upserting user info:", err);
     if (err.code === "23503") {
       return res.status(404).json({
         error: "User not found. Cannot update info for non-existent user.",
       });
     }
     res.status(500).json({ error: "Internal server error" });
   }
 };