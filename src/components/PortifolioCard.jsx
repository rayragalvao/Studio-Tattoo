import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/portifolioCard.css";

const TattooCard = ({ imagem, titulo, tamanho, precoMin, precoMax }) => {
  const navigate = useNavigate();

  const handleQuoteClick = () => {
    navigate("/orcamento", {
      state: { imagem, titulo, tamanho, precoMin, precoMax },
    });
  };

  return (
    <div className="tattoo-card">
      <img src={imagem} alt={titulo} className="tattoo-imagem" />
      <div className="tattoo-info">
        <p className="tattoo-tamanho">Tamanho: {`${tamanho}cm`}</p>
        <p className="tattoo-preco">
          Preço: R${precoMin} - R${precoMax}
        </p>
        <p className="tattoo-obs">*A depender da área do corpo</p>
        <button className="tattoo-botao" onClick={handleQuoteClick}>
          Ver orçamento
        </button>
      </div>
    </div>
  );
};

export default TattooCard;
