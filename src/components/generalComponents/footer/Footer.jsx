import React from "react";
import footerLogo from "../../../assets/img/footer.png";
import footerInsta from "../../../assets/img/footer-insta.png";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import './footer.css';

export const Footer = () => {
  const { isAuthenticated, user } = useAuth();

  const baseMenuItems = [
    { label: "Início", to: "/" },
    { label: "Portfólio", to: "/portfolio" },
    { label: "Orçamento", to: "/orcamento" }
  ];

  let menuItems = [...baseMenuItems];
  
  if (isAuthenticated) {
    if (user?.isAdmin) {
      menuItems.push({ label: "Estoque", to: "/estoque" });
    } else {
      menuItems.splice(2, 0, { label: "Agendamento", to: "/agendamento" });
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-menu">
          <h3>Menu</h3>
          
          {menuItems.map((item, index) => (
            <span key={index}>
              <NavLink 
                to={item.to}
                className={"menu-link"}
              >
                {item.label}
              </NavLink>
            </span>
          ))}
        </div>

        <div className="footer-social">
          <h3>Redes sociais</h3>
          <div className="social-link">
            <img src={footerInsta} alt="Instagram" />
            <a href="https://www.instagram.com/jupiterfrito?igsh=NXljZ3V5OXJseG04" target="_blank" className="menu-link">@jupiterfrito</a>
          </div>
        </div>

        <div className="footer-logo">
          <img src={footerLogo} alt="Logo" />
        </div>
      </div>
    </footer>
  );
};
