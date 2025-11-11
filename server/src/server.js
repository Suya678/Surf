import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// Import your routes
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

console.log("NODE_ENV:", process.env.NODE_ENV);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Security
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

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
// Rate limiter
app.use(limiter);

// ===== API ROUTES (MUST BE FIRST!) =====
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());
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
  console.log(`📱 Frontend: ${process.env.CLIENT_URL}`);
  console.log(`🔌 Backend: ${process.env.CLIENT_URL}/api`);
});
export default app;
