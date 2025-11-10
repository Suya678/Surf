import { betterAuth } from "better-auth";
import { dbConnection } from "../db/dbClient.js";
import { openAPI } from "better-auth/plugins";
import "dotenv/config";
console.log("=== Better Auth Environment Check ===");
console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);
console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("====================================");

export const auth = betterAuth({
  database: dbConnection,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: false,
  },
  trustedOrigins: [process.env.CLIENT_URL],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      accountType: {
        type: "string",
        required: true,
      },
      onboardingCompleted: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
});

export default auth;
