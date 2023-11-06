const multer = require('multer');
// Types MIME autorisés 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp' : 'webp',
};

const storage = multer.diskStorage({
  // Destination où les fichiers seront enregistrés
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Remplace les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    // Génère le nom du fichier 
    callback(null, name + Date.now() + "." + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
