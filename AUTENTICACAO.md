# 🔐 Sistema de Autenticação - Studio Tattoo

## Visão Geral

Este projeto implementa um sistema completo de autenticação com JWT (JSON Web Tokens) para proteger rotas específicas da aplicação.

## 🏗️ Arquitetura

### Componentes Principais

1. **AuthContext**: Gerencia o estado global de autenticação
2. **RotaProtegida**: Componente para proteger rotas específicas
3. **AuthService**: Serviços para login, cadastro e logout
4. **AuthStorage**: Gerenciamento do localStorage para tokens
5. **ApiService**: Cliente HTTP com interceptor para tokens

## 🔑 Funcionalidades

### ✅ Implementado

- [x] Login com email e senha
- [x] Cadastro de novos usuários
- [x] Logout com limpeza de sessão
- [x] Proteção de rotas por autenticação
- [x] Proteção de rotas por nível de acesso (admin)
- [x] Persistência de sessão no localStorage
- [x] Interceptor automático para adicionar tokens
- [x] Tratamento de tokens expirados
- [x] Redirecionamento automático pós-login
- [x] Loading states durante verificação
- [x] Feedback visual para acesso negado

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── RotaProtegida.jsx         # Proteção de rotas
│   ├── LoadingSpinner.jsx        # Componente de loading
│   ├── ModalLogin.jsx            # Modal de login (existente)
│   └── ModalCadastro.jsx         # Modal de cadastro (existente)
├── contexts/
│   └── AuthContext.jsx           # Context de autenticação
├── hooks/
│   └── useAuthOperations.js      # Hook personalizado para auth
├── pages/
│   └── Login.jsx                 # Página de login standalone
├── services/
│   ├── AuthService.js            # Serviços de autenticação
│   ├── AuthStorage.js            # Gerenciamento de storage
│   └── ApiService.js             # Cliente HTTP
└── App.jsx                       # Configuração de rotas
```

## 🚀 Como Usar

### 1. Proteger uma Rota

```jsx
import RotaProtegida from './components/RotaProtegida';

// Rota que requer apenas login
<Route 
  path="/agendamento" 
  element={
    <RotaProtegida>
      <Agendamento />
    </RotaProtegida>
  } 
/>

// Rota que requer permissão de admin
<Route 
  path="/estoque" 
  element={
    <RotaProtegida requireAdmin={true}>
      <Estoque />
    </RotaProtegida>
  } 
/>
```

### 2. Usar Context de Autenticação

```jsx
import { useAuth } from '../contexts/AuthContext';

const MeuComponente = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <div>Você precisa fazer login</div>;
  }

  return (
    <div>
      <h1>Olá, {user.nome}!</h1>
      {isAdmin() && <p>Você é um administrador</p>}
      <button onClick={logout}>Sair</button>
    </div>
  );
};
```

### 3. Usar Hook Personalizado

```jsx
import useAuthOperations from '../hooks/useAuthOperations';

const MeuComponente = () => {
  const { 
    getUserInfo, 
    hasPermission, 
    handleLogoutWithConfirm 
  } = useAuthOperations();

  const userInfo = getUserInfo();

  return (
    <div>
      <h1>Olá, {userInfo.nome}!</h1>
      {hasPermission('admin') && (
        <button>Painel Admin</button>
      )}
      <button onClick={handleLogoutWithConfirm}>
        Sair
      </button>
    </div>
  );
};
```

## 🛡️ Níveis de Acesso

### Rotas Públicas (Acesso Livre)
- `/` - Home
- `/portfolio` - Portfólio
- `/agendamento` - Agendamentos
- `/orcamento` - Orçamentos
- `/login` - Login

### Rotas Administrativas (Requer Admin)
- `/estoque` - Gerenciamento de Estoque

## 🔧 Configurações

### Variáveis de Ambiente (opcional)

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_TOKEN_EXPIRY=24h
```

### API Endpoints Esperados

```
POST /usuario/login
POST /usuario/cadastro
```

## 📱 Fluxo de Autenticação

1. **Usuário acessa rota protegida** → Redireciona para `/login`
2. **Usuário faz login** → Token salvo no localStorage
3. **Redireciona** para rota original solicitada
4. **Próximas requisições** → Token incluído automaticamente
5. **Token expira** → Redireciona para login automaticamente
6. **Logout** → Remove token e redireciona para home

## 🎨 Personalização

### Alterar Cores do Sistema

Edite as variáveis CSS em `global.css`:

```css
:root {
    --laranja: #D46B0F;        /* Cor primária */
    --vermelho: #870C0E;       /* Cor secundária */
    --cinza-escuro: #222222;   /* Texto escuro */
    --branco: #ffffff;         /* Fundo */
}
```

### Customizar Loading

Edite o componente `LoadingSpinner.jsx` para alterar animações e estilos.

### Personalizar Mensagens de Erro

Edite o `AuthService.js` para customizar mensagens de erro.

## 🚦 Estados da Aplicação

- **Loading**: Verificando autenticação
- **Não Autenticado**: Usuário não logado
- **Autenticado**: Usuário logado com sucesso
- **Acesso Negado**: Usuário sem permissão para a rota
- **Token Expirado**: Redirecionamento automático para login

## 📞 Suporte

Para dúvidas ou problemas com o sistema de autenticação:

1. Verifique os logs do console do navegador
2. Confirme se o backend está rodando
3. Verifique se os endpoints da API estão corretos
4. Teste com dados válidos de usuário

---

**🔐 Sistema implementado com sucesso! Todas as rotas estão agora protegidas conforme especificado.**