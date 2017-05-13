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
        },
        order: 'asinProduct asc'
    };

    Swap.findAll(optionSearch).then(function(swaps){
        let allAsin = [];
        let asinEtat = [];
        let searchRestrinction;

        for(var product of swaps) {
            allAsin.push(product.asinProduct);
            asinEtat.push({asin: product.asinProduct, etat: product.etat});
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

        Product.find(searchRestrinction).then(function(products) {
            let productsEtats = getCleanProdutEtat(products, asinEtat);
            res.send(JSON.stringify(productsEtats));
        }).catch(function(err) {
            console.log('Error : ' + err);
        });

    }).catch(function(err) {
        console.log('ERROR : ' + err)
    });
});

//supprime le produit pour l'user
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

//retourne les produit de l'usersId
router.post('/getProductByUserId', function(req, res, next) {
    let Product = mongoose.model('Product');

    let optionSearch = {
        where: {
            idUser: req.body.userId
        },
        order: 'asinProduct asc'
    };

    Swap.findAll(optionSearch).then(function(swaps){
        let allAsin = [];
        let asinEtat = [];
        let searchRestrinction = {
            asin: { $in : allAsin }
        };

        for(var product of swaps) {
            allAsin.push(product.asinProduct);
            asinEtat.push({asin: product.asinProduct, etat: product.etat});
        }

        Product.find(searchRestrinction).then(function(products) {
            let productsEtats = getCleanProdutEtat(products, asinEtat);

            console.log('JSON : ' + JSON.stringify(productsEtats));
            res.send(JSON.stringify(productsEtats));
        }).catch(function(err) {
            console.log('Error : ' + err);
        });

    }).catch(function(err) {
        console.log('ERROR : ' + err)
    });
});

//change l'etat du produit
router.post('/changeEtat', function(req, res, next) {
    let actual = req.body.actual;

    let options = {
        where: {
            idUser: req.cookies.idUser,
            asinProduct : req.body.asin
        }
    };

    Swap.findOne(options).then(function(swap) {
        let newInfos = {};

        if(actual == 0) {
            newInfos.etat = 1;
        } else if (actual == 1) {
            newInfos.etat = 2;
        } else {
            newInfos.etat = 0;
        }

        swap.updateAttributes(newInfos);
        res.send('' + newInfos.etat);
    }).catch(function(err) {
        console.log('SEQUELIZE 20 : ' + err);
        res.send(null);
    });

});

module.exports = router;

//Ajoute l'etat des produits
function getCleanProdutEtat(products, asinEtat) {
    let clean = [];
    for(let product of products) {
        let newProduct = {
            asin: product.asin,
            title: product.title,
            imgLink: product.imgLink,
            detailPageURL: product.detailPageURL,
            ean: product.ean,
            public: product.public,
            brand: product.brand,
            group: product.group,
            release: product.release,
            actors: product.actors,
            features: product.features,
            etat: getEtatByAsin(asinEtat, product.asin)
        };

        clean.push(newProduct);
    }

    return clean;
}


//Retourne l'etat de l'asin (Recherche dichotomique)
function getEtatByAsin(asinEtat, codeAsin) {
    let start = 0;
    let end = asinEtat.length;
    let middle = asinEtat.length + 1;

    while(middle != start || middle != end) {
        middle = parseInt((start + end) / 2);

        if (codeAsin == asinEtat[middle].asin) {
            return asinEtat[middle].etat;
        } else if (codeAsin > asinEtat[middle].asin){
            start = middle;
        } else {
            end = middle;
        }
    }
}

