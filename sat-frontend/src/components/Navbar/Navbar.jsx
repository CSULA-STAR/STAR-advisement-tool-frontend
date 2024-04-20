import { NavLink } from "react-router-dom";
import "./NavbarStyle.css";

const Navbar = () => {
  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          SAT
        </NavLink>

        <div className={"nav__menu"} id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className="nav__link">
                Home
              </NavLink>
            </li>

            {/* <li className="nav__item">
              <NavLink to="/nav1" className="nav__link">
                Nav 1
              </NavLink>
            </li> */}
            {/* <li className="nav__item">
              <NavLink to="/login" className="nav__link nav__cta">
                Login
              </NavLink>
            </li> */}
          </ul>
          <div className="nav__close" id="nav-close">
            {/* <IoClose /> */}
          </div>
          <div className="nav__toggle" id="nav-toggle">
            {/* <IoMenu /> */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
