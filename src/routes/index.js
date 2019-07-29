const express = require('express');
const router = express.Router();

router.get('/',  (req, res) => {
      res.render('index');
      //res.send('Hola Mundo');
});

router.get('/chaufa',  (req, res) => {
    res.send('Hola mundo chaufa');
});

module.exports = router;
