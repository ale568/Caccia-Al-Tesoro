import db from './db.js';

const placesData = [
  {
    name: 'Mole Antonelliana',
    x: 83.0,
    y: 35.0,
    clues: [
      'Simbolo della città, alta e svettante con la sua iconica guglia metallica.',
      'Ospita al suo interno il Museo Nazionale del Cinema con un ascensore panoramico.',
      "Progettata inizialmente come sinagoga dall'architetto Alessandro Antonelli."
    ]
  },
  {
    name: 'Piazza Castello',
    x: 69.0,
    y: 22.0,
    clues: [
      'Il cuore storico della città dove convergono le quattro vie principali.',
      'Piazza monumentale circondata da portici e storici palazzi sabaudi.',
      'Ospita al suo centro il Palazzo Madama e le fontane a raso terra.'
    ]
  },
  {
    name: 'Teatro Regio di Torino',
    x: 75.0,
    y: 26.0,
    clues: [
      "Storico e prestigioso teatro d'opera della città, affacciato sul lato est di Piazza Castello.",
      'Distrutto da un devastante incendio nel 1936, fu ricostruito con la celebre sala disegnata da Carlo Mollino.',
      'Il tempio della lirica e del balletto sabaudo, caratterizzato dai suoi iconici cancelli con motivi geometrici in bronzo.'
    ]
  },
  {
    name: 'Palazzo Reale',
    x: 73.0,
    y: 15.0,
    clues: [
      'La sontuosa dimora storica dei duchi e dei re di Casa Savoia.',
      "Ospita l'Armeria Reale e si affaccia direttamente sui Giardini Reali.",
      'La sua facciata bianca seicentesca domina la piazzetta adiacente a Piazza Castello.'
    ]
  },
  {
    name: 'Museo Egizio',
    x: 71.0,
    y: 41.0,
    clues: [
      'Il più antico museo al mondo interamente dedicato alla civiltà nilotica.',
      'Tra sarcofagi, papiri e statue di faraoni in via Accademia delle Scienze.',
      'Fondato nel 1824 con la collezione Drovetti acquistata da Carlo Felice.'
    ]
  },
  {
    name: 'Piazza San Carlo',
    x: 65.0,
    y: 45.0,
    clues: [
      "Il 'salotto di Torino', celebre per le sue due chiese gemelle seicentesche.",
      "Piazza barocca dominata dalla statua equestre del 'Caval ëd Brôns'.",
      'Famosa per i suoi caffè storici come il Caffè San Carlo e il Caffè Torino.'
    ]
  },
  {
    name: 'Parco del Valentino',
    x: 75.0,
    y: 96.0,
    clues: [
      'Il più famoso parco cittadino adagiato lungo la riva del fiume Po.',
      'Ospita un suggestivo Borgo Medievale e la monumentale Fontana dei Mesi.'
    ]
  },
  {
    name: 'Politecnico di Torino',
    x: 32.0,
    y: 77.0,
    clues: [
      'Storico ateneo ingegneristico e architettonico situato in Corso Duca degli Abruzzi.',
      'Polo di eccellenza tecnologica della città.',
      'La sua sede principale occupa un vasto isolato nel quartiere Crocetta.'
    ]
  },
  {
    name: 'Gran Madre di Dio',
    x: 94.0,
    y: 76.0,
    clues: [
      'Chiesa neoclassica che richiama il Pantheon di Roma, situata ai piedi della collina.',
      'Sorge al termine del Ponte Vittorio Emanuele I, custode di leggende sul Sacro Graal.'
    ]
  },
  {
    name: 'Stazione Porta Susa',
    x: 36.0,
    y: 25.0,
    clues: [
      'Moderna stazione ferroviaria sotterranea caratterizzata da una lunga galleria di vetro e acciaio.',
      "Snodo dell'alta velocità affacciato su Corso Bolzano e Piazza XVIII Dicembre."
    ]
  },
  {
    name: 'Duomo di Torino',
    x: 70.0,
    y: 10.0,
    clues: [
      'Rinascimentale cattedrale metropolitana dedicata a San Giovanni Battista.',
      'Custodisce la celebre Cappella della Sacra Sindone progettata da Guarino Guarini.',
      "Edificio in marmo bianco affiancato dal campanile di Sant'Andrea."
    ]
  },
  {
    name: 'Stazione Porta Nuova',
    x: 58.0,
    y: 75.0,
    clues: [
      'La principale stazione ferroviaria di testa nel centro storico.',
      'Famosa per la sua imponente volta vetrata ottocentesca affacciata su piazza Carlo Felice.'
    ]
  }
];

// Helper per eseguire query di inserimento
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

async function seedPlacesAndClues() {
  try {
  
    await runQuery('PRAGMA foreign_keys = ON;');
    await runQuery('DELETE FROM clues;');
    await runQuery('DELETE FROM places;');

    for (const place of placesData) {
      const placeId = await runQuery(
        'INSERT INTO places (name, x, y) VALUES (?, ?, ?)',
        [place.name, place.x, place.y]
      );

      for (const clueText of place.clues) {
        await runQuery(
          'INSERT INTO clues (place_id, clue_text) VALUES (?, ?)',
          [placeId, clueText]
        );
      }
    }

    console.log('Tutti i luoghi e i relativi indizi sono stati inseriti correttamente.');
  } catch (error) {
    console.error("Errore durante l'inserimento:", error.message);
  } finally {
    db.close((err) => {
      if (err) console.error('Errore durante la chiusura del database:', err.message);
      else console.log('Database chiuso correttamente.');
    });
  }
}

seedPlacesAndClues();