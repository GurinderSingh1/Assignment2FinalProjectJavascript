const mongoose = require('mongoose');
//Create Schema
const adsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    }

});
//Create and instantiate model with schema
const ads = mongoose.model("Ads", adsSchema);
module.exports = ads;