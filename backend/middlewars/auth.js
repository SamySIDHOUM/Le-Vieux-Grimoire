const jwt = require('jsonwebtoken');

// Vérifier et décoder le jeton JWT dans l'en-tête de l'autorisation
module.exports = (req, res, next) => {
   try {
        // Récupère le jeton JWT de l'en-tête d'autorisation
       const token = req.headers.authorization.split(' ')[1];
        // Vérifie et décode le jeton JWT à l'aide d'une clé secrète
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupère l'identifiant de l'utilisateur à partir du jeton décodé
       const userId = decodedToken.userId;
        // Ajout d'informations d'authentification à la requête 
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};