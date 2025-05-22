import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login_API';
import Register from './pages/Register_API';
import Dashboard from './pages/Dashboard_API';
import TicketForm from './pages/TicketForm_API';
import TicketDetail from './pages/TicketDetail';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  
  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };
  
  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            user ? <Dashboard user={user} token={token} /> : <Login login={login} />
          } />
          <Route path="/create-ticket" element={
            user ? <TicketForm user={user} token={token} /> : <Login login={login} />
          } />
          <Route path="/tickets/:id" element={
            user ? <TicketDetail user={user} token={token} /> : <Login login={login} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;