const express = require('express');
const router = express.Router();

const auth = require('../middlewars/auth');
const multer = require('../middlewars/multer-config');


const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/',auth, multer, bookCtrl.createBook);

module.exports = router;
 