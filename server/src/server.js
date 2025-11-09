import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./utils/auth.js";
import { dbConnection } from "./db/dbClient.js";
import { toNodeHandler } from "better-auth/node";
import crypto from "crypto"; // Import crypto for generating UUIDs
import isAuthenticated from "./middleware/isAuthenticated.js"; // Import the auth middleware

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
 * Creates a new listing for a user.
 *
 * Request Body:
 * {
 * "user_id": "user_id_from_auth",
 * "title": "Beautiful Downtown Apartment",
 * "description": "A lovely place to stay, with all amenities.",
 * "address": "123 Main St",
 * "city": "Metropolis",
 * "province": "NY",
 * "postal_code": "10001",
 * "guest_limit": 2
 * }
 *
 * SECURITY NOTE: This endpoint is currently UNPROTECTED.
 * You should protect this route using authentication middleware.
 * If you use `auth.protect()`, you could get the user ID from
 * `req.user.id` instead of trusting the "user_id" in the body.
 */
app.post("/api/listing/create", isAuthenticated, async (req, res) => {
  const {
    title,
    description,
    address,
    city,
    province,
    postal_code,
    guest_limit,
  } = req.body;
  const user_id = req.user.id; // Get the user ID from the authenticated session

  // --- Input Validation ---
  // We no longer need to check for user_id, as the middleware guarantees it
  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (guest_limit && typeof guest_limit !== "number") {
    return res.status(400).json({ error: "Guest limit must be a number." });
  }
  // --- End Validation ---

  try {
    // Generate a new unique listing_id
    const listing_id = crypto.randomUUID();

    const query = `
      INSERT INTO "listing" (
        listing_id,
        user_id,
        title,
        description,
        address,
        city,
        province,
        postal_code,
        guest_limit
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      listing_id,
      user_id,
      title,
      description || null,
      address || null,
      city || null,
      province || null,
      postal_code || null,
      guest_limit || null,
    ];

    const result = await dbConnection.query(query, values);

    // Send back the newly created listing data
    res.status(201).json(result.rows[0]); // 201 Created
  } catch (err) {
    console.error("Error creating listing:", err);
    // Check for foreign key violation (user ID doesn't exist in 'user' table)
    if (err.code === "23503") {
      return res.status(404).json({
        error: "User not found. Cannot create listing for non-existent user.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
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

app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Listening on: " +
      (process.env.BETTER_AUTH_URL ||
        `http://localhost:${process.env.PORT || 3000}`)
  );
});
