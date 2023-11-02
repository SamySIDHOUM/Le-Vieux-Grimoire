const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

const userRoutes = require('./route/user');
const bookRoutes = require('./route/books');
const path = require('path');
const cors = require('cors');
const fs = require('fs');


mongoose.connect('mongodb+srv://admin:1HKGUiUeQM5Z4NtP@cluster0.dhktszw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
const app= express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use(cors());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

// Vérification et création du répertoire "images" s'il n'existe pas
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

module.exports = app;