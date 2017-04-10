'use strict';

const express = require('express');
const models = require('../models');
const Product = models.Product;
const router = express.Router();


router.get('/', function(req, res, next) {
    res.send('PRODUCT');
});

module.exports = router;