import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../config/tools';
import '../styles/global.css';
import '../styles/dashboard.css';

const Dashboard = () => {

  const handleRecommendationSubmit = (e) => {
    e.preventDefault();
    alert('Obrigado pela sugestão! Vamos analisar com carinho. 💡');
    e.target.reset();
  };

  return (
    <div className="dashboard-container">
      <div className="hero-section">
        <h1>Bem-vindo ao Jeito de Casa</h1>
        <p>Penando para organizar sua casa? A gente dá um jeito!</p>
      </div>

      <h2 className="section-title">Nossas Ferramentas</h2>
      <div className="tools-grid">
        {TOOLS.map((tool) => (
          <div key={tool.path} className="tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <Link to={tool.path} className="btn-tool">
              Acessar Ferramenta
            </Link>
          </div>
        ))}
      </div>

      <h2 className="section-title">Tem uma ideia?</h2>
      <div className="recommendation-section">
        <p style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>
          Sentiu falta de alguma ferramenta? Conte para nós o que ajudaria na organização da sua casa!
        </p>
        <form className="recommendation-form" onSubmit={handleRecommendationSubmit}>
          <textarea 
            placeholder="Ex: Gostaria de um cronograma de limpeza semanal..."
            required
          ></textarea>
          <button type="submit" className="btn-submit">Enviar Sugestão</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
