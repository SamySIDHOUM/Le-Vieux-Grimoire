const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
            
const sharpConfig = (req, res, next) => {
  // Vérifie si une image est attachée à la requête
  if (!req.file) return next();
  // Chemin d'entrée et de sortie pour l'image
  const imageInput = req.file.path;
  const imageOutput = req.file.path.replace(/\.(jpg|jpeg|png)$/, ".webp");
  // Utilisation de Sharp pour redimensionner et convertir 
  sharp(imageInput)
  .resize({ width: 375, height: 568 })
  .toFormat('webp', { quality: 80 })  
  .toFile(imageOutput)

  .then(() => {
    // Supprime le fichier d'origine après la configuration réussie
    fs.unlinkSync(imageInput);

    // Mis à jour des informations du fichier dans la requête
    req.file.path = imageOutput;
    req.file.mimetype = 'image/webp';
    req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');
    next();
  })
  .catch(error => {res.status(400).json({ error })});

};

module.exports = sharpConfig;