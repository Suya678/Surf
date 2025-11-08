import { betterAuth } from "better-auth";
import { dbConnection } from "../db/dbClient.js";
import { openAPI } from "better-auth/plugins";
import "dotenv/config";

// Better auth config
const auth = betterAuth({
  database: dbConnection,
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
});
export default auth;
