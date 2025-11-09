import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // This should be base url of the server
  baseURL: "http://localhost:3000/api/auth",
});

/**
 *  Starts the oauth process using the "provider"
 */
export const handleLogin = async (provider) => {
  console.log(provider);
  console.log(import.meta.env.VITE_SERVER_BASE_URL);
  await authClient.signIn.social({
    provider: provider,
    callbackURL: "http://localhost:5173/home",
    /* TODO, optional
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
      disableRedirect: true,
      */
  });
};
