const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

const userRoutes = require('./route/user');
const bookRoutes = require('./route/books');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://admin:1HKGUiUeQM5Z4NtP@cluster0.dhktszw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Vérification et création du répertoire "images" s'il n'existe pas
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

const app= express();
// Configuration des en-têtes CORS pour permettre les requêtes depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
// Décoder le corps des requêtes au format JSON
app.use(bodyParser.json());
// Gérer les requêtes Cross-Origin
app.use(cors());

// Configuration des routes livres/utilisateurs
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Configuration du serveur pour servir les images depuis le répertoire 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;