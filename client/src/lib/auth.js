// Frontend - auth client
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  fetchOptions: {
    credentials: "include", // Important for cross-origin cookies
  },
});

/**
 * Starts the OAuth process
 */
export const handleLogin = async (provider) => {
  try {
    await authClient.signIn.social({
      provider: provider,
      // Use RELATIVE path, not full URL
      callbackURL: `${import.meta.env.VITE_CLIENT_BASE_URL}/dashboard`,
    });
  } catch (error) {
    console.error("Login error:", error);
    // Handle error appropriately
  }
};
