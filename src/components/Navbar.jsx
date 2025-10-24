/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import logoBranca from "../assets/img/logo-branca.png";
import ModalCadastro from "./ModalCadastro";
import ModalLogin from "./ModalLogin";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openCadastroModal = () => {
    setIsCadastroModalOpen(true);
  };

  const closeCadastroModal = () => {
    setIsCadastroModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const switchToCadastro = () => {
    setTransitionClass("transitioning-out");
    
    setTimeout(() => {
      setIsLoginModalOpen(false);
      setTransitionClass("transitioning-in");
      setIsCadastroModalOpen(true);
      
      setTimeout(() => {
        setTransitionClass("");
      }, 400);
    }, 300);
  };

  const switchToLogin = () => {
    setTransitionClass("transitioning-out");
    
    setTimeout(() => {
      setIsCadastroModalOpen(false);
      setTransitionClass("transitioning-in");
      setIsLoginModalOpen(true);
      
      // Limpar classe após animação
      setTimeout(() => {
        setTransitionClass("");
      }, 400);
    }, 300);
  };

  const menuItems = [
    { label: "Início", to: "/" },
    { label: "Portfólio", to: "/portfolio" },
    { label: "Agendamento", to: "/agendamento" },
    { label: "Orçamento", to: "/orcamento" },
    { label: "Estoque", to: "/estoque" }
  ];

  return (
    <div className="nav-outer">
      <div className="nav-inner">
        <nav className="navbar">
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
          {isAuthenticated ? (
            <div className="user-info">
              <span className="user-name">Olá, {user?.nome || 'Usuário'}</span>
              <button onClick={logout} className="btn-logout">Sair</button>
            </div>
          ) : (
            <>
              <button onClick={openCadastroModal} className="btn-cadastro">Cadastro</button>
              <button onClick={openLoginModal} className="btn-login">Login</button>
            </>
          )}
        </div>
      </nav>
      </div>

      <ModalCadastro 
        isOpen={isCadastroModalOpen} 
        onClose={closeCadastroModal}
        onSwitchToLogin={switchToLogin}
        transitionClass={transitionClass}
      />
      <ModalLogin 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal}
        onSwitchToCadastro={switchToCadastro}
        transitionClass={transitionClass}
      />
    </div>
  );
};

export default Navbar;