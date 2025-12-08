import React, { useState, useEffect, useCallback } from 'react';
import './agendamentoDetail.css';
import OrcamentoService from '../../../services/OrcamentoService';
import agendamentoService from '../../../services/AgendamentoService';
import CompletarAgendamento from '../completarAgendamento/CompletarAgendamento';
import MateriaisUsados from '../materiaisUsados/MateriaisUsados';

const AgendamentoDetail = ({ agendamento, onConfirmar, onCancelar }) => {
  const [imagensReferencia, setImagensReferencia] = useState([]);
  const [orcamentoCompleto, setOrcamentoCompleto] = useState(null);
  const [modalCompletarAberto, setModalCompletarAberto] = useState(false);
  const [modalMateriaisAberto, setModalMateriaisAberto] = useState(false);
  const [dadosCompletamento, setDadosCompletamento] = useState(null);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [agendamentoLocal, setAgendamentoLocal] = useState(agendamento);

  const agendamentoDados = agendamentoLocal ?? agendamento;
  const isLoading = !agendamentoDados;

  const handleSalvarCompletamento = useCallback((dados) => {
    console.log('✅ Dados completamento salvos:', dados);
    setDadosCompletamento(dados);
  }, []);

  useEffect(() => {
    if (agendamento?.codigoOrcamento) {
      carregarOrcamentoCompleto(agendamento.codigoOrcamento);
    }
    // Mantém estado local sincronizado com prop
    setAgendamentoLocal(agendamento || null);

    // Debug: verificar dados de pagamento vindos do backend
    console.log('📊 Dados do agendamento carregados:');
    console.log('  pagamentoFeito:', agendamento?.pagamentoFeito);
    console.log('  formaPagamento:', agendamento?.formaPagamento);
    console.log('  tempoDuracao:', agendamento?.tempoDuracao);
  }, [agendamento?.codigoOrcamento, agendamento?.id, agendamento]);

  const carregarOrcamentoCompleto = async (codigoOrcamento) => {
    try {
      const orcamento = await OrcamentoService.buscarOrcamento(codigoOrcamento);

      setOrcamentoCompleto(orcamento);

      if (orcamento?.imagemReferencia) {
        const imagens = Array.isArray(orcamento.imagemReferencia)
          ? orcamento.imagemReferencia
          : [orcamento.imagemReferencia];

        setImagensReferencia(imagens);
      } else {
        setImagensReferencia([]);
      }
    } catch (error) {
      setImagensReferencia([]);
    }
  };

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return 'Data não disponível';
    const data = new Date(dataHora);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} - ${hora}:${min}`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'AGUARDANDO': 'Aguardando confirmação',
      'CONFIRMADO': 'Confirmado',
      'CANCELADO': 'Cancelado',
      'CONCLUIDO': 'Concluído',
      'PENDENTE': 'Pendente'
    };
    return labels[status] || status;
  };

  const formatarTamanho = (tamanho) => {
    if (!tamanho) return 'Não informado';
    return `${tamanho}cm`;
  };

  const formatarValor = (valor) => {
    if (!valor) return 'Não informado';
    return parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const orcamento = orcamentoCompleto ?? agendamentoDados?.orcamento ?? {};
  const usuario = agendamentoDados?.usuario ?? {};

  const pagamentoFeito =
    agendamentoDados?.pagamentoFeito !== undefined 
      ? agendamentoDados.pagamentoFeito
      : dadosCompletamento?.pagamentoFeito ?? null;
  const formaPagamento =
    agendamentoDados?.formaPagamento 
      ? agendamentoDados.formaPagamento
      : dadosCompletamento?.formaPagamento ?? '';
  const tempoSessao =
    agendamentoDados?.tempoDuracao 
      ? agendamentoDados.tempoDuracao
      : dadosCompletamento?.tempoDuracao ?? null;

  if (!agendamentoDados) {
    return (
      <section className="agend-detail empty">
        <p>Selecione um agendamento à esquerda para ver os detalhes.</p>
      </section>
    );
  }

  return (
    <section className="agend-detail">

      {/* Status */}
      <div className="status-header">
        <span className="status-label">Status:</span>
        <span className="status-value">{getStatusLabel(agendamentoDados.status)}</span>

        {agendamentoDados.status !== 'CONFIRMADO' &&
          agendamentoDados.status !== 'CANCELADO' &&
          agendamentoDados.status !== 'CONCLUIDO' && (
            <button
              className="btn-confirmar-top"
              onClick={() => onConfirmar?.(agendamentoDados.id)}
            >
              Confirmar agendamento
            </button>
          )}
      </div>

      {/* Informações básicas */}
      <div className="info-block">
        <h3 className="block-title">Informações do agendamento</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Cliente:</span>
            <span className="value">
              {agendamentoDados.nomeUsuario || usuario.nome || 'Não informado'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Pagamento:</span>
            <span className="value">
              {pagamentoFeito === true
                ? 'Feito'
                : pagamentoFeito === false
                ? 'Não feito'
                : 'Não informado'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Forma de pagamento:</span>
            <span className="value">{formaPagamento || 'Não informado'}</span>
          </div>
          <div className="info-item">
            <span className="label">Tempo estimado:</span>
            <span className="value">
              {tempoSessao
                ? `${tempoSessao} min`
                : orcamento.tempo || 'Não informado'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Valor:</span>
            <span className="value">
              {formatarValor(orcamento.valor)}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Data/Horário:</span>
            <span className="value">{formatarDataHora(agendamentoDados.dataHora)}</span>
          </div>
        </div>
      </div>

      {/* Informações do orçamento */}
      <div className="info-block">
        <h3 className="block-title">Informações do orçamento</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Tamanho:</span>
            <span className="value">
              {formatarTamanho(agendamentoDados.tamanho || orcamento.tamanho)}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Local do corpo:</span>
            <span className="value">
              {agendamentoDados.localCorpo || orcamento.localCorpo || 'Não informado'}
            </span>
          </div>

          {(agendamentoDados.cores || orcamento.cores) && (
            <div className="info-item">
              <span className="label">Cores:</span>
              <span className="value">{agendamentoDados.cores || orcamento.cores}</span>
            </div>
          )}
        </div>

        {(agendamentoDados.ideia || orcamento.ideia) && (
          <div className="descricao-block">
            <span className="label">Descrição:</span>
            <p className="descricao-text">
              {agendamentoDados.ideia || orcamento.ideia}
            </p>
          </div>
        )}

        {imagensReferencia.length > 0 ? (
          <div className="referencia-block">
            <span className="label">Referência:</span>
            <div className="referencia-placeholder">
              <div className="referencias-grid">
                {imagensReferencia.map((img, idx) => {
                  const imgPath = img.replace(/\\/g, '/');
                  const imgUrl = `http://localhost:8080/${imgPath}`;

                  return (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Referência ${idx + 1}`}
                      className="referencia-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="referencia-block">
            <span className="label">Referência:</span>
            <div className="referencia-placeholder">
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                Nenhuma imagem de referência
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="action-buttons">
        {agendamentoDados.status !== 'CONCLUIDO' &&
          agendamentoDados.status !== 'CANCELADO' && (
            <button
              className="btn-completar"
              onClick={() => {
                console.log('🔥 Botão clicado! Abrindo modais...');
                setModalCompletarAberto(true);
                setModalMateriaisAberto(true);
                console.log('✅ Estados atualizados');
              }}
            >
              Completar agendamento
            </button>
          )}

        {agendamentoDados.status !== 'CANCELADO' && (
          <button
            className="btn-cancelar-bottom"
            onClick={() => onCancelar?.(agendamentoDados.id)}
          >
            Cancelar agendamento
          </button>
        )}
      </div>

      {/* 🎯 MODAIS LADO A LADO */}
      {(modalCompletarAberto || modalMateriaisAberto) && (
        <div className="side-by-side-modals">
          {modalCompletarAberto && (
            <CompletarAgendamento
              agendamento={agendamentoDados}
              onClose={() => setModalCompletarAberto(false)}
              onSalvar={handleSalvarCompletamento}
            />
          )}

          {modalMateriaisAberto && (
            <MateriaisUsados
              agendamento={agendamentoDados}
              dadosCompletar={dadosCompletamento}
              onClose={() => {
                setModalMateriaisAberto(false);
                setModalCompletarAberto(false);
                setDadosCompletamento(null);
              }}
              onSalvar={async (materiais) => {
                try {
                  // Validar dados do completar
                  if (!dadosCompletamento?.isValid) {
                    alert('Por favor, preencha todos os campos do primeiro modal (Completar agendamento)');
                    return;
                  }

                  console.log('💾 Salvando materiais:', materiais);
                  console.log('💾 Dados completamento:', dadosCompletamento);

                  if (!agendamentoDados?.emailUsuario || !agendamentoDados?.codigoOrcamento || !agendamentoDados?.dataHora) {
                    alert('Dados do agendamento incompletos (email, código de orçamento ou dataHora ausentes).');
                    return;
                  }
                  
                  // Atualiza o agendamento para CONCLUIDO com dados de tempo e pagamento
                  const agendamentoAtualizado = await agendamentoService.completarAgendamento(
                    agendamentoDados.id,
                    {
                      emailUsuario: agendamentoDados.emailUsuario,
                      codigoOrcamento: agendamentoDados.codigoOrcamento,
                      dataHora: agendamentoDados.dataHora,
                      status: 'CONCLUIDO',
                      tempoDuracao: dadosCompletamento.tempoDuracao,
                      pagamentoFeito: dadosCompletamento.pagamentoFeito,
                      formaPagamento: dadosCompletamento.formaPagamento
                    }
                  );

                  console.log('✅ Agendamento atualizado com sucesso:', agendamentoAtualizado);

                  // Atualiza estado local para refletir imediatamente na UI
                  setAgendamentoLocal(agendamentoAtualizado);

                  setModalMateriaisAberto(false);
                  setModalCompletarAberto(false);
                  setModalSucesso(true);
                } catch (error) {
                  console.error('❌ Erro:', error);
                  alert('Erro ao completar agendamento: ' + (error.message || 'Erro desconhecido'));
                }
              }}
            />
          )}
        {modalSucesso && (
          <div className="success-modal-overlay">
            <div className="success-modal">
              <h3>Agendamento concluído com sucesso!</h3>
              <p>Os dados foram salvos e o status foi atualizado para CONCLUIDO.</p>
              <button
                className="success-modal-button"
                onClick={() => {
                  setModalSucesso(false);
                  window.location.reload();
                }}
              >
                Ok
              </button>
            </div>
          </div>
        )}
        </div>
      )}
    </section>
  );
};

export default AgendamentoDetail;
