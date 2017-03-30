'use strict';

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();
const nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
    let psd = req.body.pseudo;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let mail = req.body.mail;
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
        //Vérifie l'existance du pseudo et du mail avant de créer le nouvel user
        let options = {
            where: {
                $or: [
                    {
                        pseudo: psd
                    },
                    {
                        mail: mail
                    }
                ]
            }
        };

        User.find(options).then(function(usr) {
            if (usr == null) { //SI l'usr (pseudo) existe pas on créer l'user
                User.create({
                    pseudo: psd,
                    password: pwd,
                    mail: mail
                }).then(function(usr) {
                    send = {msg:'Utilisateur créé. Vous pouvez vous identifier', etat:'1'};
                    res.render('login.html.twig', {result: send});
                }).catch(function(err) {
                    send = {msg:'ERROR SEQUELIZE 1', etat:'0'};
                    res.render('login.html.twig', {result: send});
                });
            } else {   // SInon, prévient que le pseudo ou mail est déjà utilisé
                console.log("Ancien -->   pseudo : " + usr.pseudo + " Mail : " + usr.mail);
                if (psd == usr.pseudo) {
                    send = {msg:'Pseudo déjà utilisé', etat:'0'};
                } else {
                    send = {msg:'Email déjà utilisé', etat:'0'};
                }
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

//Print Popup
router.get('/forgotPassword', function(req, res, next) {
    res.render('forgotPwd.html.twig')
});


//On submit form Popup
router.post('/forgotPassword/submit', function(req, res, next) {
    let psd = req.body.pseudoForgotPwd;
    let mail = req.body.mailForgotPwd;

    let options = {
        where: {
            pseudo: psd,
            mail: mail
        }
    };

    User.find(options).then(function(usr) {
        if (usr) { //SI l'usr avec le mail existe on envoye le mail avec son mdp
           sendMail('Demande de changement de mot de passe', usr.pseudo, usr.mail, usr.password);
        } else {
            console.log('USER INCONNUE');
        }
    }).catch(function(err) {
        console.log('ERROR SEQUELIZE 3');
    });

    //Ferme la popup
    res.send('<script>close()</script>');
});

router.get('/logout', function(req, res, next) {
    res.cookie('idUser', '');
    res.redirect('login');
});

module.exports = router;


function sendMail(object, pseudo, mail, pwd) {
    console.log('1 : ' + pwd);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'librarize@gmail.com',
            pass: 'LibrarizeMe3'
        }
    });

    let mailOptions = {
        from: 'librarize@gmail.com',
        to: 'g.pequery@gmail.com',
        // to: mail,
        subject: 'LibrarizeMe : ' + object,
        html: getMailForgotPwd(pseudo, pwd)
    };

    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log('Message Probleme ! ');
        return console.log(error);
    }
        console.log('Message send: ' + info.response);
    });

    transporter.close();
}

function getMailForgotPwd(pseudo, pwd) {
    console.log('2 : ' + pwd);
    let html = '';

    html += '<body>';

    html +=     '<div style="width: 99%">';
                    //HEADER -> LOGO
    html +=         '<div style=\'width: 99%; background-color: #092D3D; border: 4px solid #092D3D; border-radius: 10px 10px 0px 0px;\'>';
    html +=             '<div style=\'color: rgba(0,0,0,0); height: 57px; background: url("http://img4.hostingpics.net/pics/687511mailHeader.png") no-repeat top center; cursor: pointer;\' onclick=\'alert("Coucou")\'>';
    html +=             'a'  ;
    html +=             '</div>';
    html +=         '</div>';

                    //BODY MSG + INFO
    html +=         '<div style=\'width: 99%; background-color: #CDCDCD; border: 4px solid #092D3D\'>';
    html +=             '<div style="padding-left: 30px;">';
    html +=                 '<h1>Bonjour ' + pseudo + ',</h1>';
    html +=                 '<div>Merci de rester fidèle à LibrarizeMe ! </div>';
    html +=                 '<div style="margin-bottom: 20px">Vous recevez ce mail car vous venez de nous demander votre mot de passe.</div>';
    html +=                 '<div style="margin-bottom: 25px">Voici votre mot de passe : <b>' + pwd + '</b></div>';
    html +=                 '<div style="margin-bottom: 30px">Merci de nous donner votre avis afin de nous améliorer :)</div>';
    html +=                 '<div style=" text-align: right; margin-bottom: 10px; padding-right: 30px">Toute l\'équipe LibrarizeMe.</div>';
    html +=             '</div>';
    html +=         '</div>';

                    //FOOTER
    html +=         '<div style=\'width: 99%; color: #FF6664; background-color: #092D3D; border: 4px solid #092D3D; text-align: center; border-radius: 0px 0px 5px 5px;\'>';
    html +=             '&#64;2017 LibrarizeMe';
    html +=         '</div>';

    html +=     '</div>';
    html += '</body>';

    return html;
}
