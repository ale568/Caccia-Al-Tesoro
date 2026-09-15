import { Button } from 'react-bootstrap';

function AbandonModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="places-overlay" style={{ zIndex: 1050 }}>
      <div className="places-modal text-center p-4" style={{ maxWidth: '450px' }}>
        
        <h3 className="fw-bold mb-3" style={{ color: 'var(--nav-bg)' }}>
          Vuoi abbandonare?
        </h3>
        
        <p className="fs-5 mb-4">
          La tua partita andrà <strong className="text-danger">persa</strong>.
        </p>
        
        <div className="d-flex justify-content-center gap-3">
          <Button 
            variant="outline-secondary" 
            className="fw-bold px-4 py-2"
            onClick={onClose}
          >
            Annulla
          </Button>
          
          <Button 
            className="place-grid-btn fw-bold px-4 py-2"
            onClick={onConfirm}
          >
            Esci
          </Button>
        </div>
        
      </div>
    </div>
  );
}

export default AbandonModal;