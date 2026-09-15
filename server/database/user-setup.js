import crypto from 'crypto';
import db from './db.js';

// Genera salt e hash con scrypt
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    // Genera 16 byte casuali per il salt
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Calcola l'hash a 32 byte con scrypt
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve({
        salt: salt,
        hash: derivedKey.toString('hex')
      });
    });
  });
}

async function insertUsers() {
  const users = [
    { username: 'Mario', password: 'webapp' },
    { username: 'Beatrice', password: 'webapp' },
    { username: 'Sofia', password: 'webapp' }
  ];

  for (const user of users) {
    try {
      const { salt, hash } = await hashPassword(user.password);
      
      await new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)`;
        db.run(sql, [user.username, hash, salt], function (err) {
          if (err) {
            // Gestione del caso in cui l'utente esista già
            if (err.message.includes('UNIQUE constraint failed')) {
              console.log(`Utente "${user.username}" già presente nel DB.`);
              resolve();
            } else {
              reject(err);
            }
          } else {
            console.log(`Utente "${user.username}" inserito con successo (ID: ${this.lastID}).`);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`Errore durante l'inserimento di ${user.username}:`, error.message);
    }
  }

  db.close((err) => {
    if (err) {
      console.error('Errore durante la chiusura del database:', err.message);
    } else {
      console.log('Setup utenti completato con successo.');
    }
  });
}

insertUsers();