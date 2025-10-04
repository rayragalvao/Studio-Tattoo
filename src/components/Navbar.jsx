import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoBranca from "../assets/img/logo-branca.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: "Início", to: "/" },
    { label: "Portfólio", to: "/portfolio" },
    { label: "Agendamento", to: "/agendamento" },
    { label: "Orçamento", to: "/orcamento" }
  ];

  return (
    <div className="nav-outer">
      <div className="nav-inner">
        <nav className="navbar">
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="logo">
          <Link to="/">
            <img src={logoBranca} alt="Tattoo Studio" />
          </Link>
        </div>
        
        <ul className={`menu ${isMenuOpen ? 'open' : ''}`}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="actions">
          <a href="#cadastro" className="btn-cadastro">Cadastro</a>
          <a href="#login" className="btn-login">Login</a>
        </div>
      </nav>
      </div>
    </div>
  );
};

export default Navbar;