var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {
  send = {etatMenu: 'hide'};
  res.render('index.html.twig', {result: send});
});




module.exports = router;
