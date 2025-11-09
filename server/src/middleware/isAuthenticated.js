import { fromNodeHeaders } from "better-auth/node";
import auth from "../utils/auth.js";

/**
 * Express middleware to check if a user is authenticated.
 *
 * If user is in a valid session, it attaches the user object to the request object, and
 * passes control to the next middleware
 *
 * If the user is not in a valid session, it returns with a 401
 */
const isAuthenticated = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = session.user;
  next();
};

export default isAuthenticated;