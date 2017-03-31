'use strict';

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();
const nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');


router.post('/login', function(req, res, next) {
    let psd = req.body.pseudo;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let lastname = req.body.lastname;
    let firstname = req.body.firstname;
    let mail = req.body.mail;
    let numberphone = req.body.numberphone;
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

                let fullPseudo = usr.lastname != '' && usr.firstname != '' ? usr.firstname + ' ' + usr.lastname : usr.pseudo;
                // let fullPseudo = this.getFullName() ;

                send = {
                    etatMenu: 'show',
                    pseudoUser: fullPseudo
                };
                res.render('home.html.twig', {result: send});
            } else {
                send = {
                    msg:'Utilisateur non enregistré',
                    etat:'0',
                    etatMenu: 'hide'
                };
                res.render('UserViews/login.html.twig', {result: send});
            }
        }).catch(function(err){
            send = {
                msg:'ERROR SEQUELIZE 0',
                etat:'0',
                etatMenu: 'hide'
            };
            res.render('UserViews/login.html.twig', {result: send});
        });

    } else if (action == 'register' && pwd != pwd2) {
        send = {
            msg:'Les deux mots de passes sont différents',
            etat:'0',
            etatMenu: 'hide'
        };
        res.render('UserViews/login.html.twig', {result: send});
    } else if (action == 'register' && pwd == pwd2) {
        //Vérifie l'existance du pseudo et du mail avant de créer le nouvel user
        let options = {
            where: {
                $or: [{
                        pseudo: psd
                    },{
                        mail: mail
                    }]
            }
        };

        User.find(options).then(function(usr) {
            if (usr == null) { //SI l'usr (pseudo) existe pas on créer l'user
                User.create({
                    pseudo: psd,
                    password: pwd,
                    lastname: lastname,
                    firstname: firstname,
                    mail: mail,
                    numberphone: numberphone
                }).then(function(usr) {
                    //Envoye un mail avec les infos de l'utilisateur
                    let infosMail = {
                        'subject' : 'Création de compte',
                        'mail' : mail,
                        'usr': usr,
                        'reason' : 'newCompte'
                    };
                    sendMail(infosMail);

                    //Renvye sur la page pour se connecter
                    send = {
                        msg:'Utilisateur créé. Vous pouvez vous identifier',
                        etat:'1',
                        etatMenu: 'hide'
                    };
                    res.render('UserViews/login.html.twig', {result: send});
                }).catch(function(err) {
                    send = {
                        msg:'ERROR SEQUELIZE 1',
                        etat:'0',
                        etatMenu: 'hide'
                    };
                    res.render('UserViews/login.html.twig', {result: send});
                });
            } else {   // SInon, prévient que le pseudo ou mail est déjà utilisé
                if (psd == usr.pseudo) {
                    send = {
                        msg:'Pseudo déjà utilisé',
                        etat:'0',
                        etatMenu: 'hide'
                    };
                } else {
                    send = {
                        msg:'Email déjà utilisé',
                        etat:'0',
                        etatMenu: 'hide'
                    };
                }
                res.render('UserViews/login.html.twig', {result: send});
            }
        }).catch(function(err) {
            send = {
                msg:'ERROR SEQUELIZE 2',
                etat:'0',
                etatMenu: 'hide'
            };
            res.render('UserViews/login.html.twig', {result: send});
        });
    } else {
        send = {etatMenu: 'hide'};
        res.render('UserViews/login.html.twig', {result: send});
    }
});

//Print Popup
router.get('/forgotPassword', function(req, res, next) {
    res.render('UserViews/forgotPwd.html.twig')
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
            let infosMail = {
                'subject' : 'Demande de changement de mot de passe',
                'pseudo' : usr.pseudo,
                'mail' : usr.mail,
                'pwd' : usr.password,
                'reason' : 'sendPwd'
            };
           sendMail(infosMail);
        } else {
            console.log('USER INCONNUE');
        }
    }).catch(function(err) {
        console.log('ERROR SEQUELIZE 3');
    });

    //Ferme la popup
    res.send('<script>close()</script>');
});

router.post('/informations', function(req, res, next) {
    let send;

    let options = {
        where: {
            id: req.cookies.idUser
        }
    };

    User.find(options).then(function(usr) {
        if (usr) {
            send = {
                pseudoUser: req.body.userName,
                userInfo: usr
            };

            res.render('UserViews/informations.html.twig', {result: send});
        } else {
            send = {
                msg:'ERROR : Compte introuvable, recommencez.',
                etat:'0',
                etatMenu: 'hide'
            };
            res.render('UserViews/login.html.twig', {result: send});
        }

    }).catch(function(err) {
        send = {
            msg:'ERROR SEQUELIZE 4',
            etat:'0',
            etatMenu: 'hide'
        };
        res.render('UserViews/login.html.twig', {result: send});
    });
});

router.post('/logout', function(req, res, next) {
    res.cookie('idUser', '');
    res.redirect('/');
});

module.exports = router;


function sendMail(infos) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'librarize@gmail.com',
            pass: 'LibrarizeMe3'
        }
    });

    let mailOptions = {
        from: 'librarize@gmail.com',
        to: infos.mail,
        subject: 'LibrarizeMe : ' + infos.subject,
        html: getGoodMail(infos)
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

function getGoodMail(infos) {
    switch (infos.reason) {
        case 'sendPwd':
            return getBodyMailForgotPwd(infos.pseudo, infos.pwd);
            break;

        case 'newCompte':
            return getBodyMailNewAcount(infos.usr);
            break;
    }
}

function getBodyMailForgotPwd(pseudo, pwd) {
    let html = '';

    html += getHeaderMail(pseudo);
    html +=                 '<div>Merci de rester fidèle à LibrarizeMe ! </div>';
    html +=                 '<div style="margin-bottom: 20px">Vous recevez ce mail car vous venez de nous demander votre mot de passe.</div>';
    html +=                 '<div style="margin-bottom: 25px">Voici votre mot de passe : <b>' + pwd + '</b></div>';
    html += getFooterMail();

    return html;
}

function getBodyMailNewAcount(usr) {
    let html = '';

    html += getHeaderMail(usr.pseudo);
    html +=                 '<div>Merci de faire confiance à LibrarizeMe ! </div>';
    html +=                 '<div style="margin-bottom: 20px">Vous recevez ce mail car vous venez de vous créer un compte.</div>';

    html +=                 '<div style="margin-bottom: 25px">';
    html +=                     '<span>Voici vos informations personnel : </span>';

    if (usr.pseudo != '') {
        html +=                     '<div style=\'margin-left: 30px;\'><b>Pseudo</b> : ' + usr.pseudo  + '</div>';
    }

    if (usr.lastname != '') {
        html +=                     '<div style=\'margin-left: 30px;\'><b>Nom</b> : ' +  usr.lastname + '</div>';
    }

    if (usr.firstname != '') {
        html +=                     '<div style=\'margin-left: 30px;\'><b>Prénom</b> : ' + usr.firstname  + '</div>';
    }

    if(usr.mail != '') {
        html +=                     '<div style=\'margin-left: 30px;\'><b>Mail</b> : ' + usr.mail  + '</div>';
    }

    if (usr.numberphone != '') {
        html +=                     '<div style=\'margin-left: 30px;\'><b>Mobile</b> : ' + usr.numberphone  + '</div>';
    }

    html +=                 '</div>';

    html += getFooterMail();
    return html;
}

function getHeaderMail(pseudo) {
    let html = '';

    html += '<body>';
    html +=     '<div style="width: 99%">';
    html +=         '<div style=\'width: 99%; background-color: #092D3D; border: 4px solid #092D3D; border-radius: 10px 10px 0px 0px;\'>';
    html +=             '<div style=\'color: rgba(0,0,0,0); height: 57px; background: url("http://img4.hostingpics.net/pics/687511mailHeader.png") no-repeat top center; cursor: pointer;\' onclick=\'alert("Coucou")\'>';
    html +=             'a'  ;
    html +=             '</div>';
    html +=         '</div>';
    html +=         '<div style=\'width: 99%; background-color: #CDCDCD; border: 4px solid #092D3D\'>';
    html +=             '<div style="padding-left: 30px;">';
    html +=                 '<h1>Bonjour ' + pseudo + ',</h1>';

    return html;
}

function getFooterMail() {
    let html = '';

    html +=                 '<div style="margin-bottom: 30px">Merci de nous donner votre avis afin de nous améliorer :)</div>';
    html +=                 '<div style=" text-align: right; margin-bottom: 10px; padding-right: 30px">Toute l\'équipe LibrarizeMe.</div>';
    html +=             '</div>';
    html +=         '</div>';
    html +=         '<div style=\'width: 99%; color: #FF6664; background-color: #092D3D; border: 4px solid #092D3D; text-align: center; border-radius: 0px 0px 5px 5px;\'>';
    html +=             '&#64;2017 LibrarizeMe';
    html +=         '</div>';

    html +=     '</div>';
    html += '</body>';

    return html;
}
