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

//Envoyer une invitation pour devenir amis
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

//Voir ses invitations (en attente et à accepter)
router.post('/seeInvitation', function(req, res, next) {
    let options = {
        where: {
            accepted: 0,
            $or : {
                friend_id: req.cookies.idUser,
                user_id: req.cookies.idUser
            }

        }, order: '"created_at" ASC'
    };

    //Cherche les invitations relatives à l'utilisateur courant
    Friends.findAll(options).then(function(invitations) {
        let data = [];
        let waitIds = [];
        let sendIds = [];

        //Trie les idUtilisateurs celon le type d'invitation
        for (var one of invitations) {
            if (one.user_id == req.cookies.idUser) {
                waitIds.push(one.friend_id);
            } else {
                sendIds.push(one.user_id);
            }
        }

        let options = {
            'wait' : {
                where: {
                    id: {
                        $in: waitIds
                    }
                }, order: '"pseudo" ASC'
            },
            'send' : {
                where: {
                    id: {
                        $in: sendIds
                    }
                }, order: '"pseudo" ASC'
            }
        };

        //Cherche les invitations envoyé en attente de réponse
        User.findAll(options['wait']).then(function(usersWait) {
            data['wait'] = usersWait;

            //Cherche les invitations reçue en attente de réponse
            User.findAll(options['send']).then(function(userSend) {
                data['send'] = userSend;

                let result = {
                    pseudoUser: req.body.userName,
                    invitation: data
                };

                res.render('FriendsViews/seeInvitation.html.twig', {result: result});
            }).catch(function(err) {
                console.log('ERROR 10 : ' + err);
                let result = {
                    pseudoUser: req.body.userName,
                    invitation: data
                };

                res.render('FriendsViews/seeInvitation.html.twig', {result: result});
            });
        }).catch(function(err){
            console.log('ERROR 11 : ' + err);
            let result = {
                pseudoUser: req.body.userName,
                invitation: data
            };

            res.render('FriendsViews/seeInvitation.html.twig', {result: result});
            User.findAll(optionsSend).then(function(userSend) {
                data['wait'] = null;
                data['send'] = userSend;
                let result = {
                    pseudoUser: req.body.userName,
                    invitation: data
                };

                res.render('FriendsViews/seeInvitation.html.twig', {result: result});
            }).catch(function(err) {
                console.log('ERROR 12 : ' + err);
                let result = {
                    pseudoUser: req.body.userName,
                    invitation: null
                };

                res.render('FriendsViews/seeInvitation.html.twig', {result: result});
            });
        });
    }).catch(function(err) {
        let result = {
            pseudoUser: req.body.userName,
            invitation: 'Nok'
        };
        console.log('ERROR 12 : ' + err);
        res.render('FriendsViews/seeInvitation.html.twig', {result: result});
    });
});

module.exports = router;
