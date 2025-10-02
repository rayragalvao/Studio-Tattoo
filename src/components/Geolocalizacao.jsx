import React from "react";
import mapa from "../assets/img/mapa.png";

const Geolocalizacao = () => {
  return (
    <section className="geolocalizacao">
      <div className="texto">
        <h1>Sua arte começa neste ponto do mapa</h1>
      </div>
      <div className="mapa">
        <img src={mapa} alt="Mapa da Localização" />
      </div>
    </section>
  );
};

export default Geolocalizacao;
