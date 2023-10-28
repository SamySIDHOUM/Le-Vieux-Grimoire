const express = require('express');
const router = express.Router();

const auth = require('../middlewars/auth');
const multer = require('../middlewars/multer-config');


const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/',auth, multer, bookCtrl.createBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
 