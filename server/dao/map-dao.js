import db from '../database/db.js';


// Restituisce tutti i luoghi disponibili sulla mappa
export const getAllPlaces = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, name, x, y FROM places';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};


// Restituisce tutti gli indizi associati a un singolo luogo
export const getCluesByPlaceId = (placeId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, clue_text FROM clues WHERE place_id = ?';
    db.all(sql, [placeId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};