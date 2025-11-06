import React from "react";
import fotoJulia from "../../../assets/img/julia.jpeg";
import "./sobre.css";

export const Sobre = () => {
  return (
    <section className="sobre">
      <div className="foto">
        <img src={fotoJulia} alt="Julia Tatuadora" />
      </div>
      <div className="texto">
        <h1>Quem está por trás da arte</h1>
        <p>
          Um pouco da minha trajetória como tatuadora. <br /><br />
          Apaixonada por arte desde cedo, encontrei na<br />
           tatuagem a forma perfeita de expressar<br />
           criatividade e eternizar sentimentos. Minha<br />
           missão é transformar emoções em tatuagens<br />
           personalizadas, com cuidado e dedicação em<br />
           cada sessão.
        </p>
      </div>
    </section>
  );
};
