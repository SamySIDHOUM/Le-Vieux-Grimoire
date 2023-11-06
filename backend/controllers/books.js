Book = require('../models/Books');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    // Utiliser la méthode pour obtenir les livres depuis la base de données
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    // Utiliser la méthode pour obtenir un livre spécifique par son identifiant
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.createBook = (req, res, next) => {
    // Convertit les données JSON du corps de la requête en un objet JavaScript
    const bookObject = JSON.parse(req.body.book);
    // Supprime propriétés inutiles du formulaire
    delete bookObject._id;
    delete bookObject._userId;
    // Crée un nouvel objet de type Book en utilisant les données du formulaire et l'URL de l'image
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Enregistre le livre dans la base de données
    book.save()
        .then(() => {res.status(201).json({ message: 'livre enregistré !' })})
        .catch(error => {res.status(400).json({ error })});
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        // Vérifie si l'utilisateur est autorisé à supprimer ce livre
        if (book.userId !== req.auth.userId) {
            res.status(403).json({message: 'Requête non autorisée !'});
        } else {
            // Supprime le fichier image associé et le livre de la base de données
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Livre supprimé avec succès !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    // Vérifie s'il y a une nouvelle image dans la requête
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    delete bookObject._userId;
    // Vérifie si l'utilisateur est autorisé à modifier ce livre
    Book.findOne({_id: req.params.id})
        .then((book => {
            if(book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Requête non autorisée !' });
            } else {
                // Mis à jour le livre dans la base de données
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Livre modifié avec succès !'}))
                    .catch(error => res.status(401).json({ error }));
            }
        }))
        .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
    const userId = req.auth.userId;
    const grade = req.body.rating;
    // Vérifie si la note est valide
    if (!grade || grade < 0 || grade > 5) {
        return res.status(400).json({ message: 'Note invalide !' });
    }
    // Recherche le livre par son identifiant
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // Vérifie si l'utilisateur a déjà noté ce livre
            const userRating = book.ratings.find(rating => rating.userId === userId);
            if (userRating) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre !' });
            }
            // Ajout la nouvelle note et calcule la note moyenne
            book.ratings.push({ userId, grade });
            const averageRating = (book.ratings.reduce((acc, rating) => acc + rating.grade, 0) / book.ratings.length).toFixed(1);
            book.averageRating = parseFloat(averageRating); 
            return book.save();
        })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(500).json({ error })); 
};

exports.bestRatingBooks = (req, res, next) => {
    // Récupère les 3 livres avec les meilleures notes, triés par ordre décroissant
    Book.find().sort({averageRating: -1}).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};
