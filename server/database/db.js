import sqlite3 from 'sqlite3';

// Apre la connessione al database
const db = new sqlite3.Database('./database/database.db', (err) => {
  if (err) {
    console.error("Errore di connessione al database:", err.message);
    throw err;
  }
  console.log("Connesso al database SQLite.");
});

export default db;