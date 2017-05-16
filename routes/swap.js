'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models');
const Swap = models.Swap;
const User = models.User;
const mongoose = require('mongoose');
const Sequelize = require('sequelize');


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
            searchRestrinction = {
                $or: [
                    {'title': new RegExp(req.body.title, "i")},
                    {'ean': new RegExp(req.body.title, "i")}
                ],
                asin: { $in : allAsin }
            };
        } else {
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
            newInfos.startDate = null;
            newInfos.idUserTo = null;
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

//Demande le produit à l'utilisateur et le met en occupé (etat 0 -> rouge)
router.post('/askProduct', function(req, res, next) {
    let options = {
        where: {
            idUser: req.body.idUser,
            asinProduct: req.body.asin
        }
    };

    Swap.findOne(options).then(function(swap) {
        let newInfos = {
            etat: 0,
            idUserTo: req.cookies.idUser
        };
        swap.updateAttributes(newInfos);

        res.send('ok');
    }).catch(function(err) {
        console.log('ERREUR 23 : ' + err);
        res.send(err);
    });

});


//Affiche la page de mes demande d'échanger
router.post('/myRequest', function (req, res, next) {
    let send = {
        pseudoUser: req.body.userName
    };

    res.render('SwapViews/myRequest.html.twig', {result: send});
});

//retourne la liste des echanges avec le pseudo du demandeur
router.post('/getMyRequest', function(req, res, next) {
    let optionsSearch = {
        where :{
            idUser: req.cookies.idUser,
            idUserTo: {
                ne: null
            },
            startDate: null
        },
        order: 'asinProduct asc'
    };

    Swap.findAll(optionsSearch).then(function(swaps) {
        let allAsin = [];
        let asinUser = [];
        let pseudoId = [];
        let searchRestrinction = {
            asin: { $in : allAsin }
        };

        for(var product of swaps) {
            allAsin.push(product.asinProduct);
            asinUser.push({asin: product.asinProduct, idUser: product.idUserTo});

            User.findById(product.idUserTo).then(function(usr) {
                pseudoId.push({id: usr.id, pseudo: usr.pseudo});
            });
        }



        let Product = mongoose.model('Product');
        Product.find(searchRestrinction).then(function(products) {
            let productsUser = getCleanProdutUser(products, asinUser, pseudoId);

            res.send(JSON.stringify(productsUser));
        }).catch(function(err) {
            console.log('Error25 : ' + err);
            res.send('nok');
        });
    }).catch(function(err) {
        console.log('Error24 : ' + err);
        res.send('nok');
    });
});

router.post('/refuseSwap', function(req, res, next) {
    let optionsSearch = {
        where :{
            idUser: req.cookies.idUser,
            asinProduct: req.body.asin
        }
    };

    Swap.findOne(optionsSearch).then(function(swap) {
        let newInfos = {
            idUserTo: null,
            etat: 1
        };
        swap.updateAttributes(newInfos);
        res.send('ok');
    }).catch(function(err){
        console.log('Error 26 : ' + err);
        res.send('nok')
    });
});

router.post('/accepteSwap', function(req, res, next) {
    let optionsSearch = {
        where :{
            idUser: req.cookies.idUser,
            asinProduct: req.body.asin
        }
    };

    Swap.findOne(optionsSearch).then(function(swap) {
        let newInfos = {
            startDate: Sequelize.fn('NOW'),
            etat: 0
        };
        swap.updateAttributes(newInfos);
        res.send('ok');
    }).catch(function(err){
        console.log('Error 26 : ' + err);
        res.send('nok')
    });
});

router.post('/returnSwap', function(req, res, next) {
    let optionsSearch = {
        where :{
            idUser: req.cookies.idUser,
            asinProduct: req.body.asin
        }
    };

    console.log('ID : ' + req.body.asin);


    Swap.findOne(optionsSearch).then(function(swap) {
        let newInfos = {
            idUserTo: null,
            enDate: Sequelize.fn('NOW'),
            etat: 1
        };

        console.log('JSON : ' + JSON.stringify(newInfos));

        swap.updateAttributes(newInfos);
        res.send('ok');
    }).catch(function(err){
        console.log('Error 26 : ' + err);
        res.send('nok')
    });
});

router.post('/inProgress', function (req, res, next) {
    let send = {
        pseudoUser: req.body.userName
    };

    res.render('SwapViews/inProgress.html.twig', {result: send});
});

router.post('/getInProgress', function(req, res, next) {
    let optionsSearch = {
        where :{
            idUser: req.cookies.idUser,
            startDate: {
                ne: null
            }
        },
        order: 'asinProduct asc'
    };

    Swap.findAll(optionsSearch).then(function(swaps) {
        let allAsin = [];
        let asinUser = [];
        let pseudoId = [];
        let searchRestrinction = {
            asin: { $in : allAsin }
        };

        for(var product of swaps) {
            allAsin.push(product.asinProduct);
            asinUser.push({asin: product.asinProduct, idUser: product.idUserTo});

            User.findById(product.idUserTo).then(function(usr) {
                pseudoId.push({id: usr.id, pseudo: usr.pseudo});
            });
        }



        let Product = mongoose.model('Product');
        Product.find(searchRestrinction).then(function(products) {
            let productsUser = getCleanProdutUser(products, asinUser, pseudoId);

            res.send(JSON.stringify(productsUser));
        }).catch(function(err) {
            console.log('Error25 : ' + err);
            res.send('nok');
        });
    }).catch(function(err) {
        console.log('Error24 : ' + err);
        res.send('nok');
    });
});

router.post('/history', function (req, res, next) {
    let send = {
        pseudoUser: req.body.userName
    };

    res.render('SwapViews/history.html.twig', {result: send});
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
            imagesLink: product.imagesLink,
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

function getCleanProdutUser(products, asinIdUser, pseudoId) {
    let clean = [];
    for(let product of products) {
        let newProduct = {
            asin: product.asin,
            title: product.title,
            imgLink: product.imgLink,
            imagesLink: product.imagesLink,
            detailPageURL: product.detailPageURL,
            ean: product.ean,
            public: product.public,
            brand: product.brand,
            group: product.group,
            release: product.release,
            actors: product.actors,
            features: product.features,
            pseudoUser: getPseudoByIdInJSON(getidUsertByAsin(asinIdUser, product.asin), pseudoId)
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

//Retourne l'idUser de l'asin (Recherche dichotomique)
function getidUsertByAsin(asinIdUser, codeAsin) {
    let start = 0;
    let end = asinIdUser.length;
    let middle = asinIdUser.length + 1;

    while(middle != start || middle != end) {
        middle = parseInt((start + end) / 2);

        if (codeAsin == asinIdUser[middle].asin) {
            return asinIdUser[middle].idUser;
        } else if (codeAsin > asinIdUser[middle].asin){
            start = middle;
        } else {
            end = middle;
        }
    }
}

function getPseudoByIdInJSON(search, pseudoId) {
    for (let loop of pseudoId) {
        if (search == loop.id) {
            return loop.pseudo;
        }
    }
}


