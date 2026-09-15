import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

import './GameSetup.css'

function GameSetup({ onStart, loading, error }) {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="page-title mb-3">NUOVA CACCIA AL TESORO</h1>
          <p className="fs-5 text-muted mb-5">
            Scegli il livello di difficoltà per iniziare la tua avventura.
            Il tempo e il percorso cambieranno in base alla tua scelta!
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Difficoltà */}
          <Row className="justify-content-center gap-4">
            {['Facile', 'Intermedio', 'Difficile'].map((level) => (
              <Col md={3} key={level} className="p-0">
                <Card 
                  className="difficulty-card shadow-sm h-100"
                  onClick={() => !loading && onStart(level)}
                >
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
                    <h4 className="fw-bold mb-0">{level}</h4>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {loading && (
            <div className="mt-5 text-center">
              <Spinner animation="border" style={{ color: 'var(--accent-color)' }} />
              <h5 className="mt-3" style={{ color: 'var(--nav-bg)' }}>Preparazione mappa in corso...</h5>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default GameSetup;