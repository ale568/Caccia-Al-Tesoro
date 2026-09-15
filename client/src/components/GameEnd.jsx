import { Container, Button } from 'react-bootstrap';

function GameEnd({ gameData, onRestart }) {
  const isWin = gameData.status === 'Vinta';
  const placesToShow = gameData.visitedPlaces || [];

  return (
    <Container fluid className="mt-4 px-lg-5 mb-4">
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 px-2">
        
        
        <div className={`text-center text-md-start mb-3 mb-md-0 ${isWin ? 'text-success' : 'text-danger'}`}>
          <h3 className="fw-bold mb-1">
            {isWin ? 'HAI TROVATO IL TESORO!' : 'PARTITA TERMINATA'}
          </h3>
          <p className="mb-0 fs-5">
            {isWin 
              ? `Complimenti! Hai vinto ${gameData.coinsWon} monete.` 
              : 'Ecco il percorso corretto che avresti dovuto seguire:'}
          </p>
        </div>

        <Button 
          variant={isWin ? 'success' : 'danger'} 
          className="fw-bold px-4 py-2 shadow-sm"
          onClick={onRestart}
        >
          Gioca di nuovo
        </Button>
        
      </div>

      <div className="game-layout" style={{ height: '77vh' }}> 
        <div className="map-card-wrapper">
          {placesToShow.map((place, index) => (
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
        </div>
      </div>
      
    </Container>
  );
}

export default GameEnd;