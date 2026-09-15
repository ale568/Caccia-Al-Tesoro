import { GAME_DIFFICULTIES } from './game-config.js';
import * as mapDao from '../dao/map-dao.js';


export const generateTreasureValue = () => {
  const MIN = 10;
  const MAX = 100;
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
};


export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


export const setupNewGame = async (difficulty) => {

  const config = GAME_DIFFICULTIES[difficulty];
  if (!config) {
    throw new Error(`Difficoltà non valida: ${difficulty}`);
  }

  // Recupera tutti i luoghi disponibili
  const allPlaces = await mapDao.getAllPlaces();
  if (allPlaces.length < config.totalPlaces) {
    throw new Error('Numero insufficiente di luoghi registrati nel database.');
  }

  const shuffledPlaces = shuffleArray(allPlaces);
  const chosenPlaces = shuffledPlaces.slice(0, config.totalPlaces);

  const pathPlaces = chosenPlaces.slice(0, config.pathLength);

  // Estrazione indizi per ogni tappa
  const pathSteps = [];
  for (let i = 0; i < pathPlaces.length; i++) {
    const place = pathPlaces[i];
    const clues = await mapDao.getCluesByPlaceId(place.id);
    
    if (!clues || clues.length === 0) {
      throw new Error(`Nessun indizio trovato per il luogo ID ${place.id}`);
    }

    const randomClue = clues[Math.floor(Math.random() * clues.length)];

    pathSteps.push({
      placeId: place.id,
      clueId: randomClue.id,
      clueText: randomClue.clue_text,
      stepOrder: i + 1
    });
  }

  const treasureValue = generateTreasureValue();
  
  return {
    config,
    treasureValue,
    chosenPlaces,
    pathSteps
  };

  
};