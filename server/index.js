import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import { body, param, validationResult } from 'express-validator';
import { getUser, getUserById } from './dao/user-dao.js';
import * as gameDao from './dao/game-dao.js'; 
import { setupNewGame } from './utils/game-logic.js';
import { GAME_DIFFICULTIES } from './utils/game-config.js';

// init express
const app = express();
const port = 3001;

// Middleware base
app.use(morgan('dev'));
app.use(express.json()); 

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const user = await getUser(username, password);
    if (!user) {
      return cb(null, false, { message: 'Username o password errati.' });
    }
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb) => {    
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await getUserById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// Middleware di sessione
app.use(session({
  secret: 'webapp_2026', 
  resave: false,
  saveUninitialized: false, 
}));
app.use(passport.authenticate('session'));

// Middleware di autorizzazione
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Non sei autenticato. Effettua il login.' });
};

// 1. Login
app.post('/api/sessions', function(req, res, next) {      
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      
      return res.status(401).json({ error: info.message });
    }
    
    req.login(user, (err) => {
      if (err) return next(err);
      
      return res.json(req.user);
    });
  })(req, res, next);
});

// 2. Verifica sessione corrente
app.get('/api/sessions/current', (req, res) => {  
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: 'Utente non autenticato' });
  }
});

// 3. Logout
app.delete('/api/sessions/current', async (req, res) => {   
  if (req.user) {
    try {
    
      await gameDao.failActiveGamesForUser(req.user.id);
      
      req.logout(() => {
        res.status(200).json({ message: 'Logout effettuato con successo' });
      });
    } catch (err) {
      
      res.status(500).json({ error: 'Errore durante il logout' });
    }
  } else {
    res.status(401).json({ error: 'Non autenticato' });
  }
});

 // 4. Avvia una nuova partita
app.post('/api/games', isLoggedIn, [   
  body('difficulty').isIn(['Facile', 'Intermedio', 'Difficile']).withMessage('Difficoltà non valida')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  try {
    const difficulty = req.body.difficulty;
    
    const gameData = await setupNewGame(difficulty);
    
    const gameId = await gameDao.createGame(req.user.id, difficulty, gameData.treasureValue, gameData.pathSteps);
    
    res.status(201).json({    // Invio al client solo i dati sicuri
      id: gameId,
      timeLimitSeconds: gameData.config.timeLimitSeconds,
      places: gameData.chosenPlaces,
      firstClue: gameData.pathSteps[0].clueText
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la creazione della partita' });
  }
});

// 5. Recupera lo stato di una singola partita
app.get('/api/games/:id', isLoggedIn, [   
  param('id').isInt({ min: 1 }).withMessage('ID partita non valido')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: errors.array()[0].msg });

  try {
    const gameId = parseInt(req.params.id, 10);
    const game = await gameDao.getGameById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Partita non trovata' });
    }
  
    if (game.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Non autorizzato a visualizzare questa partita' });
    }

    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: 'Errore interno del server' });
  }
});


// 6. Avanzamento del gioco e timer
app.post('/api/games/:id/answers', isLoggedIn, [  
  param('id').isInt({ min: 1 }),
  body('placeId').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: 'Dati non validi' });

  try {
    const gameId = parseInt(req.params.id, 10);
    const placeId = parseInt(req.body.placeId, 10);

    const game = await gameDao.getGameById(gameId);
    if (!game || game.user_id !== req.user.id || game.status !== 'In_Corso') {
      return res.status(403).json({ error: 'Partita non valida o già terminata' });
    }

    // Controllo Timer
    const config = GAME_DIFFICULTIES[game.difficulty];
    const startTime = new Date(game.start_time).getTime();
    const timeElapsedSeconds = (Date.now() - startTime) / 1000;

    if (timeElapsedSeconds > config.timeLimitSeconds) {
      await gameDao.closeGame(gameId, 'Persa', 0);
      const fullPath = await gameDao.getFullGamePath(gameId);
      return res.status(200).json({ outcome: 'TIME_OUT', coins: 0, fullPath });
    }

    // Controllo Risposta
    const expectedPlace = await gameDao.getExpectedPlace(gameId, game.current_step);
    
    if (placeId !== expectedPlace.place_id) {
      await gameDao.closeGame(gameId, 'Persa', 0);
      const fullPath = await gameDao.getFullGamePath(gameId);
      return res.status(200).json({ outcome: 'WRONG_ANSWER', coins: 0, fullPath });
    }

    if (game.current_step === config.pathLength) {  // Ultima tappa
      await gameDao.closeGame(gameId, 'Vinta', game.treasure_value);
      return res.status(200).json({ outcome: 'WIN', coins: game.treasure_value });
    } else {  // Tappa intermedia
      const nextStep = game.current_step + 1;
      await gameDao.updateGameStep(gameId, nextStep);
      
      const nextClue = await gameDao.getClueForStep(gameId, nextStep);
      
      return res.status(200).json({ outcome: 'CORRECT', nextStep: nextStep, nextClue: nextClue.clue_text});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la validazione' });
  }
});

 // 7. Recupera la classifica generale degli utenti
app.get('/api/leaderboard', isLoggedIn, async (req, res) => {
  try {
    const leaderboard = await gameDao.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero della classifica' });
  }
});

// Avvio server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});