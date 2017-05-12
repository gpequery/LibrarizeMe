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

    console.log('REQUETE ADD : ');
    Swap.findOne(searchSwap).then(function(swap) {
        if(swap == null) {
            Swap.create({
                idUser: idUser,
                asinProduct: asin,
                etat: 0
            }).then(function(newSwap) {
                console.log('THEN');
                res.send({etat: 'ok', msg: 'Produit ajouté dans votre bibliothèque !'});
            }).catch(function(err) {
                console.log('CATCH');
                res.send({etat: 'nok', msg: 'ERREUR pour ajouter'});
            });
        } else {
            console.log('ELSE : ');
            res.send({etat: 'ok', msg: 'Produit déjà dans votre bibliothèque !'});
        }

    }).catch(function(err) {
        console.log('ERR');
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
        let searchRestrinction;

        for(var product of swaps) {
            allAsin.push(product.asinProduct);
        }

        if (req.body.group == 'All') {
            console.log('group null: ' + req.body.group);
            searchRestrinction = {
                $or: [
                    {'title': new RegExp(req.body.title, "i")},
                    {'ean': new RegExp(req.body.title, "i")}
                ],
                asin: { $in : allAsin }
            };
        } else {
            console.log('group TOOO : ' + req.body.group);
            searchRestrinction = {
                $or: [
                    {'title': new RegExp(req.body.title, "i")},
                    {'ean': new RegExp(req.body.title, "i")}
                ],
                asin: { $in : allAsin },
                group: req.body.group
            };
        }


        console.log('FIN PRODUCT : ');
        Product.find(searchRestrinction).then(function(products) {
            res.send(JSON.stringify(products));
        }).catch(function(err) {
            console.log('Error : ' + err);
        });

    }).catch(function(err) {
        console.log('ERROR : ' + err)
    });
});

router.post('/delProduct', function(req, res, next) {
    let optionSearch = {
        where: {
            idUser: req.cookies.idUser,
            asinProduct: req.body.asin
        }
    };

    Swap.destroy(optionSearch).then(function(swap){
        res.send('ok');
    }).catch(function(err) {
        console.log('ERROR : ' + err);
        res.send('nok');
    });
});

module.exports = router;
