import React, { useState } from "react";
import { ChevronDown } from "lucide-react"; // ícone setinha (instale: npm install lucide-react)

const perguntas = [
  {
    pergunta: "O processo de tatuagem dói?",
    resposta: "A dor varia de pessoa para pessoa, depende também da região do corpo e do tamanho da tatuagem."
  },
  {
    pergunta: "Posso tomar sol após fazer a tatuagem?",
    resposta: "Não é recomendado. É importante evitar exposição ao sol nas primeiras semanas para garantir a cicatrização correta."
  },
  {
    pergunta: "Quanto tempo demora para cicatrizar?",
    resposta: "O processo de cicatrização leva em média 2 a 4 semanas, mas pode variar conforme os cuidados individuais."
  },
  {
    pergunta: "Quais cuidados devo ter antes de tatuar?",
    resposta: "Durma bem, alimente-se antes e evite bebidas alcoólicas no dia da tatuagem."
  },
  {
    pergunta: "Quais cuidados devo ter depois de tatuar?",
    resposta: "Beba bastante água e continue se alimentando bem, além de sempre hidratar o local da sua tattoo."
  }
];

const FAQ = () => {
  const [ativo, setAtivo] = useState(null);

  const togglePergunta = (index) => {
    setAtivo(ativo === index ? null : index);
  };

  return (
    <section className="faq">
      <h1>Antes da agulha, algumas respostas</h1>
      <div className="faq-lista">
        {perguntas.map((item, index) => (
          <div key={index} className="faq-item">
            <button className="faq-pergunta" onClick={() => togglePergunta(index)}>
              <span>{item.pergunta}</span>
              <ChevronDown
                className={`icone ${ativo === index ? "ativo" : ""}`}
                size={20}
              />
            </button>
            {ativo === index && <p className="faq-resposta">{item.resposta}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
