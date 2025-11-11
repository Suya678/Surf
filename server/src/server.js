import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
// Import your routes
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

console.log("Working directory:", process.cwd());
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URI?.substring(0, 30) + "..."
);
console.log("NODE_ENV:", process.env.NODE_ENV);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS - now allowing same origin
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:5173", // For local dev
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (no origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// ===== API ROUTES (MUST BE FIRST!) =====
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/booking", bookingRoutes);

// ===== SERVE FRONTEND (AFTER API ROUTES) =====
const clientDistPath = path.join(__dirname, "../../client/dist");

// Serve static files from the React app
app.use(express.static(clientDistPath));

// Handle React routing - return index.html for all non-API routes
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

export default app;
