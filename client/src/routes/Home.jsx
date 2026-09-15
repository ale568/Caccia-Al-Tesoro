import { Container, Row, Col, Carousel } from 'react-bootstrap';

import './Home.css'

function Home() {
  return (
    <Container className="text-center position-relative mt-4">
      
      <div className="position-absolute top-0 d-none d-md-block compass-background">
        <img src="/compass.png" alt="Bussola" className="img-fluid" />
      </div>

      <Row className="justify-content-center pt-3">
        <Col md={12}>
          <h1 className="page-title">
            CACCIA AL TESORO
          </h1>
          <h4 className="page-subtitle mt-5 mb-5">
            Enigmi da scoprire durante una<br />passeggiata insolita.
          </h4>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={12}>
          <img 
            src="/full-map.png" 
            alt="Anteprima del Gioco" 
            className="img-fluid rounded shadow-sm" 
          />
        </Col>
      </Row>

      <Row className="justify-content-center text-start mb-5">
        <Col md={12} className="fs-5" style={{ color: 'var(--nav-bg)' }}>
          <p>
            <strong>Benvenuto/a in questa Caccia al Tesoro! Esegui il Login per iniziare la tua avventura.</strong>
          </p>
          <p>Ecco cosa devi sapere prima di iniziare:</p>
          <p>
            Al giocatore viene assegnata una mappa con dei luoghi e un indizio di partenza, che varia a ogni partita. 
            L'indizio porta a uno dei luoghi della mappa che, a sua volta, presenterà un altro indizio per raggiungere 
            il luogo successivo, e così via. Lo scopo del gioco è raggiungere il luogo del tesoro risolvendo i vari indizi 
            e, di conseguenza, raggiungere i vari luoghi, prima che il tempo a disposizione scada. I luoghi che fanno parte 
            del percorso sono un sottoinsieme di quelli presenti nella mappa.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={12}>
          <img src="/home-1.png" alt="Istruzioni Mappa" className="img-fluid rounded shadow-sm" />
        </Col>
      </Row>

      <Row className="justify-content-center text-start mb-5">
        <Col md={12} className="fs-5" style={{ color: 'var(--nav-bg)' }}>
          <p>
            All'inizio della partita, vedrai un conto alla rovescia per completare l'intera partita, 
            la mappa senza alcun luogo visibile e il primo indizio per raggiungere il primo luogo.
          </p>
          <p>
            Ogni partita ha un livello di difficoltà che può essere “Facile”, “Intermedio” o “Difficile”. 
            Il livello di difficoltà influenza la quantità di luoghi disponibili, la lunghezza del percorso e della partita. 
            Scegliendo il livello <strong>facile</strong>, avrai 6 luoghi totali, un percorso lungo 3 luoghi e un tempo di gioco di 60 secondi. 
            Al livello <strong>intermedio</strong> avrai 8 luoghi totali, un percorso da 4 luoghi e 90 secondi di tempo. 
            Mentre all'<strong>ultimo livello</strong> avrai 10 luoghi totali, un percorso di 5 luoghi e 120 secondi di tempo.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={12}>
          <img src="/home-2.png" alt="Difficoltà di gioco" className="img-fluid rounded shadow-sm" />
        </Col>
      </Row>

      <Row className="justify-content-center text-start mb-4">
        <Col md={12} className="fs-5" style={{ color: 'var(--nav-bg)' }}>
          <p className="fw-bold">Durante il gioco, possono verificarsi tre casi:</p>
          <ol>
            <li className="mb-2">
              <strong>Il luogo scelto in risposta all'indizio è corretto:</strong> la partita prosegue al luogo e indizio successivo 
              (o al tesoro, nel caso sia alla fine del percorso di gioco) e la mappa viene aggiornata mostrando il luogo scelto, con 
              posizione e nome, nonché il percorso per raggiungerlo.
            </li>
            <li className="mb-2">
              <strong>Il luogo scelto in risposta all'indizio è errato:</strong> la partita termina ed è persa.
            </li>
            <li>
              <strong>Il tempo a disposizione scade:</strong> la partita termina ed è persa.
            </li>
          </ol>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={12}>
          <Carousel className="shadow-sm rounded overflow-hidden" data-bs-theme="dark">
            <Carousel.Item>
              <img className="d-block w-100" src="/home-3.png" alt="Caso 1: Risposta corretta" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="/home-4.png" alt="Caso 2: Risposta errata" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="/home-5.png" alt="Caso 3: Timer di Gioco" />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      <Row className="justify-content-center text-start mb-5">
        <Col md={12} className="fs-5" style={{ color: 'var(--nav-bg)' }}>
          <p>
            Al termine della partita, il giocatore che trova il tesoro riceverà le monete presenti nel tesoro stesso. 
            Se, invece, seleziona una risposta errata di un indizio o il tempo a disposizione scade, riceverà zero monete 
            e verrà mostrato, sulla mappa, l'intero percorso con riportati i nomi dei luoghi per arrivare al tesoro.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={12}>
          <img src="/home-6.png" alt="Fine Partita" className="img-fluid rounded shadow-sm" />
        </Col>
      </Row>

      <Row className="justify-content-center text-start mb-5">
        <Col md={12} className="fs-5" style={{ color: 'var(--nav-bg)' }}>
          <p>
            Solo gli utenti registrati possono giocare tutte le partite che vogliono. 
            Inoltre, la quantità di monete totali viene visualizzata in una classifica generale, disponibile in una 
            pagina dedicata dell'applicazione.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={12}>
          <img src="/home-7.png" alt="Classifica Globale" className="img-fluid rounded shadow-sm" />
        </Col>
      </Row>

      <Row className="justify-content-center text-center mb-5 pb-5">
        <Col md={12}>
          <h2 className="fw-bold" style={{ color: 'var(--nav-bg)' }}>
            Accedi subito e scala la classifica generale!
          </h2>
        </Col>
      </Row>

    </Container>
  );
}

export default Home;