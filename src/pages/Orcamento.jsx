import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Formulario from "../components/Formulario";
import CardResposta from "../components/CardResposta";
import Footer from "../components/Footer";
import "../styles/global.css";
import "../styles/formulario.css";

const Orcamento = () => {
  const [cardResposta, setCardResposta] = useState(null);
  const camposOrcamento = [
    {
      name: "email",
      type: "email",
      label: "Email para contato",
      placeholder: "Digite seu e-mail",
      required: true,
      errorMessage: "Email é obrigatório"
    },
    {
      name: "ideia",
      type: "textarea",
      label: "Conte sua ideia e veja sua arte ganhar forma",
      placeholder: "Descreva sua ideia",
      rows: 4,
      required: true,
      errorMessage: "Descrição da ideia é obrigatória"
    },
    {
      name: "tamanho",
      type: "number",
      label: "Tamanho estimado (cm)",
      placeholder: "Digite o tamanho desejado",
      required: true,
      errorMessage: "Tamanho estimado é obrigatório"
    },
    {
      name: "localCorpo",
      type: "select",
      label: "Local do corpo",
      required: true,
      errorMessage: "Local do corpo é obrigatório",
      options: [
        "Selecione uma opção",
        "Braço",
        "Antebraço",
        "Perna",
        "Costas",
        "Costelas",
        "Abdômen",
        "Glúteos",
        "Meio dos seios",
        "Cotovelo",
        "Ombro",
        "Punho",
        "Tornozelo",
        "Pescoço",
        "Outro"
      ]
    },
    {
      name: "imagemReferencia",
      type: "file",
      label: "Enviar referência de imagem (opcional)",
      accept: "image/*",
      fileText: "💡 Dica: Inspire-se! Busque referências no Pinterest, Instagram e outras redes.",
      fileSubtext: "Clique aqui para enviar sua imagem de referência"
    }
  ];

  const handleSubmitOrcamento = async (dados) => {
    try {
      console.log("Dados do orçamento:", dados);
      // rota para enviar pro backend
      // await api.post('/orcamentos', dados);
      
      // isso aqui é para em ambiente de dev a gente testar o ERRO e SUCESSO
      const sucesso = Math.random() > 0.4; // 60% chance de sucesso

      // já aqui é quando a gente for integrar com o backend
      // const sucesso = backendResponse.success;
      if (sucesso) {
        setCardResposta({
          tipo: 'sucesso',
          titulo: 'Sua ideia já chegou até nós!',
          mensagem: 'Em breve entraremos em contato para conversar sobre valores e próximos passos. Aguarde a resposta por e-mail.',
          codigo: `ORC-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          botaoTexto: 'Continuar navegando'
        });
      } else {
        throw new Error('Erro simulado');
      }
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      setCardResposta({
        tipo: 'erro',
        titulo: 'Erro ao enviar orçamento',
        mensagem: 'Ocorreu um problema ao processar sua solicitação. Verifique sua conexão e tente novamente.',
        botaoTexto: 'Tentar novamente'
      });
    }
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