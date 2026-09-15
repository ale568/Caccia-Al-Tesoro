const BASE_URL = 'http://localhost:3001/api';

// Risposte e errori JSON in modo centralizzato
async function handleResponse(response) {
  if (response.ok) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } else {
    const errBody = await response.json();
    throw new Error(errBody.error || 'Errore di rete generico');
  }
}


// Autenticazione
export async function login(username, password) {           // 1. Login
  const response = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getUser() {   // 2. Verifica sessione corrente
  const response = await fetch(`${BASE_URL}/sessions/current`, {
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function logout() {    // 3. Logout
  const response = await fetch(`${BASE_URL}/sessions/current`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
}


// Gestione gioco
export async function createGame(difficulty) {  // 4. Creazione partita
  const response = await fetch(`${BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ difficulty }),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function sendAnswer(gameId, placeId) {     // 5. Avanzamento gioco
  const response = await fetch(`${BASE_URL}/games/${gameId}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placeId }),
    credentials: 'include',
  });
  return handleResponse(response);
}


// Classifica
export async function getLeaderboard() {    // 6. Recupera classifica
  const response = await fetch(`${BASE_URL}/leaderboard`, {
    credentials: 'include',
  });
  return handleResponse(response);
}