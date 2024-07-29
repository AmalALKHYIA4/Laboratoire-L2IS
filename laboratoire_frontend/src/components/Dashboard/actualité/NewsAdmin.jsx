import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const NewsAdmin = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext); // Récupérer le token du contexte

    useEffect(() => {
        axios.get('http://localhost:8000/api/news', {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Inclure le token dans les en-têtes
            }
        })
        .then(response => {
            if (Array.isArray(response.data)) {
                setNewsItems(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des actualités', error);
            setError('Erreur lors de la récupération des actualités');
        });
    }, [accessToken]);

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
            axios.delete(`http://localhost:8000/api/news/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}` // Inclure le token dans les en-têtes
                }
            })
            .then(() => setNewsItems(newsItems.filter(news => news.id !== id)))
            .catch(error => {
                console.error('Erreur lors de la suppression de l\'actualité', error);
                setError('Erreur lors de la suppression de l\'actualité');
            });
        }
    };

    return (
        <div>
            <h1>Gestion des Actualités</h1>
            <Link to="/NewsCreate" className="btn btn-primary">Ajouter une Actualité</Link>
            {error && <p>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Titre</th>
                        <th>Contenu</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {newsItems.length ? (
                        newsItems.map(news => (
                            <tr key={news.id}>
                                <td>
                                    {news.image ? (
                                        <img 
                                            src={`http://localhost:8000/storage/news_images/${news.image}`} 
                                            alt={news.title} 
                                            style={{ width: '100px', height: 'auto' }} 
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>{news.title}</td>
                                <td>{news.content}</td>
                                <td>
                                    <Link to={`/NewsEdit/${news.id}`} className="btn btn-edit">Modifier</Link>
                                    <button onClick={() => handleDelete(news.id)} className="btn btn-delete">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Aucune actualité disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NewsAdmin;
