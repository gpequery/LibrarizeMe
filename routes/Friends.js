'use strict';

const express = require('express');
const models = require('../models');
const Friends = models.Friends;
const router = express.Router();

const app = express();


//Affiche la page de recherche d'amis
router.post('/searchFriends', function(req, res, next) {
    res.send('Coucou Friends LAAA');
});


module.exports = router;