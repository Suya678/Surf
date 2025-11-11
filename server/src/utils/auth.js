/ utils/auth.js
import { betterAuth } from "better-auth";
import { dbConnection } from "../db/dbClient.js";
import { openAPI } from "better-auth/plugins";
import crypto from "crypto";
import "dotenv/config";

console.log("=== Better Auth Environment Check ===");
console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);
console.log("GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("Node env", process.env.NODE_ENV);
console.log("====================================");

export const auth = betterAuth({
  database: dbConnection,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  
  trustedOrigins: [process.env.CLIENT_URL],
  
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    database: {
      generateId: () => crypto.randomUUID(),
    },
    // REMOVE THIS - Don't configure state cookies at all
    // Let Better Auth use database-only verification
    // cookies: {
    //   state: { ... }
    // },
  },
  
  // Add session configuration
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  
  plugins: [openAPI()],
  
  emailAndPassword: {
    enabled: false,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Ensure redirect URI is explicit
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
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