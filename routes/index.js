var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  res.send('COUCOU');
});

router.get('/login', function(req, res, next) {
    res.render('login.html.twig');
});


module.exports = router;
