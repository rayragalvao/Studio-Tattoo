import React, { useState } from "react";
import "./hero.css";
import { ModalCadastro } from "../../generalComponents/modal/modalCadastro/ModalCadastro.jsx";
import { ModalLogin } from "../../generalComponents/modal/modalLogin/ModalLogin.jsx";

export const Hero = () => {
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");

  const openCadastroModal = () => {
    setIsCadastroModalOpen(true);
  };

  const closeCadastroModal = () => {
    setIsCadastroModalOpen(false);
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

  return (
    <header className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Bem-vindo ao estúdio da<br />sua próxima tatuagem</h1>
          <p>
            Aqui, cada traço é pensado para transformar sua ideia em<br />
            uma arte única. Mais do que uma tattoo, você<br />
            leva uma história marcada na pele, com estilo,<br />
            técnica e autenticidade em cada detalhe.
          </p>
          <button onClick={openCadastroModal} className="btn-primary">Entrar no mundo da tattoo</button>
        </div>
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
    </header>
  );
};
