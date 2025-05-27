import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketForm.css';
import { API_BASE_URL } from '../services/api';

function TicketForm({ user, token }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setFileName(selectedImage.name);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !address) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Enviando dados:', { title, description, address, image: image?.name });
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('address', address);
      
      if (image) {
        formData.append('image', image);
      }
      
      console.log('FormData criado, fazendo requisição...');
      
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Não adicionar Content-Type para FormData - o browser define automaticamente
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar ticket');
      }
      
      // Redirecionar para dashboard com mensagem de sucesso
      navigate('/dashboard?message=Ticket criado com sucesso!');
    } catch (err) {
      console.error('Erro na criação do ticket:', err);
      setError(err.message || 'Erro ao criar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Reportar Problema</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ex: Buraco na calçada"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Endereço *</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Ex: Rua das Flores, 123 - Centro"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Descreva o problema em detalhes..."
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Imagem (opcional)</label>
          <div className="file-input-container">
            <label className="file-input-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              Selecionar Imagem
            </label>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Ticket'}
          </button>
        </div>
      </form>
      
      <div className="info-note">
        <p><strong>Dica:</strong> Forneça o máximo de detalhes possível sobre o problema para que as empresas possam avaliar melhor o trabalho necessário.</p>
      </div>
    </div>
  );
}

export default TicketForm;