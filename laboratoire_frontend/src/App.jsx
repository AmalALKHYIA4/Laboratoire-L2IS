import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Personnel from './pages/Personnel';
import Equipes from './pages/Equipes';
import Evenements from './pages/Evenements';
import Informations from './pages/Informations';
import Organisation from './pages/Organisation';
import Projets from './pages/Projets';
import Publications from './pages/Publications';
import { useEffect, useState } from 'react';
import { getConfig, BASE_URL } from './helpers/config';
import { AuthContext } from './context/authContext';
import axios from 'axios';
import MasterLayout from './components/layouts/admin/MasterLayout';
import AdminPrivateRoute from './AdminPrivateRoute';
import Sidebar from './components/sidebare'; 
import fullscreen from './assets/fullscreen.png';
import NewsAdmin from './components/Dashboard/actualité/NewsAdmin';
import NewsCreate from './components/Dashboard/actualité/NewsCreate';
import NewsEdit from './components/Dashboard/actualité/NewsEdit';
import NewsDetails from './components/Dashboard/actualité/NewsDetails';

function App() {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')));
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken));
        setCurrentUser(response.data.user);
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem('currentToken');
          setCurrentUser(null);
          setAccessToken('');
        }
        console.log(error);
      }
    };
    if (accessToken) fetchCurrentlyLoggedInUser();
  }, [accessToken]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser }}>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
            <h1 className="text-xl font-bold">L2IS / Université Cadi Ayyad / FSTG</h1>
            <img
              src={fullscreen}
              alt="Toggle Sidebar"
              className="cursor-pointer"
              onClick={toggleSidebar}
              style={{ width: '24px', height: '24px' }} // Adjust the size as needed
            />
          </header>

          <div className="flex flex-1 pt-16"> {/* Add padding-top to avoid header overlap */}
            {isSidebarVisible && (
              <Sidebar
                currentUser={currentUser}
                logoutUser={() => {
                  localStorage.removeItem('currentToken');
                  setCurrentUser(null);
                  setAccessToken('');
                }}
              />
            )}
            <div className={`flex-1 transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
              <Main
                currentUser={currentUser}
                logoutUser={() => {
                  localStorage.removeItem('currentToken');
                  setCurrentUser(null);
                  setAccessToken('');
                }}
                isSidebarVisible={isSidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

const Main = ({ currentUser, logoutUser, isSidebarVisible, toggleSidebar }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isLoginRoute = location.pathname === '/admin/login';

  return (
    <div className="p-4 w-full">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              currentUser={currentUser}
              logoutUser={logoutUser}
              isSidebarVisible={isSidebarVisible}
              toggleSidebar={toggleSidebar}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/equipes" element={<Equipes />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/informations" element={<Informations />} />
        <Route path="/organisation" element={<Organisation />} />
        <Route path="/personnel" element={<Personnel />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/NewsAdmin" element={<NewsAdmin/>} />
        <Route path="/NewsCreate" element={<NewsCreate/>} />
        <Route path="/NewsEdit/:id" element={<NewsEdit/>} />
        <Route path="/news/:id" element={<NewsDetails/>} />

                
                
        <Route
          path="/dashboard"
          element={
            <AdminPrivateRoute>
              <MasterLayout />
            </AdminPrivateRoute>
          }
        >
         
        </Route>
      </Routes>
    </div>
  );
};

export default App;
