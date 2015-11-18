var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	router.get('/', function(req, res) {
		res.redirect('/login')
	});

    /* GET login page. */
	router.get('/login', function(req, res){
        // Display the Login page with any flash message, if any
        res.render('login', {
            title: 'Login',
            message: req.flash('message')
        });
    })

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

    /* GET Dashboard Page */
	//TODO in production secure this route by using isAuthenticated param
	router.get('/dashboard', function(req, res){
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

	/* GET  google analytics data */
	//TODO in production secure this route by using isAuthenticated param
	router.get('/ga-data', function(req, res){

		var testQuery = require('../analytics/AnalyticsQueries')
		//console.log("\n \n queryTest.osQuery is: " + Object.parse(testQuery.osQuery))
		var data = []
		var googleAnalytics = require('../analytics/googleAnalytics2');
		//var i=0;
		//var queryLength = Object.keys(querie).length;

		//for(var q in querie){
		//	//console.log('\n \n \n querie.q is: ' + querie[q])
        //
		//	googleAnalytics(function (err, result){
        //
		//		if(err) return console.log(err)
		//		if(result){
		//			i++;
		//			console.log('\n \n \n i is: ' + i)
		//			console.log('\n \n \n q in query is: ' + q)
		//			var queryResults = {}
		//			queryResults[q] = result.rows
		//			data.push(queryResults)
		//			console.log('\n \n \n' + 'data is: ' + data)
		//			//res.send(result);
		//		}
		//		//console.log('querie.i is: ' + i)
		//		if(i==queryLength-1)
		//		{
		//			console.log(data)
		//			res.send(data)
		//		}
		//	}, querie[q])
		//}


		googleAnalytics(function (err, result){
			if(err) return console.log(err)
			if(result){
				data.push(result.rows)
				res.send(result.rows);
			}
		}, testQuery.osQuery)

	});

	return router;
}





