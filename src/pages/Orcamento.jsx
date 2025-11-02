import { useState } from 'react';
import Navbar from '../components/Navbar';
import Formulario from '../components/Formulario';
import CardResposta from '../components/CardResposta';
import Footer from '../components/Footer';
import '../styles/global.css';
import '../styles/formulario.css';
import { useLocation } from 'react-router-dom';
import { BarraCarregamento } from '../components/BarraCarregamento';
import AuthStorage from '../services/AuthStorage.js';
const apiUrl = "http://localhost:8080";

const Orcamento = () => {
  const [cardResposta, setCardResposta] = useState(null);
  const location = useLocation();
  const tattooData = location.state || {};
  const [codigoOrcamentoState, setCodigoOrcamentoState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const camposOrcamento = [
    {
      name: 'email',
      type: 'email',
      label: 'Email para contato',
      placeholder: 'Digite seu e-mail',
      required: true,
      errorMessage: 'Email é obrigatório',
    },
    {
      name: 'ideia',
      type: 'textarea',
      label: 'Conte sua ideia e veja sua arte ganhar forma',
      placeholder: 'Descreva sua ideia',
      rows: 4,
      required: true,
      errorMessage: 'Descrição da ideia é obrigatória',
    },
    {
      name: 'tamanho',
      type: 'number',
      label: 'Tamanho estimado (cm)',
      placeholder: 'Digite o tamanho desejado',
      required: true,
      errorMessage: 'Tamanho estimado é obrigatório',
    },
    {
      name: 'cores',
      type: 'checkbox group',
      label: 'Cor desejada (Selecione mais de uma, se necessário)',
      required: true,
      errorMessage: 'Selecione pelo menos uma cor',
      options: [
        { value: 'preto', label: ' Preto' },
        { value: 'vermelho', label: ' Vermelho' },
      ],
    },
    {
      name: 'localCorpo',
      type: 'select',
      label: 'Local do corpo',
      required: true,
      errorMessage: 'Local do corpo é obrigatório',
      options: [
        'Selecione uma opção',
        'Braço',
        'Antebraço',
        'Perna',
        'Costas',
        'Costelas',
        'Abdômen',
        'Glúteos',
        'Meio dos seios',
        'Cotovelo',
        'Ombro',
        'Punho',
        'Tornozelo',
        'Pescoço',
        'Outro',
      ],
    },
    {
      name: 'imagemReferencia',
      type: 'file',
      label: 'Enviar referência de imagem (opcional)',
      accept: 'image/*',
      fileText:
        '💡 Dica: Inspire-se! Busque referências no Pinterest, Instagram e outras redes.',
      fileSubtext: 'Clique aqui para enviar sua imagem de referência',
    },
  ];

  const handleSubmitOrcamento = async (dados) => {
    // Tentativa: primeiro enviar multipart/form-data (FormData) sem Content-Type explícito.
    // Se o backend responder com 415 (Unsupported Media Type) ou mensagem indicando
    // boundary/content-type não suportado, então faz fallback para JSON com imagens em base64.
    const camposPermitidos = camposOrcamento.map((c) => c.name);

    const fileToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const LAST_CODE_KEY = 'codigoOrcamentoCounter';
    let codigo = codigoOrcamentoState;
    if (!codigo) {
      try {
        const raw = localStorage.getItem(LAST_CODE_KEY);
        let last = raw ? parseInt(raw, 10) : 999; 
        if (Number.isNaN(last)) last = 999;
        const next = Math.max(last + 1, 1000);
        codigo = String(next);
        localStorage.setItem(LAST_CODE_KEY, String(next));
      } catch (e) {
        codigo = String(Date.now());
      }
      setCodigoOrcamentoState("ORC-" + codigo);
    }

    setIsLoading(true);
    try {
      console.log('Dados do orçamento:', dados);
      const formData = new FormData();
      Object.keys(dados).forEach((key) => {
        if (!camposPermitidos.includes(key)) return;
        const value = dados[key];
        if (value === null || value === undefined) return;

        if (key === 'imagemReferencia') {
          if (Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append('imagemReferencia', file);
              }
            });
          }
        } else {
          formData.append(key, value);
        }
      });
      formData.append('codigoOrcamento', codigo);

      const token = AuthStorage.getToken();

      const response = await fetch(`${apiUrl}/orcamento`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
        mode: 'cors',
        credentials: 'include',
      });

      const text = await response.text().catch(() => '');
      let backendResponse = {};
      if (text) {
        try {
          backendResponse = JSON.parse(text);
        } catch (e) {
          backendResponse = { message: text };
        }
      }

      const needFallback =
        response.status === 415 ||
        (backendResponse && typeof backendResponse.message === 'string' && /boundary|multipart|unsupported/i.test(backendResponse.message));

      if (needFallback) {
        console.warn('Servidor rejeitou multipart/form-data — tentando fallback para JSON base64');

        const payload = { codigoOrcamento: codigo };
        for (const key of Object.keys(dados)) {
          if (!camposPermitidos.includes(key)) continue;
          const value = dados[key];
          if (value === null || value === undefined) continue;

          if (key === 'imagemReferencia') {
            payload[key] = [];
            if (Array.isArray(value) && value.length > 0) {
              for (const item of value) {
                if (item instanceof File) {
                  try {
                    const dataUrl = await fileToBase64(item);
                    payload[key].push({ name: item.name, type: item.type, data: dataUrl });
                  } catch (e) {
                    console.warn('Falha ao converter imagem para base64', e);
                  }
                } else if (typeof item === 'string') {
                  payload[key].push({ url: item });
                }
              }
            }
          } else {
            payload[key] = value;
          }
        }

        const jsonResponse = await fetch(`${apiUrl}/orcamento`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        const text2 = await jsonResponse.text().catch(() => '');
        let backendResponse2 = {};
        if (text2) {
          try {
            backendResponse2 = JSON.parse(text2);
          } catch (e) {
            backendResponse2 = { message: text2 };
          }
        }

        if (!jsonResponse.ok) {
          console.error('Erro HTTP ao enviar orçamento (fallback JSON):', jsonResponse.status, backendResponse2);
          setCardResposta({ tipo: 'erro', titulo: 'Erro ao enviar orçamento', mensagem: backendResponse2.message || `Servidor retornou status ${jsonResponse.status}`, botaoTexto: 'Tentar novamente' });
          return;
        }

        const sucesso = backendResponse2.success !== false;
        const codigoRetornado = backendResponse2.codigo || backendResponse2.codigoOrcamento || codigo;

        if (sucesso) {
          setCardResposta({ tipo: 'sucesso', titulo: 'Sua ideia já chegou até nós!', mensagem: 'Em breve entraremos em contato para conversar sobre valores e próximos passos. Aguarde a resposta por e-mail.', codigo: codigoRetornado, botaoTexto: 'Continuar navegando' });
        } else {
          setCardResposta({ tipo: 'erro', titulo: backendResponse2.title || 'Erro ao enviar orçamento', mensagem: backendResponse2.message || 'O servidor retornou erro ao processar sua solicitação.', botaoTexto: 'Tentar novamente' });
        }

        return;
      }

      if (!response.ok) {
        console.error('Erro HTTP ao enviar orçamento:', response.status, backendResponse);
        setCardResposta({ tipo: 'erro', titulo: 'Erro ao enviar orçamento', mensagem: backendResponse.message || `Servidor retornou status ${response.status}`, botaoTexto: 'Tentar novamente' });
        return;
      }

      const sucesso = backendResponse.success !== false;
      const codigoRetornado = backendResponse.codigo || backendResponse.codigoOrcamento || codigo;

      if (sucesso) {
        setCardResposta({ tipo: 'sucesso', titulo: 'Sua ideia já chegou até nós!', mensagem: 'Em breve entraremos em contato para conversar sobre valores e próximos passos. Aguarde a resposta por e-mail.', codigo: codigoRetornado, botaoTexto: 'Continuar navegando' });
      } else {
        setCardResposta({ tipo: 'erro', titulo: backendResponse.title || 'Erro ao enviar orçamento', mensagem: backendResponse.message || 'O servidor retornou erro ao processar sua solicitação.', botaoTexto: 'Tentar novamente' });
      }
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      setCardResposta({
        tipo: 'erro',
        titulo: 'Erro ao enviar orçamento',
        mensagem: error.message || 'Ocorreu um problema ao processar sua solicitação.',
        codigo,
        botaoTexto: 'Tentar novamente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFecharCard = () => setCardResposta(null);

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
        
        isPortfolioImage={!!tattooData?.imagem}
        initialValues={{
          tamanho: tattooData?.tamanho || '',
          ideia: tattooData?.titulo
            ? `Fiquei interessado(a) na tatuagem com o desenho "${tattooData.titulo}".`
            : '',
          imagemReferencia: tattooData?.imagem ? [tattooData.imagem] : [], // 👈 coloca no container de upload
          titulo: tattooData?.titulo || '',
          precoMin: tattooData?.precoMin || '',
          precoMax: tattooData?.precoMax || '',
        }}
      />

      {/* spinner agora exibido dentro do Formulario via prop isSubmitting */}

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