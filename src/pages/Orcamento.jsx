import { useState } from 'react';
import Navbar from '../components/Navbar';
import Formulario from '../components/Formulario';
import CardResposta from '../components/CardResposta';
import Footer from '../components/Footer';
import '../styles/global.css';
import '../styles/formulario.css';
import { useLocation } from 'react-router-dom';

const apiUrl = "http://localhost:8080";

const Orcamento = () => {
  const [cardResposta, setCardResposta] = useState(null);
  const location = useLocation();
  const tattooData = location.state || {};

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
    try {
      console.log('Dados do orçamento:', dados);

      let response;

      if (Array.isArray(dados.imagemReferencia) && dados.imagemReferencia.length > 0) {
        const formData = new FormData();
        Object.keys(dados).forEach((key) => {
          const value = dados[key];
          if (value === null || value === undefined) return;
          if (key === 'imagemReferencia') {
            value.forEach((file) => formData.append('imagemReferencia', file));
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });

        response = await fetch(`${apiUrl}/orcamento`, { method: 'POST', body: formData });
      } else {
        response = await fetch(`${apiUrl}/orcamento`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
      }

      const text = await response.text().catch(() => '');
      let backendResponse = {};
      if (text) {
        try {
          backendResponse = JSON.parse(text);
        } catch (e) {
          backendResponse = { message: text };
        }
      }

      if (!response.ok) {
        console.error('Erro HTTP ao enviar orçamento:', response.status, backendResponse);
        setCardResposta({ tipo: 'erro', titulo: 'Erro ao enviar orçamento', mensagem: backendResponse.message || `Servidor retornou status ${response.status}`, botaoTexto: 'Tentar novamente' });
        return;
      }

      const sucesso = backendResponse.success !== false;
      const codigoOrcamento = `ORC-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      if (sucesso) {
        setCardResposta({ tipo: 'sucesso', titulo: 'Sua ideia já chegou até nós!', mensagem: 'Em breve entraremos em contato para conversar sobre valores e próximos passos. Aguarde a resposta por e-mail.', codigo: codigoOrcamento, botaoTexto: 'Continuar navegando' });
      } else {
        setCardResposta({ tipo: 'erro', titulo: backendResponse.title || 'Erro ao enviar orçamento', mensagem: backendResponse.message || 'O servidor retornou erro ao processar sua solicitação.', botaoTexto: 'Tentar novamente' });
      }

    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      setCardResposta({
        tipo: 'erro',
        titulo: 'Erro ao enviar orçamento',
        mensagem:
          error.message || 'Ocorreu um problema ao processar sua solicitação.',
        botaoTexto: 'Tentar novamente',
      });
    }
  }

  const handleFecharCard = () => setCardResposta(null);

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