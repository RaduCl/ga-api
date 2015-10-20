var googleapis = require('googleapis');
var JWT = googleapis.auth.JWT;
var analytics = googleapis.analytics('v3');

var SERVICE_ACCOUNT_EMAIL = '497642813566-pbindqmqoj01s01gjcafchkrubqo8lkd@developer.gserviceaccount.com';
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/key.pem';


var authClient = new JWT(
    SERVICE_ACCOUNT_EMAIL,
    SERVICE_ACCOUNT_KEY_FILE,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']
);

var googleAnalyticsData = authClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
    // building the query
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110116145',
        'start-date': '2015-07-19',
        'end-date': '2015-08-19',
        'metrics': 'ga:visits'
    }, function(err, result) {
        console.log(err);
        console.log(result);
    });
});

module.exports = googleAnalyticsData;