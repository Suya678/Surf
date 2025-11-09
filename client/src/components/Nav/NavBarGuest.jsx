import { Link } from "react-router";
import LogoutButton from "../LogoutButton";
import { Search, Menu } from "lucide-react";

const NavBarGuest = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b-2 border-accent">
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
              <Link to="/search">
                <Search className="h-4 w-4" /> Search Listings
              </Link>
            </li>
            <li>
              <Link to="/guestDashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/home">About</Link>
            </li>
            <li className="border-t mt-2 pt-2">
              <LogoutButton />
            </li>
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2">
          <img src="/HomeSurfLogo.png" className="h-16 w-auto" alt="HomeSurf" />
        </Link>
      </div>

      {/* End: Desktop Links */}
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/search" className="btn btn-sm btn-accent">
              <Search className="h-4 w-4" /> Search
            </Link>
          </li>
          <li>
            <Link to="/guestDashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/home">About</Link>
          </li>
        </ul>
        <div className="divider divider-horizontal"></div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default NavBarGuest;
