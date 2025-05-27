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

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
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
  
  // Verificar se o usuário pode criar tickets (apenas pessoa física)
  const canCreateTickets = user && user.document_type === 'cpf';
  
  // Verificar se o usuário é empresa
  const isCompany = user && user.document_type === 'cnpj';
  
  if (loading) {
    return <div className="loading-spinner">Carregando...</div>;
  }
  
  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} canCreateTickets={canCreateTickets} />
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
                  isCompany={isCompany}
                />
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/create-ticket" 
            element={
              user && canCreateTickets ? (
                <TicketForm 
                  user={user} 
                  token={token}
                />
              ) : <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/tickets/:id" 
            element={
              user ? (
                <TicketDetail 
                  user={user} 
                  token={token}
                  isCompany={isCompany}
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