import React, { useState, useEffect, useCallback } from "react";
import "./notificacao.css";

export const Notificacao = ({ 
    tipo = "sucesso", 
    titulo, 
    mensagem, 
    visivel = false, 
    onFechar, 
    duracao = 4000 
}) => {
    const [mostrar, setMostrar] = useState(visivel);
    const [animacao, setAnimacao] = useState('');

    const fecharNotificacao = useCallback(() => {
        setAnimacao('sair');
        
        // Aguardar animação de saída antes de ocultar
        setTimeout(() => {
            setMostrar(false);
            setAnimacao('');
            if (onFechar) {
                onFechar();
            }
        }, 300); // Duração da animação de saída
    }, [onFechar]);

    useEffect(() => {
        if (visivel) {
            setMostrar(true);
            setAnimacao('entrar');
            
            // Auto-fechar após a duração especificada
            const timer = setTimeout(() => {
                fecharNotificacao();
            }, duracao);

            return () => clearTimeout(timer);
        }
    }, [visivel, duracao, fecharNotificacao]);



    const obterIcone = () => {
        switch (tipo) {
            case 'sucesso':
                return 'check';
            case 'erro':
                return 'close';
            case 'aviso':
                return 'exclamation';
            default:
                return 'info_i';
        }
    };

    if (!mostrar) {
        return null;
    }

    return (
        <div className={`notificacao notificacao-${tipo} ${animacao}`}>
            <div className="notificacao-conteudo">
                <div className="notificacao-icone">
                    <span className="material-symbols-outlined">
                        {obterIcone()}
                    </span>
                </div>
                <div className="notificacao-texto">
                    {titulo && <h4 className="notificacao-titulo">{titulo}</h4>}
                    {mensagem && <p className="notificacao-mensagem">{mensagem}</p>}
                </div>
                <button 
                    className="notificacao-fechar"
                    onClick={fecharNotificacao}
                    aria-label="Fechar notificação"
                >
                    ×
                </button>
            </div>
        </div>
    );
};
