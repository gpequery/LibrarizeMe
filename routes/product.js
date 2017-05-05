'use strict';

const express = require('express');
const models = require('../models');
const Product = models.Product;
const router = express.Router();
const amazon = require('amazon-product-api');

router.get('/', function(req, res, next) {
    res.send('PRODUCT');
});

router.post('/search', function(req, res, next) {
    let send = {
        pseudoUser: req.body.userName
    };

    res.render('LibraryViews/search.html.twig', {result: send});
});

router.post('/searchCode', function(req, res, next) {
    let client = amazon.createClient({
        awsId: "AKIAI5YSR3G6ZLTSRIIQ",
        awsSecret: "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",
        awsTag: "librarize077-21"
    });

    client.itemSearch({
        Operation: 'ItemSearch',
        searchIndex: req.body.searchIndex,
        Keywords: req.body.code,
        responseGroup: 'ItemAttributes, Images',
        ItemPage: req.body.page,
        domain: 'webservices.amazon.fr'
    }, function(err, results, response) {
        if (!err) {
            res.send(results);
        } else {
            console.log('ERROR 18 : ' + err);
            res.send('Nok');
        }
    });
});

router.get('/getInfoProduct', function(req, res, next) {
   res.send('PARAMS : ' + JSON.parse(req.query.infoProduct));
});

router.get('/searchCode', function(req, res, next) {
    let client = amazon.createClient({
        awsId: "AKIAI5YSR3G6ZLTSRIIQ",
        awsSecret: "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",
        awsTag: "librarize077-21"
    });


    client.itemSearch({
        Operation: 'ItemSearch',
        searchIndex: 'All',
        Keywords: 'Star Wars',
        responseGroup: 'ItemAttributes, Images',
        ItemPage: 1,
        domain: 'webservices.amazon.fr'
    }, function(err, results, response) {
        if (!err) {
            res.send(results);
        } else {
            console.log('ERROR 18 : ');
            res.send('Nok' + JSON.stringify(err));
        }
    });
});

module.exports = router;

function getResultAmazon() {


}
