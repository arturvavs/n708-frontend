import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

// Usuários fictícios para teste
const mockUsers = [
  {
    id: 1,
    name: 'Admin Teste',
    email: 'admin@example.com',
    document: '000.000.000-00',
    document_type: 'cpf',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Prefeitura Teste',
    email: 'prefeitura@example.com',
    document: '00.000.000/0000-00',
    document_type: 'cnpj',
    role: 'organization'
  },
  {
    id: 3,
    name: 'Usuário Comum',
    email: 'usuario@example.com',
    document: '123.456.789-00',
    document_type: 'cpf',
    role: 'user'
  }
];

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se há uma mensagem de sucesso do registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Reset do state para evitar mensagem persistente
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Função simplificada para login local sem API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Simulação de tempo de resposta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se o email existe nos usuários fictícios
      const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      // Em modo de teste, qualquer senha é aceita
      const token = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
      
      onLogin(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
        <p className="auth-redirect">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
        
        {/* Dados para facilitar o teste */}
        <div className="demo-accounts">
          <p>Contas de demonstração:</p>
          <ul>
            <li>Admin: admin@example.com</li>
            <li>Organização: prefeitura@example.com</li>
            <li>Usuário: usuario@example.com</li>
            <li>Senha: qualquer senha funciona</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default Login;