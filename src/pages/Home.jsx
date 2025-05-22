import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Aplicativo de Manutenção Comunitária</h1>
        <p>Conectando cidadãos, prefeituras e empresas para melhorar a infraestrutura urbana</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Cadastre-se</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
        </div>
      </section>
      
      <section className="features">
        <h2>Como funciona</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Para Cidadãos</h3>
            <p>Reporte problemas urbanos, acompanhe a resolução e participe ativamente da melhoria da sua comunidade.</p>
          </div>
          
          <div className="feature-card">
            <h3>Para Órgãos Públicos</h3>
            <p>Gerencie e responda às solicitações dos cidadãos com maior transparência e eficiência.</p>
          </div>
          
          <div className="feature-card">
            <h3>Para Empresas</h3>
            <p>Acesse tickets e interaja diretamente com cidadãos e órgãos públicos para realizar reparos e manutenções.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;