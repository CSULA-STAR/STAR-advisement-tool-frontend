import { NavLink, useLocation } from "react-router-dom";
import "./NavbarStyle.css";

const Navbar = () => {
  const location = useLocation();
  const showMappingLink = ['/', '/mapping', '/map'].includes(location.pathname);

  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          SAT
        </NavLink>

        <div className={"nav__menu"} id="nav-menu">
          <ul className="nav__list">
            {showMappingLink && (
              <li className="nav__item">
                <NavLink to="/mapping" className="nav__link">
                  Mapping
                </NavLink>
              </li>
            )}
            <li className="nav__item">
              <NavLink to="/" className="nav__link">
                Home
              </NavLink>
            </li>
          </ul>
          <div className="nav__close" id="nav-close"></div>
          <div className="nav__toggle" id="nav-toggle"></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
