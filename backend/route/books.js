const express = require('express');
const router = express.Router();

const auth = require('../middlewars/auth');
const multer = require('../middlewars/multer-config');
const sharpConfig = require('../middlewars/sharp-config');

const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestRatingBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, sharpConfig, bookCtrl.createBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.put('/:id', auth, multer, sharpConfig, bookCtrl.modifyBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);


module.exports = router;
 