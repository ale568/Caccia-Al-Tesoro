import { Outlet, Link,} from 'react-router';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

import './Layout.css'

function Layout() {
  
  const { user, handleLogout } = useContext(AuthContext);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <Navbar style={{ backgroundColor: 'var(--nav-bg)', overflow: 'hidden', height: '55px' }} variant="dark" className="shadow-sm">
        <Container fluid className="d-flex align-items-center px-5">
          
          {/* Sezione sinistra */}
          <div className="d-flex align-items-center" style={{ flex: 1 }}>
            
            <Navbar.Brand className="d-flex align-items-center">
              <img src="/logo.png" height="40" className="me-2" />
            </Navbar.Brand>
            
            {user.id && (
              <div className="d-flex align-items-center ms-4">
                {!isPlaying && (
                  <>
                    <Button as={Link} to="/leaderboard" className="nav-text-btn ms-3">
                      CLASSIFICA
                    </Button>
                    <Button as={Link} to="/game" className="nav-text-btn ms-5">
                      GIOCA
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sezione centrale */}
          <div className="d-flex justify-content-center text-center" style={{ flex: 1 }}>
            {isPlaying ? (
              <span style={{ color: 'var(--nav-text)', letterSpacing: '2px', cursor: 'default' }} className="fs-4 mx-0 navbar-brand">
                ToFind
              </span>
            ) : (
              <Navbar.Brand as={Link} to="/" style={{ color: 'var(--nav-text)', letterSpacing: '2px' }} className="fs-4 mx-0">
                ToFind
              </Navbar.Brand>
            )}
          </div>

          {/* Sezione destra */}
          <div className="d-flex justify-content-end" style={{ flex: 1 }}>
            {!user.id ? (
              
              <Button as={Link} to="/login" className="rounded-pill btn-aura">
                LOGIN
              </Button>
            
          ) : (
              <div className="d-flex align-items-center">
                <span className="nav-welcome-text">
                  Ciao, {user.username}!
                </span>
                
                <Button onClick={() => setShowLogoutModal(true)} className="rounded-pill btn-aura">
                  LOGOUT
                </Button>
              
              </div>
            )}
          </div>

        </Container>
      </Navbar>


      <main>
        <Outlet context={{ setIsPlaying }}/>
      </main>

      {showLogoutModal && (
        <div className="places-overlay" style={{ zIndex: 1050 }}>
          <div className="places-modal text-center p-4" style={{ maxWidth: '450px' }}>
            
            <h3 className="fw-bold mb-3" style={{ color: 'var(--nav-bg)' }}>
              Conferma Uscita
            </h3>
            
            <p className="fs-5 mb-4">
              Sei sicuro di voler uscire? Se hai una partita in corso, questa andrà <strong className="text-danger">persa</strong>.
            </p>
            
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="outline-secondary" 
                className="fw-bold px-4 py-2"
                onClick={() => setShowLogoutModal(false)}
              >
                Annulla
              </Button>
              
              <Button 
                className="place-grid-btn fw-bold px-4 py-2"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                Sì, esci
              </Button>
            </div>
            
          </div>
        </div>
      )}

    </>
  );
}

export default Layout;