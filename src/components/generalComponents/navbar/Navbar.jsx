/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import logoBranca from "../../../assets/img/logo-branca.png";
import { ModalCadastro } from "../modal/modalCadastro/ModalCadastro.jsx";
import { ModalLogin } from "../modal/modalLogin/ModalLogin.jsx";
import "./navbar.css";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return 'Usuário';
    return nomeCompleto.trim().split(' ')[0];
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    document.body.classList.add('logging-out');
    
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      document.body.classList.remove('logging-out');
    }, 800);
  };

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
            <div className={`user-info ${isLoggingOut ? 'logging-out' : ''}`}>
              <span className="user-name">Olá, {getPrimeiroNome(user?.nome)}</span>
              <button onClick={handleLogout} className={`btn-logout ${isLoggingOut ? 'loading' : ''}`} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <span className="logout-animation">
                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Saindo...
                  </span>
                ) : (
                  'Sair'
                )}
              </button>
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