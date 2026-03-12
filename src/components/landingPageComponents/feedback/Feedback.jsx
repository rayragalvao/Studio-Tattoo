import React from "react";
import "./feedback.css";
import carlos from "../../../assets/img/carlos-souza.jpg";
import joao from "../../../assets/img/joao-silva.png";
import maria from "../../../assets/img/maria-oliveira.jpg";

export const FeedbackClientes = () => {
  const feedbacks = [
    {
      id: 1,
      nome: "João Silva",
      foto: joao,
      legenda: "Excelente atendimento e resultado incrível!",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      foto: maria,
      legenda: "A tatuagem ficou perfeita, muito melhor do que eu imaginava.",
    },
    {
      id: 3,
      nome: "Carlos Souza",
      foto: carlos,
      legenda: "Profissionalismo e cuidado do início ao fim.",
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
