import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { Container, Row, Col} from 'react-bootstrap';

import * as API from '../API';

import PlacesModal from '../components/PlacesModal';
import AbandonModal from '../components/AbandonModal';
import GameSetup from '../components/GameSetup'; 
import GameEnd from '../components/GameEnd';

import './Game.css'

function Game() {
  
  const [gamePhase, setGamePhase] = useState('SETUP');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPlaces, setShowPlaces] = useState(false);
  
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  
  const [gameData, setGameData] = useState({
    id: '',
    timeLimitSeconds: 0,
    firstClue: '',
    places: []
  });

  const { setIsPlaying } = useOutletContext();

  useEffect(() => {
    if (gamePhase === 'PLAYING') {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }

    return () => setIsPlaying(false);
  }, [gamePhase, setIsPlaying]);
  
  // Gestione Difficoltà
  const handleStartGame = async (difficulty) => {
    setLoading(true);
    setError('');
    
    try {
      
      const data = await API.createGame(difficulty);

      setGameData({
        ...data,
        visitedPlaces: [] 
      });
      setGamePhase('PLAYING');
      
      
      
    } catch (err) {
      setError(err.message || 'Errore durante la creazione della partita');
    } finally {
      setLoading(false);
    }
  };

  // Gestione Luoghi
  const handlePlaceSelect = async (placeId) => {
    setShowPlaces(false); 
    setLoading(true);
    setError('');

    try {
      const result = await API.sendAnswer(gameData.id, placeId);
      
      const selectedPlace = gameData.places.find(p => p.id === placeId);

      if (result.outcome === 'WRONG_ANSWER' || result.outcome === 'TIME_OUT') {
        // Partita persa
        setGameData(prev => ({
          ...prev,
          visitedPlaces: result.fullPath, 
          status: 'Persa'
        }));
        setGamePhase('END');
        
      } else if (result.outcome === 'WIN') {
        // Risposta corretta e vittoria
        setGameData(prev => ({
          ...prev,
          visitedPlaces: [...(prev.visitedPlaces || []), selectedPlace],
          coinsWon: result.coins,
          status: 'Vinta'
        }));
        setGamePhase('END');
        
      } else if (result.outcome === 'CORRECT') {
        // Risposta corretta
        setGameData(prev => ({
          ...prev,
          visitedPlaces: [...(prev.visitedPlaces || []), selectedPlace],
          firstClue: result.nextClue 
        }));
      }
      
    } catch (err) {
      setError(err.message || 'Errore durante la validazione della mossa');
    } finally {
      setLoading(false);
    }
  };

  // Gestione Timer
  useEffect(() => {
    let intervalId;
    
    if (gamePhase === 'PLAYING' && gameData.timeLimitSeconds > 0) {
      intervalId = setInterval(() => {
        setGameData(prev => ({
          ...prev,
          timeLimitSeconds: prev.timeLimitSeconds - 1
        }));
      }, 1000);
    } 
    
    if (gamePhase === 'PLAYING' && gameData.timeLimitSeconds === 0) {
      const timeoutId = setTimeout(() => {
        const fallbackPlaceId = gameData.places && gameData.places.length > 0 ? gameData.places[0].id : 1;
        handlePlaceSelect(fallbackPlaceId);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, gameData.timeLimitSeconds]);


  // --- Setup ---
  if (gamePhase === 'SETUP') {
    return (
      <GameSetup 
        onStart={handleStartGame} 
        loading={loading} 
        error={error} 
      />
    );
  }

  // --- Gioco ---
  if (gamePhase === 'PLAYING') {

    const visitedPlaces = gameData.visitedPlaces || [];
    
    const availablePlaces = (gameData.places || []).filter(
      (place) => !visitedPlaces.some((visited) => visited.id === place.id)
    );

    return (
      <Container fluid className="mt-4 px-lg-5 mb-4">
        
        <div className="game-layout">
          
          <Row className="g-4 align-items-center">
            
            {/* Indizio */}
            <Col lg="auto" className="ms-lg-5">
              <div className="dashboard-card">
                <div className="clue-title">Indizio Attuale:</div>
                <p className="clue-text">"{gameData.firstClue}"</p>
              </div>
            </Col>

            {/* Luoghi */}
            <Col lg="auto">
              <div className="dashboard-card align-items-center">
                <p className="text-muted fw-bold mb-2">Scegli la tua prossima mossa</p>
                <button 
                  className="places-text-btn"
                  onClick={() => setShowPlaces(true)}
                >
                  Luoghi disponibili
                </button>
              </div>
            </Col>

            <Col lg="auto">
              <div className="dashboard-card align-items-center">
                <button 
                  className="places-text-btn text-danger"
                  onClick={() => setShowAbandonModal(true)}
                >
                  Abbandona
                </button>
              </div>
            </Col>

            {/* Timer*/}
            <Col lg="auto" className="ms-auto">
              <div className="dashboard-card timer-card align-items-center text-center">
                <span className="text-muted fw-bold mb-1">TEMPO</span>
                <p className="timer-text">
                  <img src="/timer.png" className="timer-icon" /> 
                  {gameData.timeLimitSeconds}s
                </p>
              </div>
            </Col>

          </Row>

          <div className="map-card-wrapper">
            
            {visitedPlaces.map((place, index) => (
              <div key={place.id} className="map-pin" style={{ left: `${place.x}%`, top: `${place.y}%` }}>
                <div className="pin-icon">
                  <img src="/pin.png" alt="pin" /> 
                </div>
                <div className="pin-label">
                  <span className="fw-bold me-1">{index + 1}.</span> 
                  {place.name}
                </div>
              </div>
            ))}

            <PlacesModal 
              show={showPlaces} 
              onClose={() => setShowPlaces(false)} 
              places={availablePlaces} 
              onPlaceSelect={handlePlaceSelect} 
            />

            <AbandonModal 
              show={showAbandonModal} 
              onClose={() => setShowAbandonModal(false)} 
              onConfirm={() => {
                setShowAbandonModal(false);
                handlePlaceSelect(9999); 
              }} 
            />

          </div>
          
        </div>
      </Container>
    );
  }

  // --- Fine Partita ---
  if (gamePhase === 'END') {
    return (
      <GameEnd 
        gameData={gameData} 
        onRestart={() => setGamePhase('SETUP')} 
      />
    );
  }

  return null;
}

export default Game;