const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Fonction pour créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hash du mot de passe avant de l'enregistrer dans la base de données
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Crée un nouvel utilisateur avec l'e-mail fourni et le mot de passe hashé
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Enregistrement de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ error: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Fonction pour gérer l'authentification 
exports.login = (req, res, next) => {
    // Rechercher l'utilisateur dans la base de données par son adresse e-mail
    User.findOne({ email: req.body.email })
        .then(user => {
        if (!user) {
            // Si l'utilisateur n'est pas trouvé
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparaison du mot de passe fourni avec le mot de passe hashé dans la base de données
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                // Si mot de passe ne correspondent pas
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                // Si l'authentification est réussie, génère un jeton JWT avec une durée de validité de 24 heures
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};