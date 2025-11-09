import { Link } from "react-router";
import LogoutButton from "../LogoutButton";
import { Plus, Menu } from "lucide-react";

const NavBarHost = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b-2 border-primary">
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
              <Link to="/addListing">
                <Plus className="h-4 w-4" /> Add Listing
              </Link>
            </li>
            <li>
              <Link to="/hostDashboard">Dashboard</Link>
            </li>
            <li className="border-t mt-2 pt-2">
              <LogoutButton />
            </li>
          </ul>
        </div>
        <Link to="/">
          <img src="/HomeSurfLogo.png" className="h-22 w-22" alt="HomeSurf" />
        </Link>
      </div>

      {/* End: Desktop Links */}
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/addListing" className="btn btn-sm btn-primary">
              <Plus className="h-4 w-4" /> Add Listing
            </Link>
          </li>
          <li>
            <Link to="/hostDashboard">Dashboard</Link>
          </li>
        </ul>
        <div className="divider divider-horizontal"></div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default NavBarHost;
