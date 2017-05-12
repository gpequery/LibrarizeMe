'use strict';

const express = require('express');
const models = require('../models');
const router = express.Router();
const amazon = require('amazon-product-api');
const mongoose = require('mongoose');

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

router.post('/myProducts', function(req, res, next) {
    let send = {
        pseudoUser: req.body.userName
    };

    res.render('LibraryViews/myProducts.html.twig', {result: send});
});

module.exports = router;
