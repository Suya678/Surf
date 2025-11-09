import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // This should be base url of the server
  baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth`,
});

/**
 *  Starts the oauth process using the "provider"
 */
export const handleLogin = async (provider) => {
  console.log(provider);
  await authClient.signIn.social({
    provider: provider,
    callbackURL: `${import.meta.env.VITE_CLIENT_BASE_URL}/dashboard`,
    /* TODO, optional
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
      disableRedirect: true,
      */
  });
};
