import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { API_BASE_URL } from '../services/api';

function Register() {
  const [userType, setUserType] = useState('fisica'); // 'fisica' ou 'juridica'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState(''); // CPF ou CNPJ dependendo do tipo
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Formatar CEP enquanto digita
  const handleZipCodeChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setZipCode(value);
  };

  // Formatar CPF enquanto digita
  const handleCPFChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    setDocument(value);
  };

  // Formatar CNPJ enquanto digita
  const handleCNPJChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    if (value.length > 12) {
      value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}`;
    } else if (value.length > 8) {
      value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`;
    } else if (value.length > 5) {
      value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}.${value.slice(2)}`;
    }
    setDocument(value);
  };

  // Buscar CEP na API ViaCEP
  const searchCEP = async () => {
    const cep = zipCode.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        setState(data.uf || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!name || !email || !document || !street || !number || !city || !state || !zipCode || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // Validação de documento
    const documentValue = document.replace(/\D/g, '');
    if ((userType === 'fisica' && documentValue.length !== 11) || 
        (userType === 'juridica' && documentValue.length !== 14)) {
      setError(userType === 'fisica' ? 'CPF inválido' : 'CNPJ inválido');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Montar o objeto de endereço
      const address = {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode: zipCode.replace(/\D/g, '')
      };
      
      // Preparar dados para envio
      const userData = {
        name,
        email,
        password,
        address,
        role: userType === 'fisica' ? 'user' : 'organization',
        documentType: userType === 'fisica' ? 'cpf' : 'cnpj',
        document: documentValue
      };
      
      // Fazer a requisição diretamente (sem usar api.js que tem problema)
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao realizar cadastro');
      }
      
      // Redirecionar para a página de login
      navigate('/login', { 
        state: { 
          message: 'Cadastro realizado com sucesso! Faça login para continuar.' 
        } 
      });
    } catch (err) {
      console.error('Erro no registro:', err);
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  // Alternar tipo de usuário
  const toggleUserType = (type) => {
    setUserType(type);
    setDocument('');
  };

  return (
    <div className="auth-container">
      <form className="auth-form register-form" onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="user-type-toggle">
          <button 
            type="button"
            className={`user-type-btn ${userType === 'fisica' ? 'active' : ''}`}
            onClick={() => toggleUserType('fisica')}
          >
            Pessoa Física
          </button>
          <button 
            type="button"
            className={`user-type-btn ${userType === 'juridica' ? 'active' : ''}`}
            onClick={() => toggleUserType('juridica')}
          >
            Pessoa Jurídica
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="name">{userType === 'fisica' ? 'Nome Completo' : 'Nome da Empresa'} *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="document">
            {userType === 'fisica' ? 'CPF *' : 'CNPJ *'}
          </label>
          <input
            type="text"
            id="document"
            value={document}
            onChange={userType === 'fisica' ? handleCPFChange : handleCNPJChange}
            placeholder={userType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <h3 className="form-section-title">Endereço</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zipCode">CEP *</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={handleZipCodeChange}
              onBlur={searchCEP}
              placeholder="00000-000"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="street">Logradouro *</label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="number">Número *</label>
            <input
              type="text"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="complement">Complemento</label>
            <input
              type="text"
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="neighborhood">Bairro *</label>
          <input
            type="text"
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Cidade *</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="state">Estado *</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              maxLength={2}
              required
            />
          </div>
        </div>
        
        <h3 className="form-section-title">Segurança</h3>
        
        <div className="form-group">
          <label htmlFor="password">Senha *</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha *</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        
        <p className="auth-redirect">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;