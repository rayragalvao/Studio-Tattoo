import React from "react";
import "./geolocalizacao.css";

export const Geolocalizacao = () => {
  const address = "avenida celso garcia, 3982";
  const apiKey = "AIzaSyDBcHYxYgz4PZqfFoxjPW74x3-hubucQ60"; 

  return (
    <section className="geolocalizacao">
      <div className="texto">
        <h1>Sua arte começa neste ponto do mapa</h1>
      </div>

      <div className="mapa">
        <iframe
          title="Localização do Studio"
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: "15px" }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
            address
          )}`}
        />
      </div>
    </section>
  );
};
