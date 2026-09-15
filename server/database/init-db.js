import db from './db.js';

db.serialize(() => {
  
  db.run(`PRAGMA foreign_keys = ON;`);
  
  // Tabella Utenti 
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      hash TEXT NOT NULL,
      salt TEXT NOT NULL
  );`);

  // Tabella Luoghi
  db.run(`CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL
  );`);

  // Tabella Indizi
  db.run(`CREATE TABLE IF NOT EXISTS clues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER NOT NULL,
      clue_text TEXT NOT NULL,
      FOREIGN KEY(place_id) REFERENCES places(id) ON DELETE CASCADE
  );`);

  // Tabella Partite
  db.run(`CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Facile', 'Intermedio', 'Difficile')),
      treasure_value INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('In_Corso', 'Vinta', 'Persa')),
      current_step INTEGER DEFAULT 1,
      start_time INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
  );`);

  // Tabella Tappe del Percorso
  db.run(`CREATE TABLE IF NOT EXISTS game_path (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      place_id INTEGER NOT NULL,
      clue_id INTEGER,
      step_order INTEGER NOT NULL,
      FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE,
      FOREIGN KEY(place_id) REFERENCES places(id),
      FOREIGN KEY(clue_id) REFERENCES clues(id)
  );`);

  console.log('Tabelle del database create con successo.');
});

db.close((err) => {
  if (err) {
    console.error('Errore durante la chiusura del database:', err.message);
  } else {
    console.log('Inizializzazione del database completata.');
  }
});