const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Définition du port à utiliser, 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Fonction de gestion des erreurs liées au serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestionnaire d'erreur pour le serveur
server.on('error', errorHandler);
// Événement lorsque le serveur écoute
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Écoute du serveur sur le port spécifié
server.listen(port);
