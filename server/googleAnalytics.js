var googleapis = require('googleapis');
var JWT = googleapis.auth.JWT;
var analytics = googleapis.analytics('v3');
var inputResult;

var SERVICE_ACCOUNT_EMAIL = '861670132384-kftaau08jonkrcemo8sq5slqr6lrk3l2@developer.gserviceaccount.com';
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/key2.pem';


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
        'ids': 'ga:110318051',
        'start-date': '2015-10-20',
        'end-date': '2015-11-03',
        'metrics': 'ga:visits',
        'dimensions': 'ga:country'
    }, function(err, result) {
        console.log(err);
        inputResult = result;
        console.log(result);
    });
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110318051',
        'start-date': '2015-10-20',
        'end-date': '2015-11-03',
        'metrics': 'ga:visits',
        'dimensions': 'ga:userType'
    }, function (err, result) {
        console.log(err);
        inputResult = result;
        console.log(result);
    });
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110318051',
        'start-date': '2015-10-20',
        'end-date': '2015-11-03',
        'metrics': 'ga:visits',
        'dimensions': 'ga:operatingSystemVersion'
    }, function (err, result) {
        console.log(err);
        inputResult = result;
        console.log(result);
    });
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110318051',
        'start-date': '2015-10-20',
        'end-date': '2015-11-03',
        'metrics': 'ga:1dayUsers',
        'dimensions': 'ga:date'
    }, function (err, result) {
        console.log(err);
        inputResult = result;
        console.log(result);
    });
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110318051',
        'start-date': '2015-10-20',
        'end-date': '2015-11-03',
        'metrics': 'ga:sessions',
        'dimensions': 'ga:sessionCount'
    }, function (err, result) {
        console.log(err);
        inputResult = result;
        console.log(result);
    });
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110318051',
        'start-date': '2015-10-20',
        'end-date': '2015-11-03',
        'metrics': 'ga:sessions',
        'dimensions': 'ga:daysSinceLastSession'
    }, function (err, result) {
        console.log(err);
        inputResult = result;
        console.log(result);
    });
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110318051',
        'start-date': '2015-10-20',
        'end-date': '2015-11-03',
        'metrics': 'ga:totalEvents',
        'dimensions': 'ga:eventLabel'
    }, function (err, result) {
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
