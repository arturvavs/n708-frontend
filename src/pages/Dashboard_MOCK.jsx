import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user, token, getTickets }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const location = useLocation();
  
  // Verificar se há uma mensagem de sucesso (por exemplo, após criar um ticket)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(message);
      // Limpar a mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Atualizar a URL sem a query string
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);
  
  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);
  
  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Simular atraso para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Usar a função de filtro passada do App.jsx
      const filters = {
        status: statusFilter,
        userId: user.id,
        userRole: user.role
      };
      
      const filteredTickets = getTickets(filters);
      setTickets(filteredTickets);
    } catch (err) {
      setError('Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'aberto': return 'status-open';
      case 'em andamento': return 'status-in-progress';
      case 'resolvido': return 'status-resolved';
      default: return '';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Painel de Controle</h1>
        <Link to="/create-ticket" className="btn btn-primary">Novo Ticket</Link>
      </div>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      <div className="filter-container">
        <label htmlFor="status-filter">Filtrar por status:</label>
        <select 
          id="status-filter" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="aberto">Aberto</option>
          <option value="em andamento">Em andamento</option>
          <option value="resolvido">Resolvido</option>
        </select>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Carregando...</div>
      ) : tickets.length === 0 ? (
        <div className="no-tickets">
          <p>Nenhum ticket encontrado.</p>
          <Link to="/create-ticket" className="btn btn-primary">Criar Ticket</Link>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.title}</h3>
                <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
              <p className="ticket-address">{ticket.address}</p>
              <p className="ticket-description">{ticket.description}</p>
              <div className="ticket-footer">
                <span className="ticket-date">{formatDate(ticket.created_at)}</span>
                <Link to={`/tickets/${ticket.id}`} className="btn btn-small">
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;