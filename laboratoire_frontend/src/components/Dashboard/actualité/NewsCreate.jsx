import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const NewsCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext); // Récupérer le token du contexte

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    axios.post('http://localhost:8000/api/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}` // Inclure le token dans les en-têtes
      },
    })
    .then(response => {
      console.log('Actualité ajoutée:', response.data);
      navigate('/NewsAdmin'); // Rediriger vers la page d'administration après ajout
      toast.success('Actualité ajoutée avec succès');
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de l\'actualité', error);
      setError('Erreur lors de l\'ajout de l\'actualité');
      toast.error('Erreur lors de l\'ajout de l\'actualité');
    });
  };

  return (
    <div>
      <h1>Ajouter une Actualité</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contenu</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Image</label>
          <input 
            type="file" 
            onChange={(e) => setImage(e.target.files[0])} 
            accept="image/*" 
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default NewsCreate;
