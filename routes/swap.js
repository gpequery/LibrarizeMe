'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models');
const Swap = models.Swap;
const mongoose = require('mongoose');

//Ajout un produit à l'utilisateur courrant
router.post('/addProduct', function(req, res, next) {
    let idUser = req.cookies.idUser;
    let asin = req.body.asin;

    let searchSwap = {
        where: {
            idUser: idUser,
            asinProduct: asin
        }
    };

    Swap.findAll(searchSwap).then(function(swap) {
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

//Retourne les produits de l'utilisateurs courant
router.post('/getMyProducts', function(req, res, next) {
    let Product = mongoose.model('Product');

    let optionSearch = {
        where: {
            idUser: req.cookies.idUser
        }
    };

    Swap.findAll(optionSearch).then(function(swaps){
        let allAsin = [];
        for(var product of swaps) {
            allAsin.push(product.asinProduct);
        }

        Product.find({ asin : { $in : allAsin } }).then(function(products) {
            res.send(JSON.stringify(products));
        }).catch(function(err) {
            console.log('Error : ' + err);
        });

    }).catch(function(err) {
        console.log('ERROR : ' + err)
    });
});


module.exports = router;