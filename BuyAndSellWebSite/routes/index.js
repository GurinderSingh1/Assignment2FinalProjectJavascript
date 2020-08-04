'use strict';
var express = require('express');
var router = express.Router();
var adsModel = require('../models/ads');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var passport = require('passport');
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function (req, res) {
    try {
        //Retrieve all articles if there is any 
        adsModel.find({}, function (err, foundAds) {
            console.log(err);
            console.log(foundAds);
            //Pass found articles from server to pug file
            res.render('index', { ads: foundAds });
        });
    } catch (err) {
        console.log(err);
        res.render('index', { title: 'Express' });
    }
});

/* GET insert page. */
router.get('/insert', function (req, res) {
    res.render('insert');
});

/* GET update page. */
router.get('/update', function (req, res) {
    res.render('update');
});

/* POST insert page */
router.post('/insert', function (req, res) {
    var form = new formidable.IncomingForm();
    //Specify our image file directory
    form.uploadDir = path.join(__dirname, '../public/images');
    form.parse(req, function (err, fields, files) {
        console.log('Parsed form.');
        //Update filename
        files.image.name = fields.name + '.' + files.image.name.split('.')[1];
        //Create a new article using the Articles Model Schema
        const ad = new adsModel({ name: fields.name, description: fields.description, price: fields.price });
        //Insert article into DB
        ad.save(function (err) {
            console.log(err);
        });
        //Upload file on our server
        fs.rename(files.image.path, path.join(form.uploadDir, files.image.name), function (err) {
            if (err) console.log(err);
        });
        console.log('Received upload');
    });
    form.on('error', function (err) {
        console.log(err);
    });
    form.on('end', function (err, fields, files) {
        console.log('File successfuly uploaded');
        //res.end('File successfuly uploaded');
        res.send({ "success": "We have received your message, please wait a day for a response." });
    });
});

/* GET update page */
router.get('/update/:id', function (req, res) {
    adsModel.findById(req.params.id, function (err, foundAds) {
        if (err) console.log(err);
        //Render update page with specific article
        else
            res.render('update', { ad: foundAds });
    });
});

/*POST update page */
router.post('/update', function (req, res) {
    console.log(req.body);
    //Find and update by id
    adsModel.findByIdAndUpdate(req.body.id, { name: req.body.name, description: req.body.description, price: req.body.price }, function (err) {
        if (err)
            console.log(err);
        else
            res.redirect('/');
    });
});

/* POST delete page*/
router.post('/delete/:id', function (req, res) {
    //Find and delete article
    adsModel.findByIdAndDelete(req.params.id, function (err) {
        res.send({ "success": "Ad Successfully Deleted!" });
    });
});

/*GET for login*/
router.get('/login', function (req, res) {
    res.render('login');
});

/*POST for login*/
//Try to login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

/*POST for register*/
router.post('/register', function (req, res) {
    //Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        };
        //Check if user already exists
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (user.length) return res.redirect('/login');
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('Inserting');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    });
});

/*GET for register*/
router.get('/register', function (req, res) {
    res.render('register');
});




module.exports = router;
