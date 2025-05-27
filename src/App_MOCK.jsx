import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketForm from './pages/TicketForm';
import TicketDetail from './pages/TicketDetail';
import './App.css';

// Dados fictícios para teste (mover para App para centralizar)
const mockTickets = [
  {
    id: 1,
    title: 'Buraco na calçada',
    description: 'Existe um buraco grande na calçada que está causando acidentes com pedestres.',
    user_id: 3,
    user: {
      id: 3,
      name: 'Usuário Comum',
      email: 'usuario@example.com'
    },
    image_url: null,
    address: 'Rua das Flores, 123 - Centro',
    status: 'aberto',
    created_at: '2025-05-15T10:30:00',
    updated_at: '2025-05-15T10:30:00'
  },
  {
    id: 2,
    title: 'Poste com lâmpada queimada',
    description: 'A lâmpada do poste da esquina está queimada há mais de uma semana, deixando a rua escura durante a noite.',
    user_id: 3,
    user: {
      id: 3,
      name: 'Usuário Comum',
      email: 'usuario@example.com'
    },
    image_url: null,
    address: 'Avenida Principal, 500 - Jardim Europa',
    status: 'em andamento',
    created_at: '2025-05-14T15:45:00',
    updated_at: '2025-05-16T09:20:00'
  },
  {
    id: 3,
    title: 'Vazamento de água',
    description: 'Há um vazamento de água na rua que está causando desperdício e formando uma poça grande.',
    user_id: 3,
    user: {
      id: 3,
      name: 'Usuário Comum',
      email: 'usuario@example.com'
    },
    image_url: null,
    address: 'Rua dos Ipês, 78 - Jardim Botânico',
    status: 'resolvido',
    created_at: '2025-05-10T08:15:00',
    updated_at: '2025-05-17T14:30:00'
  },
  {
    id: 4,
    title: 'Lixo acumulado',
    description: 'Lixo acumulado na esquina da rua há vários dias sem coleta.',
    user_id: 2,
    user: {
      id: 2,
      name: 'Prefeitura Teste',
      email: 'prefeitura@example.com'
    },
    image_url: null,
    address: 'Rua das Acácias, 45 - Vila Nova',
    status: 'aberto',
    created_at: '2025-05-18T11:20:00',
    updated_at: '2025-05-18T11:20:00'
  },
  {
    id: 5,
    title: 'Semáforo com defeito',
    description: 'O semáforo da avenida principal com a rua lateral está piscando em amarelo continuamente.',
    user_id: 3,
    user: {
      id: 3,
      name: 'Usuário Comum',
      email: 'usuario@example.com'
    },
    image_url: null,
    address: 'Avenida Brasil com Rua Rio Branco - Centro',
    status: 'em andamento',
    created_at: '2025-05-16T09:10:00',
    updated_at: '2025-05-17T10:45:00'
  }
];

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [tickets, setTickets] = useState(mockTickets);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };
  
  // Funções de manipulação de tickets para componentes filhos
  const getFilteredTickets = (filters = {}) => {
    let filteredTickets = [...tickets];
    
    if (filters.status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
    }
    
    if (filters.userId && filters.userRole === 'user') {
      filteredTickets = filteredTickets.filter(ticket => ticket.user_id === filters.userId);
    }
    
    if (filters.location) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return filteredTickets;
  };
  
  const getTicketById = (id) => {
    return tickets.find(ticket => ticket.id === parseInt(id));
  };
  
  const updateTicketStatus = (id, newStatus) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === parseInt(id)) {
        return { ...ticket, status: newStatus, updated_at: new Date().toISOString() };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    return true;
  };
  
  const createTicket = (ticketData) => {
    const newId = Math.max(...tickets.map(t => t.id)) + 1;
    
    const newTicket = {
      id: newId,
      title: ticketData.title,
      description: ticketData.description,
      address: ticketData.address,
      image_url: null, // Simulação de upload
      user_id: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      status: 'aberto',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTickets([newTicket, ...tickets]);
    return true;
  };
  
  if (loading) {
    return <div className="loading-spinner">Carregando...</div>;
  }
  
  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard 
                  user={user} 
                  token={token} 
                  getTickets={getFilteredTickets}
                />
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/create-ticket" 
            element={
              user ? (
                <TicketForm 
                  user={user} 
                  token={token} 
                  createTicket={createTicket}
                />
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/tickets/:id" 
            element={
              user ? (
                <TicketDetail 
                  user={user} 
                  token={token} 
                  getTicket={getTicketById}
                  updateStatus={updateTicketStatus}
                />
              ) : <Navigate to="/login" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;