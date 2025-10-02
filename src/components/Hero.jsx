import React from "react";

const Hero = () => {
  return (
    <header className="hero">
      <div className="nav-inner">
        <nav className="navbar">
          <button className="hamburger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className="menu">
            <li><a href="#">Início</a></li>
            <li><a href="#">Portfólio</a></li>
            <li><a href="#">Agendamento</a></li>
            <li><a href="#">Orçamento</a></li>
          </ul>
          <div className="actions">
            <a href="#" className="btn-cadastro">Cadastro</a>
            <a href="#" className="btn-login">Login</a>
          </div>
        </nav>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1>Bem-vindo ao estúdio da<br />sua próxima tatuagem</h1>
          <p>
            Aqui, cada traço é pensado para transformar sua ideia em<br />
            uma arte única. Mais do que uma tattoo, você<br />
            leva uma história marcada na pele, com estilo,<br />
            técnica e autenticidade em cada detalhe.
          </p>
          <a href="#" className="btn-primary">Entrar no mundo da tattoo</a>
        </div>
      </div>
    </header>
  );
};

export default Hero;
