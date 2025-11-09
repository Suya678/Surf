import { authClient } from "../../lib/auth";
import { Link } from "react-router";
import LogoutButton from "../LogoutButton";
import { Menu, LogIn } from "lucide-react";

const NavBar = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Start: Logo + Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle lg:hidden">
            <Menu className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-200 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li className="border-t mt-2 pt-2">
              {session ? (
                <LogoutButton />
              ) : (
                <Link to="/login">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
              )}
            </li>
          </ul>
        </div>
        <Link to="/" className="flex items-center">
          <img src="/HomeSurfLogo.png" className="h-16 w-auto" alt="HomeSurf" />
        </Link>
      </div>

      {/* End: Desktop Links */}
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
        <div className="divider divider-horizontal"></div>
        {session ? (
          <LogoutButton />
        ) : (
          <Link to="/login">
            <button className="btn btn-sm btn-primary">
              <LogIn className="h-4 w-4" />
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
