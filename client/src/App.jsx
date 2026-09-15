import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import AuthContext from './contexts/AuthContext';
import * as API from './API';

import Home from './routes/Home';
import LoginForm from './routes/LoginForm';
import Game from './routes/Game';
import Leaderboard from './routes/Leaderboard';
import Layout from './components/Layout';


function App() {
  
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica se esiste già una sessione attiva al caricamento dell'app
  useEffect(() => {
    API.getUser()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        setUser({}); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const userData = await API.login(username, password);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleLogout = async () => {
    try {
      await API.logout();
      setUser({});
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Errore durante il logout', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Caricamento in corso...</div>;
  }

  const authContextValue = {
    user,
    handleLogin,
    handleLogout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      
        <Routes>
        {/* Route padre */}
        <Route element={<Layout />}>
          
          <Route path="/" element={<Home />} />
          
          {/* Se l'utente ha già l'ID, lo reindirizzo alla home */}
          <Route path="/login" element={
            user.id ? <Navigate to="/" replace /> : < LoginForm />
          } />

          {/* Rotte Protette */}
          <Route path="/game" element={
            user.id ? <Game /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/leaderboard" element={
            user.id ? <Leaderboard /> : <Navigate to="/login" replace />
          } />

          {/* Fallback per rotte inesistenti */}
          <Route path="*" element={<h2>Pagina non trovata</h2>} />
          
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;