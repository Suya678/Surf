import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./utils/auth.js";
import { dbConnection } from "./db/dbClient.js";
import { toNodeHandler } from "better-auth/node";
const app = express();
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Just checking the if db is connected, it will throw an error if not
await dbConnection.query("Select 1");

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on: " + process.env.BETTER_AUTH_URL);
});
