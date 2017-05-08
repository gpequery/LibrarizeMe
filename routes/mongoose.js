'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    mongoose.connect("mongodb://Librarize:Librarize3@librarize-shard-00-00-axp2s.mongodb.net:27017,librarize-shard-00-01-axp2s.mongodb.net:27017,librarize-shard-00-02-axp2s.mongodb.net:27017/Librarize?ssl=true&replicaSet=Librarize-shard-0&authSource=admin", function(err) {
        if (err) {
            console.log('ERR : ' + err);
            throw err;
        }
    });




    let user = mongoose.Schema({
        userId: String
    });


    var Kitten = mongoose.model('Kitten', kittySchema);
    Kitten.remove({ name : 'Silence' }, function (err) {
        if (err) { throw err; }
        console.log('Commentaires avec pseudo Nikita supprimés !');
    });
    // var silence = new Kitten({ name: 'Silence' });
    // console.log(silence.name);
    //
    // silence.save(function (err) {
    //     if (err) { throw err; }
    //     console.log('Commentaire ajouté avec succès !');
    //     // On se déconnecte de MongoDB maintenant
    // });

    Kitten.find(null, function (err, kittens) {
        if (err) {
            return console.error(err);
        }
        console.log(kittens);
    });

   res.send('COUCOU MONGOOSE !!');
});

module.exports = router;
