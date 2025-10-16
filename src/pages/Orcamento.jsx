import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Formulario from "../components/Formulario";
import CardResposta from "../components/CardResposta";
import Footer from "../components/Footer";
import "../styles/global.css";
import "../styles/formulario.css";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const apiUrl = "http://localhost:8080";

const Orcamento = () => {
  const [cardResposta, setCardResposta] = useState(null);
  const location = useLocation();
  const tattooData = location.state || {}; 

  const camposOrcamento = [
    {
      name: "email",
      type: "email",
      label: "Email para contato",
      placeholder: "Digite seu e-mail",
      required: true,
      errorMessage: "Email é obrigatório",
    },
    {
      name: "ideia",
      type: "textarea",
      label: "Conte sua ideia e veja sua arte ganhar forma",
      placeholder: "Descreva sua ideia",
      rows: 4,
      required: true,
      errorMessage: "Descrição da ideia é obrigatória",
    },
    {
      name: "tamanho",
      type: "number",
      label: "Tamanho estimado (cm)",
      placeholder: "Digite o tamanho desejado",
      required: true,
      errorMessage: "Tamanho estimado é obrigatório",
    },
    {
      name: "cores",
      type: "checkbox group",
      label: "Cor desejada (Selecione mais de uma, se necessário)",
      required: true,
      errorMessage: "Selecione pelo menos uma cor",
      options: [
        { value: "preto", label: " Preto" },
        { value: "vermelho", label: " Vermelho" },
      ],
    },
    {
      name: "localCorpo",
      type: "select",
      label: "Local do corpo",
      required: true,
      errorMessage: "Local do corpo é obrigatório",
      options: [
        "Selecione uma opção",
        "Braço", "Antebraço", "Perna", "Costas", "Costelas", "Abdômen",
        "Glúteos", "Meio dos seios", "Cotovelo", "Ombro", "Punho",
        "Tornozelo", "Pescoço", "Outro",
      ],
    },
    {
      name: "imagemReferencia",
      type: "file",
      label: "Enviar referência de imagem (opcional)",
      accept: "image/*",
      fileText: "💡 Dica: Inspire-se! Busque referências no Pinterest, Instagram e outras redes.",
      fileSubtext: "Clique aqui para enviar sua imagem de referência",
    },
  ];

  const handleSubmitOrcamento = async (dados) => {
    
    console.log("Enviando dados:", dados);
  };

  const handleFecharCard = () => {
    setCardResposta(null);
  };

  return (
    <>
      <Navbar />
      <Formulario
        titulo="Do esboço ao real: Seu projeto começa aqui."
        subtitulo="Conte sua ideia, nós criamos a arte."
        campos={camposOrcamento}
        onSubmit={handleSubmitOrcamento}
        submitButtonText="Enviar orçamento"
        
        isPortfolioImage={!!tattooData?.imagem}
        initialValues={{
          tamanho: tattooData?.tamanho || "",
          ideia: tattooData?.titulo
            ? `Fiquei interessado(a) na tatuagem com o desenho "${tattooData.titulo}".`
            : "",
          imagem: tattooData?.imagem || null,
          titulo: tattooData?.titulo || "",
        }}
      />

      {cardResposta && (
        <CardResposta
          tipo={cardResposta.tipo}
          titulo={cardResposta.titulo}
          mensagem={cardResposta.mensagem}
          codigo={cardResposta.codigo}
          botaoTexto={cardResposta.botaoTexto}
          onClose={handleFecharCard}
        />
      )}
      <Footer />
    </>
  );
};

export default Orcamento;