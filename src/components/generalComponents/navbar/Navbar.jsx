/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import logoBranca from "../../../assets/img/logo-branca.png";
import { ModalCadastro } from "../modal/ModalCadastro.jsx";
import { ModalLogin } from "../modal/ModalLogin.jsx";
import "./navbar.css";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile(768);
  
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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

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
        
        <button
          className={`nav-toggle ${isMenuOpen ? 'open' : ''}`}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
          onClick={toggleMenu}
        >
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <ul id="main-menu" className={`menu ${isMenuOpen ? 'open' : ''}`}>
          {/* close button visible on mobile inside the drawer */}
          <li className="menu-close-wrapper">
            <button className="menu-close" aria-label="Fechar menu" onClick={closeMenu}>✕</button>
          </li>
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
          {/* mobile actions - rendered only on mobile screens */}
          {isMobile && (
            <li className="mobile-actions">
              <div className="actions-mobile">
                {isAuthenticated ? (
                  <div className={`user-info ${isLoggingOut ? 'logging-out' : ''}`}>
                    <span className="user-name">Olá, {getPrimeiroNome(user?.nome)}</span>
                    <button onClick={() => { handleLogout(); closeMenu(); }} className={`btn-logout ${isLoggingOut ? 'loading' : ''}`} disabled={isLoggingOut}>
                      {isLoggingOut ? 'Saindo...' : 'Sair'}
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { openCadastroModal(); closeMenu(); }} className="btn-cadastro">Cadastro</button>
                    <button onClick={() => { openLoginModal(); closeMenu(); }} className="btn-login">Login</button>
                  </>
                )}
              </div>
            </li>
          )}
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