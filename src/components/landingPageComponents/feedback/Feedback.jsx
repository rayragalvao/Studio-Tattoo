import React from "react";
import "./feedback.css";
import carlos from "../../../assets/img/daniel.jpg";
import joao from "../../../assets/img/bruno.jpg";
import maria from "../../../assets/img/gabriella.jpg";

export const FeedbackClientes = () => {
  const feedbacks = [
    {
      id: 1,
      nome: "Daniel Veloso",
      foto: joao,
      legenda: "Excelente atendimento e resultado incrível! Recomendo a todos que buscam uma tatuagem de qualidade.",
    },
    {
      id: 2,
      nome: "Gabriella Oliveira",
      foto: maria,
      legenda: "A tatuagem ficou perfeita, muito melhor do que eu imaginava. Já quero marcar para fazer mais.",
    },
    {
      id: 3,
      nome: "Bruno Santtoro",
      foto: carlos,
      legenda: "Profissionalismo e cuidado do início ao fim. Estou muito satisfeito com minha nova tatuagem, superou minhas expectativas!",
    },
  ];

  return (
    <section className="feedback">
      <h1>Feedback dos clientes</h1>
      <div className="feedback-cards">
        {feedbacks.map((f) => (
          <div className="card" key={f.id}>
            <img src={f.foto} alt={f.nome} className="avatar" />
            <h3 className="nome">{f.nome}</h3>
            <p className="legenda">"{f.legenda}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};
