const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma du modèle pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Garantir que chaque e-mail est unique dans la base de données
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);