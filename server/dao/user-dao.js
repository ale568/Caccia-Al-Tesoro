import db from '../database/db.js';
import crypto from 'crypto';


// Verifica le credenziali
export const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(false); // Utente non trovato
      } else {
        const user = { id: row.id, username: row.username };

        crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {
          if (err) reject(err);

          const passwordBuffer = Buffer.from(row.hash, 'hex');
          if (!crypto.timingSafeEqual(passwordBuffer, hashedPassword)) {
            resolve(false);
          } else {
            resolve(user);  // id e username
          }
        });
      }
    });
  });
};


// Recupera l'utente per ID
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, username FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve({ error: 'Utente non trovato.' });
      } else {
        resolve(row);
      }
    });
  });
};