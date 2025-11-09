import { Link } from "react-router";
/**
 * Used for navigation
 */
const links = [];
// const links = [{ label: "Home", path: "/" }];

const NavLinks = () => {
  return (
    <>
      {links.map((l) => (
        <li key={l.label}>
          <Link to={l.path}>{l.label}</Link>
        </li>
      ))}
    </>
  );
};

export default NavLinks;
