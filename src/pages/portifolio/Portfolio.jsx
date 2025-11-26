import React from "react";
import { Navbar } from "../../components/generalComponents/navbar/Navbar";
import { Footer } from "../../components/generalComponents/footer/Footer";
import { PortifolioCard } from "../../components/portifolioComponents/portifolioCard/PortifolioCard.jsx";
import caveira from '../../assets/img/caveira.png';
import mamadeira from '../../assets/img/mamadeira vodka.png';
import alien from '../../assets/img/alien olhudo.png';
import cadeira from '../../assets/img/cadeira.png';
import lua from '../../assets/img/lua triste.png';
import candelabro from '../../assets/img/candelábro de vinho.png';
import "./portifolio.css";

export const Portfolio = () => {
  return (
    <>
      <Navbar />

      <div className="portfolio-frases">
        <h1 className="portfolio-titulo">Transformando ideias em arte na pele.</h1>
        <h2 className="portfolio-subtitulo">Inspire-se com minhas criações.</h2>
      </div>
      

      <div className="portfolio-grid">
        <PortifolioCard
          imagem={caveira}
          titulo="Caveira"
          tamanho="8"
          precoMin="R$ 150"
          precoMax="R$ 300"
        />
        <PortifolioCard
          imagem={mamadeira}
          titulo="Mamadeira Vodka"
          tamanho="6"
          precoMin="R$ 120"
          precoMax="R$ 250"
        />
        <PortifolioCard
          imagem={alien}
          titulo="Alien Olhudo"
          tamanho="7"
          precoMin="R$ 140"
          precoMax="R$ 280"
        />
        <PortifolioCard
          imagem={cadeira}
          titulo="Cadeira"
          tamanho="9"
          precoMin="R$ 180"
          precoMax="R$ 350"
        />
        <PortifolioCard
          imagem={lua}
          titulo="Lua Triste"
          tamanho="5"
          precoMin="R$ 100"
          precoMax="R$ 200"
        />
        <PortifolioCard
          imagem={candelabro}
          titulo="Candelabro de Vinho"
          tamanho="10"
          precoMin="R$ 200"
          precoMax="R$ 400"
        />
      </div>

      <Footer />
    </>
  );
};
