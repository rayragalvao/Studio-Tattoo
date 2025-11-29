import { useState } from "react";
import { Navbar } from "../../components/generalComponents/navbar/Navbar";
import { Formulario } from "../../components/generalComponents/formulario/Formulario.jsx";
import { CardResposta } from "../../components/generalComponents/cardResposta/CardResposta";
import { Footer } from "../../components/generalComponents/footer/Footer";
import "../../styles/global.css";
import "../../components/generalComponents/formulario/formulario.css";
import { useLocation } from "react-router-dom";
import { BarraCarregamento } from "../../components/loadingComponents/barraCarregamento/BarraCarregamento.jsx";
import AuthStorage from "../../services/AuthStorage.js";
import "./orcamento.css";
import apiService from "../../services/ApiService.js";
import axios from "axios";

export const Orcamento = () => {
  const [cardResposta, setCardResposta] = useState(null);
  const location = useLocation();
  const tattooData = location.state || {};
  const [limparForms, setLimparForms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const camposOrcamento = [
    {
      name: "nome",
      type: "text",
      label: "Nome completo",
      placeholder: "Digite seu nome completo",
      required: true,
      errorMessage: "Nome é obrigatório",
    },
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
        "Outro",
      ],
    },
    {
      name: "imagemReferencia",
      type: "file",
      label: "Enviar referência de imagem (opcional)",
      accept: "image/*",
      fileText:
        "💡 Dica: Inspire-se! Busque referências no Pinterest, Instagram e outras redes.",
      fileSubtext: "Clique aqui para enviar sua imagem de referência",
    },
  ];

  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("Erro ao converter URL para File:", error);
      return null;
    }
  };

  const handleSubmitOrcamento = async (dados) => {
    try {
      setIsLoading(true);
      console.log("Dados do orçamento:", dados);

      const formData = new FormData();
      const camposPermitidos = camposOrcamento.map((c) => c.name);

      for (const [key, value] of Object.entries(dados)) {
        if (!camposPermitidos.includes(key)) continue;
        if (value === null || value === undefined) continue;

        if (key === "imagemReferencia") {
          if (Array.isArray(value) && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              const item = value[i];

              if (item instanceof File) {
                formData.append("imagemReferencia", item);
              } else if (typeof item === "string" || item.startsWith("http")) {
                const file = await urlToFile(item, `portfolio-image-${i}.jpg`);
                if (file) {
                  formData.append("imagemReferencia", file);
                }
              }
            }
          }
        } else {
          formData.append(key, value);
        }
      }

      // Busca o token JWT do storage usando AuthStorage
      const token = AuthStorage.getToken();
      console.log("Token JWT obtido:", token);

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Não definimos Content-Type no headers porque o browser vai configurar automaticamente
      // com o boundary correto para multipart/form-data
      const response = await axios.post(
        `${apiService.baseURL}/orcamento/cadastro`,
        formData,
        { headers }
      );

      const backendResponse = response.data;
      const sucesso = backendResponse.success !== false;
      const codigoRetornado = backendResponse.codigo || null;

      setCardResposta(
        sucesso
          ? {
              tipo: "sucesso",
              titulo: "Sua ideia já chegou até nós!",
              mensagem: "Em breve entraremos em contato por e-mail.",
              codigo: codigoRetornado,
              botaoTexto: "Continuar navegando",
            }
          : {
              tipo: "erro",
              titulo: backendResponse.title || "Erro ao enviar orçamento",
              mensagem:
                backendResponse.message ||
                "Falha ao processar sua solicitação.",
              botaoTexto: "Tentar novamente",
            }
      );
      if (sucesso) {
        setLimparForms(true);
      }
    } catch (error) {
      setCardResposta({
        tipo: "erro",
        titulo: "Erro ao enviar orçamento",
        mensagem:
          error.response?.data?.message ||
          error.message ||
          "Problema inesperado.",
        codigo: null,
        botaoTexto: "Tentar novamente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFecharCard = () => setCardResposta(null);
  const handleLimparForms = () => setLimparForms(false);

  return (
    <>
      <Navbar />
      <Formulario
        titulo="Do esboço ao real: Seu projeto começa aqui."
        subtitulo="Conte sua ideia, nós criamos a arte."
        campos={camposOrcamento}
        onSubmit={handleSubmitOrcamento}
        isSubmitting={isLoading}
        submitButtonText="Enviar orçamento"
        limparForms={limparForms}
        onLimparForms={handleLimparForms}
        isPortfolioImage={!!tattooData?.imagem}
        initialValues={{
          tamanho: tattooData?.tamanho || "",
          ideia: tattooData?.titulo
            ? `Fiquei interessado(a) na tatuagem com o desenho "${tattooData.titulo}".`
            : "",
          imagemReferencia: tattooData?.imagem ? [tattooData.imagem] : [],
          titulo: tattooData?.titulo || "",
          precoMin: tattooData?.precoMin || "",
          precoMax: tattooData?.precoMax || "",
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
