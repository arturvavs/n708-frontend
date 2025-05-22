import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetail.css';

function TicketDetail({ user, token, getTicket, updateStatus }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTicket();
  }, [id]);
  
  const fetchTicket = async () => {
    try {
      setLoading(true);
      
      // Simular atraso para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Usar a função de obtenção de ticket passada do App.jsx
      const ticketData = getTicket(parseInt(id));
      
      if (!ticketData) {
        throw new Error('Ticket não encontrado');
      }
      
      setTicket(ticketData);
      setNewStatus(ticketData.status);
    } catch (err) {
      setError(err.message || 'Erro ao carregar ticket');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async () => {
    if (newStatus === ticket.status) return;
    
    try {
      setStatusLoading(true);
      
      // Simular atraso para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Usar a função de atualização de status passada do App.jsx
      const success = updateStatus(ticket.id, newStatus);
      
      if (!success) {
        throw new Error('Erro ao atualizar status');
      }
      
      // Atualizar o ticket local
      setTicket({ ...ticket, status: newStatus });
      setSuccessMessage('Status atualizado com sucesso!');
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar status');
    } finally {
      setStatusLoading(false);
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
  
  const getStatusInfoClass = (status) => {
    switch (status) {
      case 'aberto': return 'open';
      case 'em andamento': return 'in-progress';
      case 'resolvido': return 'resolved';
      default: return '';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  const getStatusDescription = (status) => {
    switch(status) {
      case 'aberto':
        return 'Seu problema foi reportado e está aguardando análise.';
      case 'em andamento':
        return 'Seu problema está sendo resolvido pela equipe responsável.';
      case 'resolvido':
        return 'Este problema foi marcado como resolvido.';
      default:
        return '';
    }
  };
  
  const canUpdateStatus = user && ['admin', 'organization'].includes(user.role);

  // Simulação de imagem para testes
  const mockImageUrl = 'https://via.placeholder.com/800x600?text=Imagem+Simulada+do+Problema';

  return (
    <div className="ticket-detail-container">
      <button className="btn btn-outline back-button" onClick={() => navigate('/dashboard')}>
        Voltar
      </button>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Carregando...</div>
      ) : ticket ? (
        <div className="ticket-detail-card">
          <div className="ticket-detail-header">
            <h1>{ticket.title}</h1>
            
            {canUpdateStatus ? (
              <div className="status-update">
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={statusLoading}
                >
                  <option value="aberto">Aberto</option>
                  <option value="em andamento">Em andamento</option>
                  <option value="resolvido">Resolvido</option>
                </select>
                <button 
                  className="btn btn-small" 
                  onClick={handleUpdateStatus} 
                  disabled={statusLoading || newStatus === ticket.status}
                >
                  {statusLoading ? 'Salvando...' : 'Atualizar'}
                </button>
              </div>
            ) : (
              <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                {ticket.status}
              </span>
            )}
          </div>
          
          <div className="ticket-detail-content">
            <div className="ticket-info">
              <p><strong>Endereço:</strong> {ticket.address}</p>
              <p><strong>Criado por:</strong> {ticket.user?.name || 'Usuário Desconhecido'}</p>
              <p><strong>Data:</strong> {formatDate(ticket.created_at)}</p>
              
              <div className="ticket-description">
                <h3>Descrição</h3>
                <p>{ticket.description}</p>
              </div>
              
              <div className={`status-info ${getStatusInfoClass(ticket.status)}`}>
                <h4>{ticket.status === 'aberto' ? 'Aguardando análise' : 
                    ticket.status === 'em andamento' ? 'Em andamento' : 
                    'Problema resolvido'}</h4>
                <p>{getStatusDescription(ticket.status)}</p>
              </div>
            </div>
            
            {/* Usar imagem simulada para testes */}
            <div className="ticket-image">
              <h3>Imagem</h3>
              <img 
                src={mockImageUrl}
                alt="Imagem simulada do problema" 
              />
              <p className="mock-note">(Imagem simulada para testes)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="not-found">Ticket não encontrado</div>
      )}
    </div>
  );
}

export default TicketDetail;