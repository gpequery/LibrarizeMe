const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    asin: { type: String, unique: true },
    title: String,
    imgLink: String,
    detailPageURL: String,
    ean: String,
    public: String,
    brand: String,
    group: String,
    release: String,
    imagesLink: String,
    actors: String,
    features: String
});

module.exports = mongoose.model('Product', productSchema);