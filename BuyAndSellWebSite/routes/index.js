'use strict';
var express = require('express');
var router = express.Router();
var adsModel = require('../models/ads');

/* GET home page. */
router.get('/', function (req, res) {
    try {
        //Create a new ad using the ads Model schema
        const ad = new adsModel({
            name: "Table",
            description: "Brown Colour, square dining table.",
            price: '34.99 dollars',
            /*image: 'public/images/table.jpg'*/
        });
       
        //Retrieve all ads if there is any 
        adsModel.find({}, function (err, foundAd) {
            console.log(err);
            console.log(foundAd);
            //Pass found ad from server to pug file
            res.render('index', { ads: foundAd });
        });
    } catch (err) {
        console.log(err);
        res.render('index', { title: 'There is some error, the data cannot be displayed.' });
    }
});


module.exports = router;
