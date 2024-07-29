import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const NewsEdit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext); // Récupérer le token du contexte

    useEffect(() => {
        axios.get(`http://localhost:8000/api/news/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Inclure le token dans les en-têtes
            }
        })
        .then(response => {
            const news = response.data;
            setTitle(news.title);
            setContent(news.content);
            setImage(news.image);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'actualité', error);
            setError('Erreur lors de la récupération de l\'actualité');
        });
    }, [id, accessToken]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        axios.put(`http://localhost:8000/api/news/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}` // Inclure le token dans les en-têtes
            },
        })
        .then(response => {
            console.log('Actualité modifiée:', response.data);
            navigate('/NewsAdmin'); // Rediriger vers la page d'administration après modification
            toast.success('Actualité modifiée avec succès');
        })
        .catch(error => {
            console.error('Erreur lors de la modification de l\'actualité', error);
            setError('Erreur lors de la modification de l\'actualité');
            toast.error('Erreur lors de la modification de l\'actualité');
        });
    };

    return (
        <div>
            <h1>Modifier l'Actualité</h1>
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
                <button type="submit">Modifier</button>
            </form>
        </div>
    );
};

export default NewsEdit;
