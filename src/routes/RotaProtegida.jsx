import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RotaProtegida = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Se não estiver autenticado, redirecionar para home
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <LoadingSpinner 
                message="Verificando autenticação..." 
                size="medium"
                fullScreen={true}
            />
        );
    }

    // Se não estiver autenticado, mostrar mensagem enquanto redireciona
    if (!isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                fontFamily: 'Martel Sans, sans-serif',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    fontSize: '3rem',
                    color: '#D46B0F',
                    marginBottom: '1rem'
                }}>
                    �
                </div>
                <h1 style={{
                    color: '#D46B0F',
                    marginBottom: '1rem',
                    fontSize: '2rem'
                }}>
                    Acesso Restrito
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#666',
                    marginBottom: '2rem',
                    maxWidth: '400px',
                    lineHeight: '1.5'
                }}>
                    Você precisa fazer login para acessar esta área.
                    <br />
                    Redirecionando para a página inicial...
                </p>
            </div>
        );
    }

    // Se requerer admin e usuário não for admin
    if (requireAdmin && !isAdmin()) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                fontFamily: 'Martel Sans, sans-serif',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    fontSize: '4rem',
                    color: '#B70D07',
                    marginBottom: '1rem'
                }}>
                    🔒
                </div>
                <h1 style={{
                    color: '#B70D07',
                    marginBottom: '1rem',
                    fontSize: '2rem'
                }}>
                    Acesso Restrito
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#666',
                    marginBottom: '2rem',
                    maxWidth: '400px',
                    lineHeight: '1.5'
                }}>
                    Esta área é restrita para administradores.
                    <br />
                    Entre em contato com o administrador do sistema para obter acesso.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            padding: '0.8rem 2rem',
                            backgroundColor: '#D46B0F',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#B8590D'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#D46B0F'}
                    >
                        🏠 Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    // Se estiver autenticado e tiver permissão, renderizar o componente filho
    return children;
};

export default RotaProtegida;