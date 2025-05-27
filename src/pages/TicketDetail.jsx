import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetail.css';
import { API_BASE_URL } from '../services/api';

function TicketDetail({ user, token, isCompany }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTicket();
  }, [id, token]);
  
  const fetchTicket = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar ticket');
      }
      
      setTicket(data.ticket);
      setFeedback(data.ticket.feedback || '');
    } catch (err) {
      setError(err.message || 'Erro ao carregar ticket');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssignTicket = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}/assign`, {
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
      fetchTicket(); // Recarregar dados
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };
  
  const handleCompleteTicket = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}/complete`, {
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
      fetchTicket(); // Recarregar dados
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };
  
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setError('Por favor, insira um feedback');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      setFeedbackLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/tickets/${id}/feedback`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar feedback');
      }
      
      setSuccessMessage('Feedback enviado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchTicket(); // Recarregar dados
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setFeedbackLoading(false);
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
        return 'Este ticket está aguardando uma empresa para assumir o trabalho.';
      case 'em andamento':
        return 'Este ticket foi assumido por uma empresa e está sendo resolvido.';
      case 'resolvido':
        return 'Este ticket foi marcado como resolvido pela empresa responsável.';
      default:
        return '';
    }
  };
  
  // Verificar permissões
  const canAssign = isCompany && ticket?.status === 'aberto';
  const canComplete = isCompany && ticket?.status === 'em andamento' && 
                     ticket?.assigned_company?.id === user?.id;
  const canAddFeedback = !isCompany && ticket?.status === 'resolvido' && 
                        ticket?.user_id === user?.id;
  const isAuthor = ticket?.user_id === user?.id;

  // Simulação de imagem para testes
  const mockImageUrl = 'https://via.placeholder.com/800x600?text=Imagem+do+Problema';

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
            
            <div className="ticket-actions">
              <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                {ticket.status}
              </span>
              
              {canAssign && (
                <button 
                  className="btn btn-primary" 
                  onClick={handleAssignTicket}
                >
                  Assumir Ticket
                </button>
              )}
              
              {canComplete && (
                <button 
                  className="btn btn-success" 
                  onClick={handleCompleteTicket}
                >
                  Finalizar Ticket
                </button>
              )}
            </div>
          </div>
          
          <div className="ticket-detail-content">
            <div className="ticket-info">
              <p><strong>Endereço:</strong> {ticket.address}</p>
              <p><strong>Criado por:</strong> {ticket.user?.name || 'Usuário Desconhecido'}</p>
              <p><strong>Data de criação:</strong> {formatDate(ticket.created_at)}</p>
              
              {ticket.assigned_company && (
                <p><strong>Empresa responsável:</strong> {ticket.assigned_company.name}</p>
              )}
              
              <div className="ticket-description">
                <h3>Descrição</h3>
                <p>{ticket.description}</p>
              </div>
              
              <div className={`status-info ${getStatusInfoClass(ticket.status)}`}>
                <h4>{ticket.status === 'aberto' ? 'Aguardando empresa' : 
                    ticket.status === 'em andamento' ? 'Em andamento' : 
                    'Problema resolvido'}</h4>
                <p>{getStatusDescription(ticket.status)}</p>
              </div>
              
              {/* Seção de Feedback */}
              {ticket.status === 'resolvido' && (
                <div className="feedback-section">
                  <h3>Feedback do Cliente</h3>
                  
                  {ticket.feedback ? (
                    <div className="existing-feedback">
                      <p><strong>Feedback:</strong></p>
                      <p className="feedback-text">{ticket.feedback}</p>
                    </div>
                  ) : canAddFeedback ? (
                    <form onSubmit={handleSubmitFeedback} className="feedback-form">
                      <p>Como foi o atendimento? Deixe seu feedback sobre a resolução do problema:</p>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows="4"
                        placeholder="Descreva como foi o atendimento e se o problema foi resolvido adequadamente..."
                        className="feedback-textarea"
                        disabled={feedbackLoading}
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={feedbackLoading || !feedback.trim()}
                      >
                        {feedbackLoading ? 'Enviando...' : 'Enviar Feedback'}
                      </button>
                    </form>
                  ) : (
                    <p className="no-feedback">Aguardando feedback do cliente.</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Imagem do problema */}
            <div className="ticket-image">
              <h3>Imagem do Problema</h3>
              <img 
                src={ticket.image_url || mockImageUrl}
                alt="Imagem do problema" 
              />
              {!ticket.image_url && (
                <p className="mock-note">(Imagem simulada para demonstração)</p>
              )}
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