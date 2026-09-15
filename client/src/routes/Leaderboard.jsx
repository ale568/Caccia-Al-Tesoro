import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthContext from '../contexts/AuthContext';
import * as API from '../API';

import './Leaderboard.css'

function Leaderboard() {
  const { user } = useContext(AuthContext);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getLeaderboard()
      .then((data) => {
        setLeaderboardData(data);
      })
      .catch((err) => {
        console.error("Errore nel recupero della classifica:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-5 fs-4 fw-bold" style={{ color: 'var(--nav-bg)' }}>Caricamento classifica...</div>;
  }

  const sorted = [...leaderboardData].sort((a, b) => b.total_coins - a.total_coins);

  const podiumData = [
    { ...sorted[1], rank: 2, trophy: '/second-pos.png' },
    { ...sorted[0], rank: 1, trophy: '/first-pos.png' },
    { ...sorted[2], rank: 3, trophy: '/third-pos.png' }
  ];

  return (
    <div className="leaderboard-wrapper mt-4">
      
      <img src="/glass.png" alt="Lente" className="floating-bg floating-glass d-none d-lg-block" />
      <img src="/chest.png" alt="Forziere" className="floating-bg floating-chest d-none d-lg-block" />
      <img src="/path.png" alt="Percorso" className="floating-bg floating-path d-none d-lg-block" />
      
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={10}>
            
            <h1 className="page-title">CLASSIFICA</h1>
            <h4 className="page-subtitle mt-3">Scopri chi sono i migliori esploratori!</h4>
            
            <div className="custom-separator">✦</div>

            <div className="podium-container">
              {podiumData.map((player) => {

                const isCurrentUser = player.id === user.id;

                return (
                  <div 
                    key={player.id} 
                    className={`podium-card rank-${player.rank} ${isCurrentUser ? 'current-user' : ''}`}
                  >
                    
                    <img src={player.trophy} alt={`Posizione ${player.rank}`} className="trophy-img" />
                    
                    <div className="avatar-circle">
                      {player.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--nav-bg)' }}>
                      {player.username}
                    </h5>
                    
                    <div className="coin-badge">
                      {player.total_coins}
                      <img src="/coin.png" alt="Monete" className="coin-icon" />
                    </div>
                  </div>
                );
              })}
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Leaderboard;