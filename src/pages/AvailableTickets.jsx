import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';
import { API_BASE_URL } from '../services/api';

function AvailableTickets({ user, token }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assumingTicket, setAssumingTicket] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    fetchAvailableTickets();
  }, [token]);
  
  const fetchAvailableTickets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await api.getAvailableTickets(token);
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Erro ao buscar tickets disponíveis:', err);
      setError(err.message || 'Erro ao carregar tickets disponíveis');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssumeTicket = async (ticketId) => {
    try {
      setAssumingTicket(ticketId);
      setError('');
      
      await api.assumeTicket(ticketId, token);
      
      setSuccessMessage('Ticket assumido com sucesso!');
      // Remover o ticket da lista pois não está mais disponível
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao assumir ticket:', err);
      setError(err.message || 'Erro ao assumir ticket');
    } finally {
      setAssumingTicket(null);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tickets Disponíveis</h1>
        <p>Tickets que estão aguardando para serem assumidos por uma empresa</p>
      </div>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
          <button 
            className="btn btn-small" 
            onClick={fetchAvailableTickets}
            style={{ marginLeft: '10px' }}
          >
            Tentar Novamente
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="loading-spinner">Carregando...</div>
      ) : tickets.length === 0 ? (
        <div className="no-tickets">
          <p>Nenhum ticket disponível no momento.</p>
          <p>Todos os tickets estão sendo atendidos ou já foram resolvidos.</p>
          <button 
            className="btn btn-primary" 
            onClick={fetchAvailableTickets}
          >
            Recarregar
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.title}</h3>
                <span className="status-badge status-open">
                  Disponível
                </span>
              </div>
              <p className="ticket-address">{ticket.address}</p>
              <p className="ticket-description">{ticket.description}</p>
              <div className="ticket-footer">
                <span className="ticket-date">{formatDate(ticket.created_at)}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/tickets/${ticket.id}`} className="btn btn-small btn-outline">
                    Ver Detalhes
                  </Link>
                  <button 
                    className="btn btn-small btn-primary"
                    onClick={() => handleAssumeTicket(ticket.id)}
                    disabled={assumingTicket === ticket.id}
                  >
                    {assumingTicket === ticket.id ? 'Assumindo...' : 'Assumir'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailableTickets;