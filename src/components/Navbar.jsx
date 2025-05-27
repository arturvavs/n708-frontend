import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout, canCreateTickets }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Manutenção Comunitária
        </Link>
        
        <div className="nav-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                {user.document_type === 'cnpj' ? 'Tickets Disponíveis' : 'Meus Tickets'}
              </Link>
              {canCreateTickets && (
                <Link to="/create-ticket" className="nav-link">Novo Ticket</Link>
              )}
              <span className="user-info">
                {user.name} ({user.document_type === 'cnpj' ? 'Empresa' : 'Pessoa Física'})
              </span>
              <button onClick={onLogout} className="logout-btn">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Cadastro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;