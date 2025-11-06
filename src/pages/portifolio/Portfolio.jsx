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
          tamanho="5"
          precoMin="XX"
          precoMax="XX"
          
        />
        <PortifolioCard
          imagem={mamadeira}
          titulo="Mamadeira Vodka"
          tamanho="Xcm"
          precoMin="XX"
          precoMax="XX"
          
        />
        <PortifolioCard
          imagem={alien}
          titulo="Alien Olhudo"
          tamanho="Xcm"
          precoMin="XX"
          precoMax="XX"
          
        />
        <PortifolioCard
          imagem={cadeira}
          titulo="Cadeira"
          tamanho="Xcm"
          precoMin="XX"
          precoMax="XX"
          
        />
        <PortifolioCard
          imagem={lua}
          titulo="Lua Triste"
          tamanho="Xcm"
          precoMin="XX"
          precoMax="XX"
        />
        <PortifolioCard
          imagem={candelabro}
          titulo="Candelabro de Vinho"
          tamanho="Xcm"
          precoMin="XX"
          precoMax="XX"
          
        />
      </div>

      <Footer />
    </>
  );
};
