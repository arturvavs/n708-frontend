import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketForm.css';

function TicketForm({ user, token, createTicket }) {
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
      
      // Simular atraso para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar objeto de dados do ticket
      const ticketData = {
        title,
        description,
        address,
        image: image ? fileName : null
      };
      
      // Usar a função de criação de ticket passada do App.jsx
      const success = createTicket(ticketData);
      
      if (!success) {
        throw new Error('Erro ao criar ticket');
      }
      
      // Redirecionar para dashboard com mensagem de sucesso
      navigate('/dashboard?message=Ticket criado com sucesso!');
    } catch (err) {
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
            placeholder="Ex: Rua das Flores, 123 - Bairro"
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
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
      
      <div className="demo-note">
        <p>Nota: No modo de teste, os dados são armazenados temporariamente na memória do navegador.</p>
      </div>
    </div>
  );
}

export default TicketForm;