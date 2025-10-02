import React from "react";
import instaLogo from "../assets/img/instagram.png";
import logoInsta from "../assets/img/logo_insta.png";

import foto1 from "../assets/img/branco.jpg";
import foto2 from "../assets/img/branco.jpg";
import foto3 from "../assets/img/branco.jpg";
import foto4 from "../assets/img/branco.jpg";
import foto5 from "../assets/img/branco.jpg";
import foto6 from "../assets/img/branco.jpg";
import foto7 from "../assets/img/branco.jpg";
import foto8 from "../assets/img/branco.jpg";
import foto9 from "../assets/img/branco.jpg";


const Instagram = () => {
  return (
    <section className="instagram">
      <div className="texto">
        <img src={instaLogo} alt="Logo do Instagram" className="logo" />
        <h1>Últimas criações</h1>
      </div>
      <div className="logo-insta">
        <img src={logoInsta} alt="Logo do Palhaço" />
        <h3>@jupiterfrito</h3>
      </div>

     <div className="grid">
        <img src={foto1} alt="Foto 1" />
        <img src={foto2} alt="Foto 2" />
        <img src={foto3} alt="Foto 3" />
        <img src={foto4} alt="Foto 3" /> 
        <img src={foto5} alt="Foto 3" /> 
        <img src={foto6} alt="Foto 3" /> 
        <img src={foto7} alt="Foto 3" /> 
        <img src={foto8} alt="Foto 3" /> 
        <img src={foto9} alt="Foto 3" /> 
        {/* continue adicionando */}
      </div>
      
    </section>
  );
};

export default Instagram;
