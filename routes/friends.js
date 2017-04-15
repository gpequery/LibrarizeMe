'use strict';

const express = require('express');
const models = require('../models');
const Friends = models.Friends;
const User = models.User;
const router = express.Router();
const nodemailer = require('nodemailer');

const fs = require('fs');

const app = express();


//Affiche la page de recherche d'amis
router.post('/searchUsers', function(req, res, next) {
    let send = {
        pseudoUser: req.body.userName
    };
    res.render('FriendsViews/searchUsers.html.twig', {result: send});
});

//Retoune une liste d'utilisateurs par pseudo (en retirant l'utilisateur courant)
router.post('/searchUsersByText', function(req, res, next) {
    let value = '%' + req.body.value + '%';
    let options = {
        where: {
            pseudo: {
                like: value
            },
            id: {
                ne: req.cookies.idUser
            }
        }, order: '"pseudo" ASC'
    };

    User.findAll(options).then(function(users) {
        let resultUser = [] ;

        for (var usr of users) {
            resultUser.push(usr.toJsonWithAvatar());
        }

        res.send(JSON.stringify(resultUser));
    }).catch(function(err) {
        res.send('Nok');
    });
});

router.post('/sendInvite', function(req, res, next) {
    Friends.create({
        accepted: false,
        user_id: req.cookies.idUser,
        friend_id: req.body.usrId
    }).then(function(relation) {
        res.send('Demande bien envoyée');
    }).catch(function(err) {
        res.send('Nok');
    });
});

module.exports = router;
