var googleapis = require('googleapis');
var JWT = googleapis.auth.JWT;
var analytics = googleapis.analytics('v3');
var inputResult;

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
        inputResult = result;
        console.log(result);
    });
});
var json2csv = require('json2csv');
var fields = ['kind', 'id', 'itemsPerPage'];
json2csv({ data: inputResult, fields: fields }, function (err, csv) {
    if (err) console.log(err);
    console.log(csv);
    });

module.exports = googleAnalyticsData;