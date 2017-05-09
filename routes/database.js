'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', function(req, res, next) {
   res.send('COUCOU MONGOOSE !!');
});

router.get('/reset', function(req, res, next) {
    let Product = mongoose.model('Product');

    Product.remove(function (err) {
        if (err) {
            res.send('ERROR --> no product removed : ' + err);
        }
        res.send('Product removed !');
    });
});

router.get('/addProduct', function(req, res, next) {
    let Product = mongoose.model('Product');

    let newProduct = new Product({
            asin: '36',
            title: 'String',
            imgLink: 'String',
            detailPageURL: 'String',
            ean: 'String',
            public: 'String',
            brand: 'String',
            group: 'String',
            release: 'String',
            imagesLink: 'String',
            actors: 'String',
            features: 'String'
    });

    newProduct.save(function (err) {
        if (err) {
            res.send('ERROR --> Add product : ' + err);
        } else {
            res.send('ADD !');
        }
    });
});

router.get('/printProduct', function(req, res, next) {
    let Product = mongoose.model('Product');

    Product.find(null, function (err, products) {
        if (err) {
            res.send('ERROR --> print product : ' + err);
        }
        res.send(products.toString());
    });
});


//////////////////////////////////////////////////////////
/*******************************************************/
/******************************************************/
/*****************************************************/
//////////////////////////////////////////////////////
router.post('/addProduct', function(req, res, next) {
    let Product = mongoose.model('Product');

    Product.find({'asin': req.body.asin}, function (err, products) {
        if (err) {
            console.log('ERROR --> search product : ' + err);
            res.send('Nok');
        }

        if (products.length == 0) {
            let newProduct = new Product({
                asin: req.body.asin,
                title: req.body.title,
                imgLink: req.body.imgLink,
                detailPageURL: req.body.detailPageURL,
                ean: req.body.ean,
                public: req.body.public,
                brand: req.body.brand,
                group: req.body.group,
                release: req.body.release,
                imagesLink: req.body.imagesLink,
                actors: req.body.actors,
                features: req.body.features
            });

            newProduct.save(function (err) {
                if (err) {
                    console.log('ERROR --> Add product : ' + err);
                    res.send('Nok');
                } else {
                    res.send('Ok');
                }
            });
        } else {
            res.send('Ok2');
        }
    });
});

module.exports = router;