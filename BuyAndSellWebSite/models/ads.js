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
    }
    

});
//Create and instantiate model with schema
const Ads = mongoose.model("Ads", adsSchema);
module.exports = Ads;