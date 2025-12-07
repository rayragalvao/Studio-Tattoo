import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import "./perfilUsuario.css";

export const PerfilUsuario = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: ""
  });

  useEffect(() => {
    if (user) {
      console.log('Dados do usuário carregados no perfil:', user);
      console.log('user.telefone:', user.telefone);
      console.log('user.dataNascimento:', user.dataNascimento);
      console.log('user.dtNasc:', user.dtNasc);
      
      setUserData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        dataNascimento: user.dataNascimento || ""
      });
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone) => {
    if (!phone) return "Não informado";
    return phone;
  };

  const formatPhoneInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setUserData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        dataNascimento: user.dataNascimento || ""
      });
    }
  };

  const validateAge = (dateString) => {
    if (!dateString) return false;
    
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (userData.dataNascimento && !validateAge(userData.dataNascimento)) {
      setAgeError('Você precisa ter mais de 18 anos');
      return;
    }
    
    setIsLoading(true);
    setAgeError('');
    setSuccessMessage('');
    
    try {
      await updateUser({
        nome: userData.nome,
        telefone: userData.telefone,
        dataNascimento: userData.dataNascimento
      });
      
      setSuccessMessage('Informações atualizadas com sucesso!');
      setIsEditing(false);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setAgeError('Erro ao atualizar informações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (name === 'telefone') {
      processedValue = formatPhoneInput(value);
    }
    
    if (name === 'dataNascimento' && ageError) {
      setAgeError('');
    }
    
    setUserData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  if (!user) {
    return (
      <div className="perfil-usuario">
        <div className="perfil-loading">
          <p>Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-usuario">
      <div className="perfil-header">
        <h2>Meu Perfil</h2>
        {!isEditing && (
          <button className="btn-editar" onClick={handleEditClick}>
            Editar informações
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {!isEditing ? (
        <div className="perfil-info">
          <div className="info-group">
            <label>Nome completo</label>
            <p>{userData.nome || "Não informado"}</p>
          </div>

          <div className="info-group">
            <label>E-mail</label>
            <p>{userData.email || "Não informado"}</p>
          </div>

          <div className="info-group">
            <label>Telefone</label>
            <p>{formatPhone(userData.telefone)}</p>
          </div>

          <div className="info-group">
            <label>Data de nascimento</label>
            <p>{formatDate(userData.dataNascimento)}</p>
          </div>
        </div>
      ) : (
        <form className="perfil-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={userData.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={userData.telefone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <div className="input-with-error">
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={userData.dataNascimento}
                onChange={handleInputChange}
                className={ageError ? 'error' : ''}
              />
              {ageError && (
                <div className="error-tooltip">
                  {ageError}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={handleCancelEdit} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
