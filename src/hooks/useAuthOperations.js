import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook personalizado para operações de autenticação
 * Fornece funções auxiliares para login, logout e verificações de acesso
 */
export const useAuthOperations = () => {
    const { 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout, 
        register, 
        isAdmin 
    } = useAuth();
    
    const navigate = useNavigate();

    // Função para fazer logout com confirmação
    const handleLogoutWithConfirm = useCallback(() => {
        const confirmed = window.confirm('Tem certeza que deseja sair?');
        if (confirmed) {
            logout();
            navigate('/');
        }
    }, [logout, navigate]);

    // Função para verificar se usuário pode acessar uma rota
    const canAccessRoute = useCallback((requireAdmin = false) => {
        if (!isAuthenticated) return false;
        if (requireAdmin && !isAdmin()) return false;
        return true;
    }, [isAuthenticated, isAdmin]);

    // Função para redirecionar baseado no status de autenticação
    const redirectIfNotAuthenticated = useCallback((redirectTo = '/login') => {
        if (!isAuthenticated && !isLoading) {
            navigate(redirectTo);
            return true;
        }
        return false;
    }, [isAuthenticated, isLoading, navigate]);

    // Função para obter informações do usuário de forma segura
    const getUserInfo = useCallback(() => {
        return {
            id: user?.id || null,
            nome: user?.nome || 'Usuário',
            email: user?.email || '',
            isAdmin: isAdmin(),
            isAuthenticated
        };
    }, [user, isAdmin, isAuthenticated]);

    // Função para verificar permissões específicas
    const hasPermission = useCallback((permission) => {
        if (!isAuthenticated) return false;
        
        switch (permission) {
            case 'admin':
                return isAdmin();
            case 'user':
                return true; // Qualquer usuário autenticado
            case 'estoque':
                return isAdmin(); // Apenas admin pode acessar estoque
            case 'agendamento':
                return true; // Qualquer usuário autenticado
            case 'orcamento':
                return true; // Qualquer usuário autenticado
            default:
                return false;
        }
    }, [isAuthenticated, isAdmin]);

    return {
        // Estados
        user,
        isAuthenticated,
        isLoading,
        
        // Funções de autenticação
        login,
        logout,
        register,
        handleLogoutWithConfirm,
        
        // Funções de verificação
        isAdmin,
        canAccessRoute,
        hasPermission,
        getUserInfo,
        
        // Funções de navegação
        redirectIfNotAuthenticated
    };
};

export default useAuthOperations;