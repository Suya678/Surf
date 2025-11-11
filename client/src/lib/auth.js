import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Same domain - can use relative URLs!
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const handleLogin = async (provider) => {
  await authClient.signIn.social({
    provider: provider,
    // Same domain callback
    callbackURL: `${import.meta.env.VITE_CLIENT_BASE_URL}/dashboard`,
  });
};
