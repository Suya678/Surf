/**
 * @file server.js
 * @description Main Express server entry point.
 * This file is responsible for:
 * - Initializing the Express app
 * - Setting up middleware (CORS, JSON parser)
 * - Checking the database connection
 * - Mounting all API routes
 * - Starting the server
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./utils/auth.js";
import { dbConnection } from "./db/dbClient.js";
import { toNodeHandler } from "better-auth/node";
import isAuthenticated from "./middleware/isAuthenticated.js";

// Import route handlers
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

// --- Middleware Setup ---
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173", // Always allow local dev
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Authentication routes (handled by better-auth)
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// --- Database Connection Check ---

try {
  await dbConnection.query(`Select 1`);
  console.log("Database connected successfully.");
} catch (err) {
  console.error("Database connection failed:", err);
  process.exit(1); // Exit if DB connection fails
}

// --- API Routes ---

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "HomeSurf API",
    version: "1.0",
  });
});

// Mount feature-specific routes
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/listings", listingRoutes); // for /api/listings/search etc.
app.use("/api/booking", bookingRoutes);

// --- Start Server ---

app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Listening on: " +
      (process.env.BETTER_AUTH_URL ||
        `http://localhost:${process.env.PORT || 3000}`)
  );
});
