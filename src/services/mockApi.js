import { 
  mockLogin, 
  mockRegister, 
  mockTickets, 
  getEnrichedTickets, 
  mockCreateTicket, 
  mockUpdateTicketStatus 
} from '../mockData';

// Simular atraso de rede para tornar a experiência mais realista
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MockApi = {
  // Autenticação
  login: async (email, password) => {
    await delay(800); // Simular atraso da rede
    try {
      return mockLogin(email, password);
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    await delay(1200); // Simular atraso da rede
    try {
      return mockRegister(userData);
    } catch (error) {
      throw error;
    }
  },
  
  // Tickets
  getTickets: async (filters = {}) => {
    await delay(1000);
    try {
      let tickets = [...mockTickets];
      
      // Aplicar filtros
      if (filters.status) {
        tickets = tickets.filter(ticket => ticket.status === filters.status);
      }
      
      if (filters.userId && filters.userRole === 'user') {
        tickets = tickets.filter(ticket => ticket.user_id === filters.userId);
      }
      
      if (filters.location) {
        tickets = tickets.filter(ticket => 
          ticket.address.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      return { tickets };
    } catch (error) {
      throw error;
    }
  },
  
  getTicket: async (ticketId) => {
    await delay(800);
    try {
      const ticket = getEnrichedTickets().find(t => t.id === parseInt(ticketId));
      
      if (!ticket) {
        throw new Error('Ticket não encontrado');
      }
      
      return { ticket };
    } catch (error) {
      throw error;
    }
  },
  
  createTicket: async (ticketData, userId) => {
    await delay(1500);
    try {
      return mockCreateTicket(ticketData, userId);
    } catch (error) {
      throw error;
    }
  },
  
  updateTicketStatus: async (ticketId, status) => {
    await delay(700);
    try {
      return mockUpdateTicketStatus(ticketId, status);
    } catch (error) {
      throw error;
    }
  }
};

export default MockApi;