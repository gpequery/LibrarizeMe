const express = require('express');
const router = express.Router();
const models = require('../models');
const User = models.User;

/* GET home page. */
router.all('/', function(req, res, next) {
  send = {etatMenu: 'hide'};
  res.render('index.html.twig', {result: send});
});


router.post('/home', function(req, res, next) {

    let options = {
        where: {
            id: req.cookies.idUser
        }
    };

  User.find(options).then(function(usr) {
      let send = {
          pseudoUser: usr.lastname != '' && usr.firstname != '' ? usr.firstname + ' ' + usr.lastname : usr.pseudo
      };
      res.render('home.html.twig', {result: send});
  }).catch(function(err) {
      console.log('ERROR')
  });


});


module.exports = router;
