var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {
  res.redirect('/user/login');
});




module.exports = router;
