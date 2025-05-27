import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { API_BASE_URL } from '../services/api';

function Dashboard({ user, token, isCompany }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 5000);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);
  
  useEffect(() => {
    fetchTickets();
  }, [statusFilter, token]);
  
  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      let url = `${API_BASE_URL}/tickets`;
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
  
  const handleAssignTicket = async (ticketId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao assumir ticket');
      }
      
      setSuccessMessage('Ticket assumido com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchTickets(); // Recarregar lista
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };
  
  const handleCompleteTicket = async (ticketId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao finalizar ticket');
      }
      
      setSuccessMessage('Ticket finalizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchTickets(); // Recarregar lista
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
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

  const getPageTitle = () => {
    if (isCompany) {
      return 'Tickets Disponíveis';
    }
    return 'Meus Tickets';
  };

  const canCreateTickets = user && user.document_type === 'cpf';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{getPageTitle()}</h1>
        {canCreateTickets && (
          <Link to="/create-ticket" className="btn btn-primary">Novo Ticket</Link>
        )}
      </div>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      {error && (
        <div className="error-message">{error}</div>
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
      
      {loading ? (
        <div className="loading-spinner">Carregando...</div>
      ) : tickets.length === 0 ? (
        <div className="no-tickets">
          <p>
            {isCompany 
              ? 'Nenhum ticket disponível no momento.' 
              : 'Nenhum ticket encontrado.'
            }
          </p>
          {canCreateTickets && (
            <Link to="/create-ticket" className="btn btn-primary">Criar Ticket</Link>
          )}
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
              
              {ticket.assigned_company && (
                <p className="ticket-company">
                  <strong>Empresa responsável:</strong> {ticket.assigned_company.name}
                </p>
              )}
              
              <div className="ticket-footer">
                <span className="ticket-date">{formatDate(ticket.created_at)}</span>
                <div className="ticket-actions">
                  <Link to={`/tickets/${ticket.id}`} className="btn btn-small">
                    Ver Detalhes
                  </Link>
                  
                  {isCompany && ticket.status === 'aberto' && (
                    <button 
                      className="btn btn-small btn-primary"
                      onClick={() => handleAssignTicket(ticket.id)}
                    >
                      Assumir
                    </button>
                  )}
                  
                  {isCompany && ticket.status === 'em andamento' && 
                   ticket.assigned_company && ticket.assigned_company.id === user.id && (
                    <button 
                      className="btn btn-small btn-success"
                      onClick={() => handleCompleteTicket(ticket.id)}
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;