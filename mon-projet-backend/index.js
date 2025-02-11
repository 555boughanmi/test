const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const xlsx = require('xlsx');
const multer = require('multer');
const path = require('path');
const connection = require('./config');
const route = require('./routes/autroute');
const { log } = require('console');

app.use(bodyParser.json());

// Configuration CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Autorise l'origine du frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Autorise les méthodes HTTP
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Autorise les en-têtes HTTP
  next();
});

app.use('/', route);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Utilisez path.join pour obtenir le chemin absolu
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route pour télécharger le fichier Excel
app.post('/upload', upload.single('excelFile'), (req, res) => {
  // Lire le fichier Excel
  const workbook = xlsx.readFile(req.file.path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Récupérer le nom d'utilisateur à partir du corps de la requête
  const username = req.body.username;

  // SQL pour l'insertion des données
  const sql = 'INSERT INTO votre_table (RefDemande, Etat, DateDepot, DateValidation, DateConfirmation, DateMES, DateEtat, TypeClient, TypeOffre, MoisDepot, PwC1, PwC2, Annee, userId ) VALUES ?';

  const values = data.slice(1).map(row => [...row, username]); // Ajouter username à chaque ligne de données


  // Exécuter la requête SQL
  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données dans MySQL :', err.message);
      return res.status(500).send('Erreur lors de l\'insertion des données dans MySQL : ' + err.message);
    }
    console.log('Données insérées dans MySQL :', result);
    res.status(200).send('Fichier téléchargé et données insérées dans MySQL');
  });
});
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads2')); // Utilisez path.join pour obtenir le chemin absolu
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload2 = multer({ storage: storage2 });

app.post('/upload2', upload2.single('excelFile'), (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const username = req.body.username;
    const sql = `INSERT INTO votre_table2 (
      id_contrat, date_ouverture, date_cloture, type_offre, type_client, etat_ticket, 
      sujet, type_incident, indisponibilite, derangement, facturation, 
      internet_fixe, id_client, MOIS, Annee, userId	
    ) VALUES ?`;

    const values = data.slice(1).map(row => [...row.slice(0, 14), username]);

    const sqlKpi = `INSERT INTO crm (
      idfsi, Mois, Technologie, KPI3_11_Pro, KPI3_11_Res, KPI2_1_Pro, 
      KPI2_1_Res, KPI2_2_Pro, KPI2_2_Res, KPI2_3_Pro, KPI2_3_Res, KPI2_4_Pro, 
      KPI2_4_Res, KPI2_5_Pro, KPI2_5_Res, KPI2_6_Pro, KPI2_6_Res
    ) VALUES ?`;

    const rowsInternetFixe = data.slice(1).filter(row => row[11] === 'True');
    const countRowsInternetFixe = rowsInternetFixe.length;

    console.log('Le nombre de lignes filtrées :', countRowsInternetFixe);
    const mois = data[1][13]; 
    console.log('mois :', mois);

    const calculateDuration = (row) => {
      const dateCloture = new Date(row[2]);
      const dateOuverture = new Date(row[1]);
      return (dateCloture - dateOuverture); // durée en heures
    };

    const filterAndSum = (typeOffre, typeClient) => {
      const filteredRows = rowsInternetFixe.filter(row => row[3] === typeOffre && row[4] === typeClient);
      return filteredRows.reduce((acc, row) => {
        const duration = calculateDuration(row);
        return duration < (1 / 24) ? acc + duration : acc;
      }, 0);
    };

    const rows2_2kpi = data.slice(1).filter(row => row[11] === 'True' && row[5] === 'Clôturé' && row[7] === 'T');
    const countRows2_2kpi = rows2_2kpi.length;
    console.log('Le nombre de lignes filtrées countRows2_2kpi :', countRows2_2kpi);

    const filterKpi = (typeTechologie, typeOffre, minDuration, maxDuration) => {
      return rows2_2kpi
        .filter(row => row[3] === typeTechologie && row[4] === typeOffre)
        .reduce((acc, row) => {
          const duration = calculateDuration(row);
          return duration >= minDuration && duration < maxDuration ? acc + duration : acc;
        }, 0);
    };

    const filterKpi5 = (typeTechologie, typeOffre, minDuration) => {
      return rows2_2kpi
        .filter(row => row[3] === typeTechologie && row[4] === typeOffre)
        .reduce((acc, row) => {
          const duration = calculateDuration(row);
          return duration >= minDuration ? acc + duration : acc;
        }, 0);
    };

    const filterKpi2_6 = (typeTechologie, typeOffre) => {
      return rows2_2kpi.filter(row => row[3] === typeTechologie && row[4] === typeOffre).length;
    };

    const soqTemplates = ['ADSL', 'VDSL', 'SDSL', 'FTTH', 'LS-FO'].map(tech => ([
      username, mois, tech,
      countRowsInternetFixe ? filterAndSum(tech, 'Résidentiel') / countRowsInternetFixe : 0,
      countRowsInternetFixe ? filterAndSum(tech, 'PRO') / countRowsInternetFixe : 0,
      null, null,
      countRows2_2kpi ? filterKpi(tech, 'Résidentiel', 0, 1) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'PRO', 0, 1) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'Résidentiel', 1, 2) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'PRO', 1, 2) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'Résidentiel', 2, 3) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'PRO', 2, 3) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi5(tech, 'Résidentiel', 3) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi5(tech, 'PRO', 3) / countRows2_2kpi : 0,
      filterKpi2_6(tech, 'Résidentiel'),
      filterKpi2_6(tech, 'PRO')
    ]));

    connection.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion des données dans MySQL :', err.message);
        return res.status(500).send('Erreur lors de l\'insertion des données dans MySQL : ' + err.message);
      }
      console.log('Données insérées dans MySQL :', result);

      const insertKpiPromises = soqTemplates.map(soq => {
        return new Promise((resolve, reject) => {
          connection.query(sqlKpi, [[soq]], (err, result) => {
            if (err) {
              console.error('Erreur lors de l\'insertion des KPI dans MySQL :', err.message);
              return reject(err.message);
            }
            console.log('KPI insérés dans MySQL :', result);
            resolve();
          });
        });
      });

      Promise.all(insertKpiPromises)
        .then(() => {
          res.status(200).send('Fichier téléchargé et données insérées dans MySQL');
        })
        .catch((error) => {
          res.status(500).send('Erreur lors de l\'insertion des KPI dans MySQL : ' + error);
        });
    });

  } catch (error) {
    console.error('Erreur lors du traitement du fichier :', error);
    res.status(500).send('Erreur lors du traitement du fichier : ' + error.message);
  }
});

///////////////////////////




app.post('/searchTable', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId|| !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId1, mois, Annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  let query = `SELECT * FROM votre_table WHERE userId = ? AND MoisDepot = ? AND annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche:', err);
      return res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
    res.json(results);
  });
});

app.post('/searchTable2', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId || !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId, mois, annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  let query = `SELECT * FROM votre_table2 WHERE userId = ? AND MOIS = ? AND Annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche:', err);
      return res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
    res.json(results);
  });
});




app.post('/searchTable3', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId || !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId, mois, Annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  let query = `SELECT * FROM votre_table3 WHERE userId = ? AND mois_pwc	 = ? AND Annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche:', err);
      return res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
    res.json(results);
  });
});




app.post('/searchTable4', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId || !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId, mois, Annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  let query = `SELECT * FROM votre_table4 WHERE userId = ? AND mois_pwc = ? AND Annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche:', err);
      return res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
    res.json(results);
  });
});

//////////////////////////

app.delete('/searchTable', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId || !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId, mois, annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  const query = `DELETE FROM votre_table WHERE userId = ? AND MoisDepot = ? AND Annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête delete Table1 avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression:', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.json(results);
  });
});


app.delete('/searchTable2', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId || !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId, mois, annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  const query = `DELETE FROM votre_table2 WHERE userId = ? AND MOIS = ? AND Annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression:', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.json(results);
  });
});

app.delete('/searchTable3', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId || !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId, mois, annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  const query = `DELETE FROM votre_table3 WHERE userId = ? AND mois_pwc = ? AND Annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression:', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.json(results);
  });
});

app.delete('/searchTable4', (req, res) => {
  const { userId, mois, annee } = req.body;

  // Vérifier si les paramètres sont bien fournis
  if (!userId || !mois || !annee) {
    return res.status(400).json({ error: 'Tous les champs (userId, mois, annee) sont requis.' });
  }

  // Construire la requête SQL dynamiquement
  const query = `DELETE FROM votre_table4 WHERE userId = ? AND mois_pwc = ? AND Annee = ?`;
  const queryParams = [userId, mois, annee];

  console.log('Exécution de la requête avec :', queryParams);

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression:', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.json(results);
  });
});


//////////////////////////
app.post('/search', (req, res) => {
  // Extraire les paramètres du corps de la requête
  const { idfsi, mois, technologies } = req.body;

  // Convertir les chaînes de caractères en tableaux
  const moisArray = mois.split(','); 
  const techArray = technologies.split(',');

  // Préparer les placeholders pour les requêtes SQL
  const moisPlaceholders = moisArray.map(() => '?').join(',');
  const techPlaceholders = techArray.map(() => '?').join(',');

  // Construire la requête SQL avec les placeholders
  const query = `
    SELECT * FROM crm 
    WHERE idfsi = ? 
      AND Mois IN (${moisPlaceholders}) 
      AND Technologie IN (${techPlaceholders})
  `;
  console.log('Administrateur mis à jour avec succès');

  // Combiner idfsi, moisArray, et techArray en un seul tableau de paramètres
  const queryParams = [idfsi, ...moisArray, ...techArray];

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche:', err);
      return res.status(500).send('Erreur lors de la recherche');
    }
    res.json(results);
  });
});

app.post('/search2', (req, res) => {
  // Extraire les paramètres du corps de la requête
  const { idfsi, mois, technologies } = req.body;

  // Convertir les chaînes de caractères en tableaux
  const moisArray = mois.split(','); 
  const techArray = technologies.split(',');
  const idfsiArray = idfsi.split(',');

  // Préparer les placeholders pour les requêtes SQL
  const moisPlaceholders = moisArray.map(() => '?').join(',');
  const techPlaceholders = techArray.map(() => '?').join(',');
  const idfsiPlaceholders = idfsiArray.map(() => '?').join(',');

  // Construire la requête SQL avec les placeholders
  const query = `
    SELECT * FROM crm 
    WHERE idfsi IN (${idfsiPlaceholders})
      AND Mois IN (${moisPlaceholders}) 
      AND Technologie IN (${techPlaceholders})
  `;

  console.log('Recherche en cours...');

  // Combiner idfsi, moisArray, et techArray en un seul tableau de paramètres
  const queryParams = [...idfsiArray, ...moisArray, ...techArray];

  // Exécuter la requête SQL
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche:', err);
      return res.status(500).send('Erreur lors de la recherche');
    }
    res.json(results);
  });
});








const storage3 = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(__dirname, 'uploads3'));}, filename: function (req, file, cb) { cb(null, file.originalname); } });

const upload3 = multer({ storage: storage3 });

app.post('/upload3', upload3.single('excelFile'), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const username = req.body.username;
  
  const sql = 'INSERT INTO votre_table3 (created_at, mois_pwc, duree_pwc, last_user_reply_at, categories, mapping_pwc, closed, Annee ,userId ) VALUES ?';
  const values = data.slice(1).map(row => [...row, username]); // Ajouter username à chaque ligne de données

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données dans MySQL :', err.message);
      return res.status(500).send('Erreur lors de l\'insertion des données dans MySQL : ' + err.message);
    }
    console.log('Données insérées dans MySQL :', result);
    res.status(200).send('Fichier téléchargé et données insérées dans MySQL');
  });
}); 


const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads4')); // Utilisez path.join pour obtenir le chemin absolu
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload4 = multer({ storage: storage4 });

app.post('/upload4', upload4.single('excelFile'), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const username = req.body.username;
  const sql = 'INSERT INTO votre_table4 (node_session_sequence, call_start_time, queue_time, ring_time, talk_time, type_client, type_offre, mois_pwc, pwc_3_4, pwc_3_5, userId ,Annee ) VALUES ?';
  const values = data.slice(1).map(row => [...row, username]); // Ajouter username à chaque ligne de données

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données dans MySQL :', err.message);
      return res.status(500).send('Erreur lors de l\'insertion des données dans MySQL : ' + err.message);
    }
    console.log('Données insérées dans MySQL :', result);
    res.status(200).send('Fichier téléchargé et données insérées dans MySQL');
  });
});




const port = process.env.PORT || 4972;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

/*app.post('/upload2', upload2.single('excelFile'), (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const username = req.body.username;
    const sql = `INSERT INTO votre_table2 (
      id_contrat, date_ouverture, date_cloture, type_offre, type_client, etat_ticket, 
      sujet, type_incident, indisponibilite, derangement, facturation, 
      internet_fixe, id_client, MOIS, userId
    ) VALUES ?`;

    const values = data.slice(1).map(row => [...row.slice(0, 14), username]);

    const sqlKpi = `INSERT INTO crm (
      idfsi, Mois, Technologie, KPI3_11_Pro, KPI3_11_Res, KPI2_1_Pro, 
      KPI2_1_Res, KPI2_2_Pro, KPI2_2_Res, KPI2_3_Pro, KPI2_3_Res, KPI2_4_Pro, 
      KPI2_4_Res, KPI2_5_Pro, KPI2_5_Res, KPI2_6_Pro, KPI2_6_Res
    ) VALUES ?`;

    const rowsInternetFixe = data.slice(1).filter(row => row[11] === 'True');
    const countRowsInternetFixe = rowsInternetFixe.length;

    console.log('Le nombre de lignes filtrées :', countRowsInternetFixe);
    const mois = data[1][13]; 
    console.log('mois :', mois);

    const calculateDuration = (row) => {
    const dateCloture = new Date(row[2]);
     const dateOuverture = new Date(row[1]);
  

      return (dateCloture - dateOuverture) ; // durée en heures
    };

    const filterAndSum = (typeOffre, typeClient) => {
      const filteredRows = rowsInternetFixe.filter(row => row[3] === typeOffre && row[4] === typeClient);
      return filteredRows.reduce((acc, row) => {
        const duration = calculateDuration(row);
        return duration < (1 / 24) ? acc + duration : acc;
      }, 0);
    };

    const rows2_2kpi = data.slice(1).filter(row => row[11] === 'True' && row[5] === 'Clôturé' && row[7] === 'T');
    const countRows2_2kpi = rows2_2kpi.length;
    console.log('Le nombre de lignes filtrées countRows2_2kpi :', countRows2_2kpi);

    const filterKpi = (typeTechologie, typeOffre, minDuration, maxDuration) => {
      return rows2_2kpi
        .filter(row => row[3] === typeTechologie && row[4] === typeOffre)
        .reduce((acc, row) => {
          const duration = calculateDuration(row);
          return duration >= minDuration && duration < maxDuration ? acc + duration : acc;
        }, 0);
    };

    const filterKpi5 = (typeTechologie, typeOffre, minDuration) => {
      return rows2_2kpi
        .filter(row => row[3] === typeTechologie && row[4] === typeOffre)
        .reduce((acc, row) => {
          const duration = calculateDuration(row);
          return duration >= minDuration ? acc + duration : acc;
        }, 0);
    };

    const filterKpi2_6 = (typeTechologie, typeOffre) => {
      return rows2_2kpi.filter(row => row[3] === typeTechologie && row[4] === typeOffre).length;
    };
 vb
    const soqTemplates = ['ADSL', 'VDSL', 'SDSL', 'FTTH', 'LS-FO'].map(tech => ([
      username, mois, tech,
      countRowsInternetFixe ? filterAndSum(tech, 'Résidentiel') / countRowsInternetFixe : 0,
      countRowsInternetFixe ? filterAndSum(tech, 'PRO') / countRowsInternetFixe : 0,
      null, null,
      countRows2_2kpi ? filterKpi(tech, 'Résidentiel', 0, 1) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'PRO', 0, 1) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'Résidentiel', 1, 2) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'PRO', 1, 2) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'Résidentiel', 2, 3) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi(tech, 'PRO', 2, 3) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi5(tech, 'Résidentiel', 3) / countRows2_2kpi : 0,
      countRows2_2kpi ? filterKpi5(tech, 'PRO', 3) / countRows2_2kpi : 0,
      filterKpi2_6(tech, 'Résidentiel'),
      filterKpi2_6(tech, 'PRO')
    ]));

    connection.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion des données dans MySQL :', err.message);
        return res.status(500).send('Erreur lors de l\'insertion des données dans MySQL : ' + err.message);
      }
      console.log('Données insérées dans MySQL :', result);

      const insertKpiPromises = soqTemplates.map(soq => {
        return new Promise((resolve, reject) => {
          connection.query(sqlKpi, [[soq]], (err, result) => {
            if (err) {
              console.error('Erreur lors de l\'insertion des KPI dans MySQL :', err.message);
              return reject(err.message);
            }
            console.log('KPI insérés dans MySQL :', result);
            resolve();
          });
        });
      });

      Promise.all(insertKpiPromises)
        .then(() => {
          res.status(200).send('Fichier téléchargé et données insérées dans MySQL');
        })
        .catch((error) => {
          res.status(500).send('Erreur lors de l\'insertion des KPI dans MySQL : ' + error);
        });
    });

  } catch (error) {
    console.error('Erreur lors du traitement du fichier :', error);
    res.status(500).send('Erreur lors du traitement du fichier : ' + error.message);
  }
});*/














