import { Button } from 'react-bootstrap';

import './PlacesModal.css'

function PlacesModal({ show, onClose, places, onPlaceSelect }) {
  if (!show) return null;

  return (
    <div className="places-overlay">
      <div className="places-modal">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
          <h4 className="fw-bold mb-0 text-nav-color">Seleziona il luogo</h4>
          <Button variant="close" onClick={onClose} />
        </div>
        
        <div className="places-grid mt-3">
          {places.map((place) => (
            <Button 
              key={place.id} 
              className="place-grid-btn fw-bold py-2"
              onClick={() => onPlaceSelect(place.id)}
            >
              {place.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlacesModal;