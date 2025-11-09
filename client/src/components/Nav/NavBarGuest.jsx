import { Link } from "react-router";
import NavLinks from "./NavLinks";
import LogoutButton from "../LogoutButton";

const NavBarGuest = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm h-16 px-4">
      {/* Navbar Start */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-bg dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <NavLinks />
          </ul>
        </div>
        <Link to="/home" className="flex items-center ml-2">
          <img
            src="/HomeSurfLogo.png"
            className="h-24 w-auto"
            alt="HomeSurf Logo"
          />
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg">
          <NavLinks />
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end space-x-3">
        <Link to="/search">
          <button className="btn btn-sm btn-primary">Search Listings</button>
        </Link>

        <Link to="/guestDashboard">
          <button className="btn btn-sm">Dashboard</button>
        </Link>

        <Link to="/home">
          <button className="btn btn-sm">About</button>
        </Link>

        <LogoutButton />
      </div>
    </div>
  );
};

export default NavBarGuest;
