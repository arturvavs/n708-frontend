import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user, token }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Verificar se existe uma mensagem de sucesso na navegação
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(message);
      // Limpar a mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, []);
  
  useEffect(() => {
    fetchTickets();
  }, [statusFilter, token]);
  
  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      let url = 'http://localhost:5000/api/tickets';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar tickets');
      }
      
      setTickets(data.tickets);
    } catch (err) {
      setError(err.message);
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