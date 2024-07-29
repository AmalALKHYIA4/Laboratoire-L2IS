import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { BASE_URL, getConfig } from '../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';
import logo from '../../assets/logo.png';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Organisation', href: '/organisation' },
  { name: 'Équipes', href: '/equipes' },
  { name: 'Personnel', href: '/personnel' },
  { name: 'Publications', href: '/publications' },
  { name: 'Projets', href: '/projets' },
  { name: 'Informations', href: '/informations' },
  { name: 'Événements', href: '/evenements' },
];

export default function Header() {
  const { accessToken, setAccessToken, currentUser, setCurrentUser } = useContext(AuthContext);
  const location = useLocation();

  const logoutUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/logout`, null, getConfig(accessToken));
      localStorage.removeItem('currentToken');
      setCurrentUser(null);
      setAccessToken('');
      toast.success(response.data.message);
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('currentToken');
        setCurrentUser(null);
        setAccessToken('');
      }
      console.log(error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 mr-2" />
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    'px-3 py-2 rounded-md text-sm font-medium',
                    location.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {currentUser && (
              <div className="ml-4 flex items-center">
                <span className="text-gray-300 hidden md:block">Bienvenue, {currentUser.name}</span>
                <button
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={logoutUser}
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
