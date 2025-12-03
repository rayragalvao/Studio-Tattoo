/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useIsMobile } from "../../../hooks/useIsMobile.js";
import logoBranca from "../../../assets/img/logo-branca.png";
import { ModalCadastro } from "../modal/modalCadastro/ModalCadastro.jsx";
import { ModalLogin } from "../modal/modalLogin/ModalLogin.jsx";
import "./navBar.css";
// Ajustado para permitir customização (ocultar logo e definir itens do menu)
export const Navbar = ({ customMenuItems = null, hideLogo = false }) => {
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

  const isCustom = Array.isArray(customMenuItems) && customMenuItems.length > 0;

  let menuItems;
  if (isCustom) {
    // Usa exatamente os itens fornecidos (ex: Início, Estoque, Agendamentos, Orçamentos)
    menuItems = customMenuItems;
  } else {
    // Lógica padrão original
    const baseMenuItems = [
      { label: "Início", to: "/" },
      { label: "Portfólio", to: "/portfolio" },
      { label: "Orçamento", to: "/orcamento" }
    ];
    if (isAuthenticated && user?.isAdmin) {
      // Para admin: ocultar Portfólio e usar Orçamentos (admin)
      menuItems = [
        { label: "Início", to: "/" },
        { label: "Orçamentos", to: "/admin/orcamentos" },
        { label: "Dashboard", to: "/dashboard" },
        { label: "Estoque", to: "/estoque" }
      ];
    } else {

      // Para usuários não autenticados ou clientes
      menuItems = [
        { label: "Início", to: "/" },
        { label: "Portfólio", to: "/portfolio" },
        { label: "Agendar", to: "/agendamento" },
        { label: "Orçamento", to: "/orcamento" },
        { label: "Menu", to: "/menu-cliente" }
      ];
    }
  }

  return (
    <div className="nav-outer">
      <div className="nav-inner">
        <nav className={`navbar ${hideLogo ? 'no-logo' : ''}`}>
        {/* Greeting deslocado para a área de ações à direita para evitar sobreposição */}
        {!hideLogo && (
          <div className="logo">
            <Link to="/">
              <img src={logoBranca} alt="Tattoo Studio" />
            </Link>
          </div>
        )}
        
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
            <button className="menu-close" aria-label="Fechar menu" onClick={closeMenu}>X</button>
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
                    {(!isCustom) && <span className="user-name">Olá, {getPrimeiroNome(user?.nome)}</span>}
                    <button onClick={() => { handleLogout(); closeMenu(); }} className={`btn-logout ${isLoggingOut ? 'loading' : ''}`} disabled={isLoggingOut}>
                      {isLoggingOut ? 'Saindo...' : 'Sair'}
                    </button>
                  </div>
                ) : (
                  !isCustom && (
                    <>
                      <button onClick={() => { openCadastroModal(); closeMenu(); }} className="btn-cadastro">Cadastro</button>
                      <button onClick={() => { openLoginModal(); closeMenu(); }} className="btn-login">Login</button>
                    </>
                  )
                )}
              </div>
            </li>
          )}
        </ul>
        
        <div className="actions">
          {isAuthenticated ? (
            <div className={`user-info ${isLoggingOut ? 'logging-out' : ''}`}>

              {!isCustom && (
                <span className="user-name">
                  {user?.isAdmin ? 'Olá, admin' : `Olá, ${getPrimeiroNome(user?.nome)}`}
                </span>
              )}
              
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
            !isCustom && (
              <>
                <button onClick={openCadastroModal} className="btn-cadastro">Cadastro</button>
                <button onClick={openLoginModal} className="btn-login">Login</button>
              </>
            )
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