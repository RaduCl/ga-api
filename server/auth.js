var auth = require('basic-auth');

var admins = {
    'art@vandelay-ind.org': { password: 'pa$$w0rd!' },
};


module.exports = function(req, res, next) {

    var user = auth(req);
    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).send();
    }
    return next();
};
