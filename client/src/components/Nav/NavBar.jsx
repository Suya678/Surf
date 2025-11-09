import { authClient } from "../../lib/auth";
import { Link } from "react-router";
import LogoutButton from "../LogoutButton";
import NavLinks from "./NavLinks";

const NavBar = () => {
  const { data: session } = authClient.useSession();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-bg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <NavLinks />
          </ul>
        </div>
        <a className="btn btn-ghost text-xl font-bold font-sans">Surf</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg">
          <NavLinks />
        </ul>
      </div>
      <div className="navbar-end space-x-3">
        <Link to="/about">
          <button className="btn btn-sm">About</button>
        </Link>
        {session ? (
          <LogoutButton />
        ) : (
          <Link to="/Login">
            <button className="btn btn-sm">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
