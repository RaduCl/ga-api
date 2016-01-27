var express = require('express');
var router = express.Router();
var Q = require('q');
var dbConfig = require('../db');
var db = require('mongoskin').db(dbConfig.url);//mongo driver for loose data manipulation
var dbSeedData = require('../analytics/bidbFeeder');



//////helper function//////
var getYesterday = function(){
	var today = new Date();
	var currDate = today.getDate();
	today.setDate(currDate-1);
	var yesterday = today.toString();
	return yesterday.slice(0, 15);
};
///////////////////////////

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

module.exports = function(passport){

	router.get('/', function(req, res) {
		res.redirect('/login');
	});

    /* GET login page. */
	router.get('/login', function(req, res){
        // Display the Login page with any flash message, if any
        res.render('login', {
            title: 'Login',
            message: req.flash('message')
        });
    });

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash : true
	}));

	// /* GET Registration Page */
	// router.get('/signup', function(req, res){
	// 	res.render('register',{message: req.flash('message')});
	// });

	//  Handle Registration POST
	// router.post('/signup', passport.authenticate('signup', {
	// 	successRedirect: '/dashboard',
	// 	failureRedirect: '/signup',
	// 	failureFlash : true
	// }));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

    /* GET Dashboard Page */
	//TODO in production secure this route by using isAuthenticated param
	router.get('/dashboard', isAuthenticated, function(req, res){
		res.render('dashboard', {
            user: req.user,
            title: 'Yamaha - Dashboard'
        });
	});


	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/* GET  google all analytics data google API */
	//TODO in production secure this route by using isAuthenticated param
	router.get('/ga-data', function(req, res){

		//get the parametrized partial query objects
		var queries = require('../analytics/AnalyticsQueries');
		//get the google-analytics authentication module
		var googleAnalytics = require('../analytics/googleAnalytics2').getAllData;


		var data = {};
		var i=0;
		var queryLength = Object.keys(queries).length;

		//run all analytics queries
		for(var q in queries){
			googleAnalytics(function (err, result, queryKey){

				if(err) return console.log(err);
				if(result){
					//rename object key with the query key
					data[queryKey] = result.rows;
					i++;
				}
				if(i==queryLength)
				{
					console.log(data);
					res.send(data);
				}
			}, queries[q], q);
		}
	});

	router.get('/appstore-data', function(req, res){
		var AppStoreData = require('../analytics/AppStoreAnalytics');
		AppStoreData('week', function(result){
			//if(err) console.log(err)
			if(result){
				res.json(result);
			}
			//console.log("res is: " + res)
		});
	});

	/* GET  all analytics data from DB for MyGarage stats table */
	router.get('/mygarage-data', isAuthenticated, function(req, res){
		var today = Date().slice(0, 15);
		var yesterday = getYesterday();
		var date = '';
		var allResults = {};

		//check if current date Data is available
		db.collection(dbConfig.collection).findOne({timeInterval: 'week', createDate: today}, function(e, results) {
			if (e) return next(e);
			results ? date = today : date = yesterday
			console.log('Getting data from: ',date);
			db.collection(dbConfig.collection).findOne({timeInterval: 'week', createDate: date}, function(e, results){
				if(e) return next(e);
				if(results) {
					allResults.weekResults = results;
					db.collection(dbConfig.collection).findOne({timeInterval: 'month', createDate: date}, function (e, results) {
						if (e) return next(e);
						if (results) {
							allResults.monthResults = results;
							db.collection(dbConfig.collection).findOne({timeInterval: 'year', createDate: date}, function(e, results){
								allResults.yearResults = results;
								res.send(allResults);
							});
						}
					});
				}
			});
		});
	});


	/* GET  google all analytics data from DB */
	////TODO in production secure this route by using isAuthenticated param
	router.get('/mongo-data', isAuthenticated, function(req, res){
		var today = Date().slice(0, 15);
		db.collection(dbConfig.collection).findOne({timeInterval: 'week', createDate: today}, function(e, results){
			if(e) return next(e);
			res.send(results.Data);
		});
		//res.send('data from mongo')
	});

	var ingest = false;

		/* GET  filtered by time interval all analytics data from DB */
	//TODO in production secure this route by using isAuthenticated param
	router.get('/mongo-data/:timeInterval', function(req, res){
		var today = Date().slice(0, 15);
		var yesterday = getYesterday();
		console.log(today);
		db.collection(dbConfig.collection).findOne({timeInterval: req.params.timeInterval, createDate: today}, function(e, results, next){
			if(e) res.status(500).send(e);
			if(results){
				res.send(results.Data);
			} else {
				//check if ingest is currently running
				if (ingest){
						//res.status(500).send('Ingest curently running. Please return when done.')
						//retrieve previous available data to present
						db.collection(dbConfig.collection).findOne({timeInterval: req.params.timeInterval, createDate: yesterday}, function(e, results, next){
							if(e) res.status(500).send(e);
							if(results){
								res.send(results.Data);
							}
						});
					} else {
						ingest = true;
						var startDate = new Date();
						console.log('Empty db. Starting ingest cycle at: ' + startDate);
						dbSeedData('week',function(){
							dbSeedData('month', function(){
								dbSeedData('year', function(){
									console.log(
										'ingest cycle is done.' +
										'\nStarted: '+ startDate +
										'\nEnded: ' + Date()
									);
									ingest = false;
								});
							});
						});
						//res.status(500).send('Empty db. Return after ingest cycle is done.')
						//retrieve previous available data to present
						db.collection(dbConfig.collection).findOne({timeInterval: req.params.timeInterval, createDate: yesterday}, function(e, results, next){
							if(e) res.status(500).send(e);
							if(results){
								res.send(results.Data);
							}
						});
				}
			}
		});
	});

	return router;
};
