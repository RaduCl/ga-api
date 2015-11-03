
//routes
module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        if (req.user)
            res.redirect('/dashboard')
        else
            res.redirect('login')
    })


    app.get('/login', function (req, res) {
        res.render('login',
            {
                title: 'Login',
                message: req.flash('loginMessage')
            }
        );
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash : true // allow flash messages
        })
    )

    //logs user out of site, deleting them from the session, and returns to homepage
    //app.get('/logout', function (req, res) {
    //    var name = req.user.username;
    //    console.log("LOGGIN OUT " + req.user.username)
    //    req.logout();
    //    res.redirect('/');
    //    req.session.notice = "You have successfully been logged out " + name + "!";
    //});

    app.get('/dashboard', isLoggedIn, function (req, res) {
        res.render('dashboard',
            {title: 'Yamaha Dashboard'}
        )
    })
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}