'use strict';

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();
var cookieParser = require('cookie-parser');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
    let psd = req.body.pseudo;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let action = req.body.actionForm;
    let send = null;

    if (action == 'login') {
        let options = {
            where: {
                pseudo: psd,
                password: pwd
            }
        };

        User.find(options).then(function(usr) {
            if (usr != null) {

                res.cookie('idUser', usr.getId());

                res.render('home.html.twig', {etatMenu: 'show'});
            } else {
                send = {msg:'Utilisateur non enregistré', etat:'0' };
                res.render('login.html.twig', {result: send});
            }
        }).catch(function(err){
            send = {msg:'ERROR SEQUELIZE 0', etat:'0'};
            res.render('login.html.twig', {result: send});
        });

    } else if (action == 'register' && pwd != pwd2) {
        send = {msg:'Les deux mots de passes sont différents', etat:'0' };
        res.render('login.html.twig', {result: send});
    } else if (action == 'register' && pwd == pwd2) {
        //Vérifie l'existance du pseudo avant de créer le nouvel user
        let options = {
            where: {
                pseudo: psd
            }
        };

        User.find(options).then(function(usr) {
            if (usr == null) { //SI l'usr (pseudo) existe pas on créer l'user
                User.create({
                    pseudo: psd,
                    password: pwd
                }).then(function(usr) {
                    send = {msg:'Utilisateur créé. Vous pouvez vous identifier', etat:'1'};
                    res.render('login.html.twig', {result: send});
                }).catch(function(err) {
                    send = {msg:'ERROR SEQUELIZE 1', etat:'0'};
                    res.render('login.html.twig', {result: send});
                });
            } else {   // SInon, prévient que le psuedo est déjà utilisé
                send = {msg:'Pseudo déjà utilisé', etat:'0'};
                res.render('login.html.twig', {result: send});
            }
        }).catch(function(err) {
            send = {msg:'ERROR SEQUELIZE 2', etat:'0'};
            res.render('login.html.twig', {result: send});
        });
    } else {
        res.render('login.html.twig', {result: send});
    }
});

// router.get('/login', function(req, res, next) {
//     let psd = req.query.pseudo;
//     let pwd = req.query.pwd;
//     let pwd2 = req.query.pwd2;
//     let action = req.query.actionForm;
//     let send = null;
//
//     if (action == 'login') {
//         let options = {
//             where: {
//                 pseudo: psd,
//                 password: pwd
//             }
//         };
//
//         User.find(options).then(function(usr) {
//             if (usr != null) {
//
//                 res.cookie('idUser', usr.getId());
//
//                 res.render('home.html.twig', {etatMenu: 'show'});
//             } else {
//                 send = {msg:'Utilisateur non enregistré', etat:'0' };
//                 res.render('login.html.twig', {result: send});
//             }
//         }).catch(function(err){
//             send = {msg:'ERROR SEQUELIZE 0', etat:'0'};
//             res.render('login.html.twig', {result: send});
//         });
//
//     } else if (action == 'register' && pwd != pwd2) {
//         send = {msg:'Les deux mots de passes sont différents', etat:'0' };
//         res.render('login.html.twig', {result: send});
//     } else if (action == 'register' && pwd == pwd2) {
//         //Vérifie l'existance du pseudo avant de créer le nouvel user
//         let options = {
//             where: {
//                 pseudo: psd
//             }
//         };
//
//          User.find(options).then(function(usr) {
//              if (usr == null) { //SI l'usr (pseudo) existe pas on créer l'user
//                  User.create({
//                      pseudo: psd,
//                      password: pwd
//                  }).then(function(usr) {
//                      send = {msg:'Utilisateur créé. Vous pouvez vous identifier', etat:'1'};
//                      res.render('login.html.twig', {result: send});
//                  }).catch(function(err) {
//                      send = {msg:'ERROR SEQUELIZE 1', etat:'0'};
//                      res.render('login.html.twig', {result: send});
//                  });
//              } else {   // SInon, prévient que le psuedo est déjà utilisé
//                  send = {msg:'Pseudo déjà utilisé', etat:'0'};
//                  res.render('login.html.twig', {result: send});
//              }
//         }).catch(function(err) {
//              send = {msg:'ERROR SEQUELIZE 2', etat:'0'};
//              res.render('login.html.twig', {result: send});
//         });
//     } else {
//         res.render('login.html.twig', {result: send});
//     }
// });

router.get('/logout', function(req, res, next) {
    res.cookie('idUser', '');

    res.redirect('login');
});

module.exports = router;
