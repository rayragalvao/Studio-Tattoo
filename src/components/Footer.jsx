import React from "react";
import footerLogo from "../assets/img/footer.png";
import footerInsta from "../assets/img/footer-insta.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-menu">
          <h3>Menu</h3>
          <a href="#">Início</a>
          <a href="#">Portfólio</a>
          <a href="#">Agendamento</a>
          <a href="#">Orçamento</a>
        </div>

        <div className="footer-social">
          <h3>Redes sociais</h3>
          <div className="social-link">
            <img src={footerInsta} alt="Instagram" />
            <span>@jupiterfrito</span>
          </div>
        </div>

        <div className="footer-logo">
          <img src={footerLogo} alt="Logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
