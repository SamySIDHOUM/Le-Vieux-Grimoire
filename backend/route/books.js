const express = require('express');
const router = express.Router();

const auth = require('../middlewars/auth');

const bookCtrl = require('../controllers/books');

router.get('/', auth, bookCtrl.getAllBooks);
router.get('/:id', auth, bookCtrl.getOneBook);
router.post('/', auth, bookCtrl.createBook);

module.exports = router;
 