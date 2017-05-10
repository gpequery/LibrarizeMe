'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models');
const Swap = models.Swap;

router.get('/', function(req, res, next) {
    res.send('COUCOU SWAP !!');
});

//Ajout un produit à l'utilisateur courrant
router.post('/addProduct', function(req, res, next) {
    let idUser = req.cookies.idUser;
    let asin = req.body.asin;

    console.log('idUSER : ' + idUser + ' ASIN : ' + asin);
    let searchSwap = {
        where: {
            idUser: idUser,
            asinProduct: asin
        }
    };

    Swap.find(searchSwap).then(function(swap) {
        console.log('SWAP : ' + swap);
        if(swap == null) {
            Swap.create({
                idUser: idUser,
                asinProduct: asin,
                etat: 0
            }).then(function(newSwap) {
                res.send({etat: 'ok', msg: 'Produit ajouté dans votre bibliothèque !'});
            }).catch(function(err) {
                res.send({etat: 'nok', msg: 'ERREUR pour ajouter'});
            });
        } else {
            res.send({etat: 'ok', msg: 'Produit déjà dans votre bibliothèque !'});
        }

    }).catch(function(err) {
        res.send({etat: 'nok', msg: 'ERREUR pour chercher'});
    });
});


module.exports = router;