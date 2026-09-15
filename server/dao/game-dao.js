import db from '../database/db.js';


// Crea una nuova partita e le relative tappe nel percorso
export const createGame = (userId, difficulty, treasureValue, pathSteps) => {
  return new Promise((resolve, reject) => {
    
    const startTime = Date.now(); // Timestamp corrente in millisecondi (Unix Epoch)

    const insertGameSql = `
      INSERT INTO games (user_id, difficulty, treasure_value, status, current_step, start_time) 
      VALUES (?, ?, ?, 'In_Corso', 1, ?)
    `;

    db.run(insertGameSql, [userId, difficulty, treasureValue, startTime], function (err) {
      if (err) return reject(err);
      
      const gameId = this.lastID;
      const insertStepSql = `
        INSERT INTO game_path (game_id, place_id, clue_id, step_order) 
        VALUES (?, ?, ?, ?)
      `;

      let completed = 0;
      let hasError = false;

      for (const step of pathSteps) {
        db.run(insertStepSql, [gameId, step.placeId, step.clueId, step.stepOrder], (stepErr) => {
          if (stepErr && !hasError) {
            hasError = true;
            return reject(stepErr);
          }
          completed++;
          if (completed === pathSteps.length && !hasError) {
            resolve(gameId);
          }
        });
      }
    });
  });
};


// Recupera lo stato attuale di una partita
export const getGameById = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id = ?';
    db.get(sql, [gameId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};


// Recupera l'ID del luogo atteso per una specifica tappa della partita
export const getExpectedPlace = (gameId, stepOrder) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT place_id FROM game_path WHERE game_id = ? AND step_order = ?';
    db.get(sql, [gameId, stepOrder], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};


// Avanza la partita alla tappa successiva
export const updateGameStep = (gameId, nextStep) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET current_step = ? WHERE id = ?';
    db.run(sql, [nextStep, gameId], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};


// Chiude la partita impostando lo status finale e le monete ottenute
export const closeGame = (gameId, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET status = ? WHERE id = ?';
    db.run(sql, [status, gameId], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};


// Recupera l'intero percorso
export const getFullGamePath = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.id, p.name, p.x, p.y, gp.step_order 
      FROM game_path gp 
      JOIN places p ON gp.place_id = p.id 
      WHERE gp.game_id = ? 
      ORDER BY gp.step_order ASC
    `;
    db.all(sql, [gameId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};


// Calcola la classifica
export const getLeaderboard = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.id, u.username, COALESCE(SUM(g.treasure_value), 0) AS total_coins 
      FROM users u
      LEFT JOIN games g ON u.id = g.user_id AND g.status = 'Vinta'
      GROUP BY u.id, u.username
      ORDER BY total_coins DESC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};


// Recupera il testo dell'indizio per una specifica tappa della partita
export const getClueForStep = (gameId, stepOrder) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.clue_text 
      FROM game_path gp
      JOIN clues c ON gp.clue_id = c.id
      WHERE gp.game_id = ? AND gp.step_order = ?
    `;
    db.get(sql, [gameId, stepOrder], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};


// Abbandono a partita in corso
export const failActiveGamesForUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE games SET status = 'Persa' WHERE user_id = ? AND status = 'In_Corso'`;
    
    db.run(sql, [userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};