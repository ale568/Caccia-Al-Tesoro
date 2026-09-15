import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button, FloatingLabel } from 'react-bootstrap';
import AuthContext from '../contexts/AuthContext';

import './LoginForm.css'

function LoginForm() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');

  // Gestione Toast
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      
      return () => clearTimeout(timer); 
    }
  }, [errorMessage]);

  
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext); 

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevengo ricaricamento della pagina
    setErrorMessage('');

    
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Inserisci sia lo username che la password.');
      return;
    }

    const result = await handleLogin(username, password);

    if (result.success) {
      navigate('/', { replace: true }); 
    } else {
      setErrorMessage(result.error || 'Username o password errati.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          
          <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold" style={{ color: 'var(--nav-bg)' }}>
                Bentornato/a!
              </h2>

              {errorMessage && (
                <div className="toast-wrapper">
                  <div className="custom-toast error"> 
                    <div className="toast-content">
                      <p>Errore di Accesso</p>
                      <p>{errorMessage}</p>
                    </div>
                    <button className="close-btn" onClick={() => setErrorMessage('')}>
                      &times; 
                    </button>
                  </div>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                
                <FloatingLabel
                  controlId="floatingUsername"
                  label="Username"
                  className="mb-3"
                  style={{ color: 'var(--nav-bg)' }}
                >
                  <Form.Control 
                    type="text" 
                    placeholder="Username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                  />
                </FloatingLabel>

                <FloatingLabel 
                  controlId="floatingPassword" 
                  label="Password" 
                  className="mb-2"
                  style={{ color: 'var(--nav-bg)' }}
                >
                  <Form.Control 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FloatingLabel>

                <Form.Check 
                  type="checkbox"
                  id="show-password-checkbox"
                  label="Mostra password"
                  className="mb-4"
                  style={{ color: 'var(--nav-bg)', fontSize: '0.9rem' }}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />

                <div className="d-grid mt-4">
                  <Button type="submit" className="rounded-pill btn-login w-100">
                    ACCEDI AL GIOCO
                  </Button>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;