import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { API_BASE_URL } from '../services/api';

function AssignedTickets({ user, token }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchAssignedTickets();
  }, [token]);
  
  // Refetch quando o filtro muda
  useEffect(() => {
    if (!loading) {
      fetchAssignedTickets();
    }
  }, [statusFilter]);
  
  const fetchAssignedTickets = async () => {
    try {
      setLoading(true);
      
      let url = `${API_BASE_URL}/tickets/assigned`;
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar seus tickets');
      }
      
      // Filtrar no frontend se necessário (caso o backend não tenha filtro)
      let filteredTickets = data.tickets;
      if (statusFilter) {
        filteredTickets = data.tickets.filter(ticket => ticket.status === statusFilter);
      }
      
      setTickets(filteredTickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      setUpdatingStatus(ticketId);
      
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar status');
      }
      
      // Atualizar o ticket na lista local
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updated_at: new Date().toISOString() }
          : ticket
      ));
      
      setSuccessMessage(`Ticket ${newStatus === 'resolvido' ? 'finalizado' : 'atualizado'} com sucesso!`);
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingStatus(null);
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
        <h1>Meus Tickets</h1>
        <p>Tickets que sua empresa assumiu</p>
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
          <option value="em andamento">Em andamento</option>
          <option value="resolvido">Resolvido</option>
        </select>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Carregando...</div>
      ) : tickets.length === 0 ? (
        <div className="no-tickets">
          <p>
            {statusFilter 
              ? `Nenhum ticket ${statusFilter} encontrado.`
              : 'Você ainda não assumiu nenhum ticket.'
            }
          </p>
          <Link to="/available-tickets" className="btn btn-primary">
            Ver Tickets Disponíveis
          </Link>
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
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link to={`/tickets/${ticket.id}`} className="btn btn-small btn-outline">
                    Ver Detalhes
                  </Link>
                  {ticket.status === 'em andamento' && (
                    <button 
                      className="btn btn-small btn-primary"
                      onClick={() => handleUpdateStatus(ticket.id, 'resolvido')}
                      disabled={updatingStatus === ticket.id}
                    >
                      {updatingStatus === ticket.id ? 'Finalizando...' : 'Finalizar'}
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

export default AssignedTickets;