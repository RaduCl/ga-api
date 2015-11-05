var googleapis = require('googleapis');
var json2csv = require('json2csv');

var gaResults = [];

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

var getData = authClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }
    // building the query
    analytics.data.ga.get({
        auth: authClient,
        'ids': 'ga:110116145',
        'start-date': '2015-02-11',
        'end-date': '2015-10-25',
        // 'metrics': 'ga:visits, ga:sessionDuration',
        'metrics': 'ga:visits',
        'dimensions': 'ga:browser,ga:city,ga:sessionDurationBucket'
    }, function(err, result) {
        if(err)
            gaResults.push(err);
        if(result){
            return result;
            // gaResults.push(result);
            // exportCSV(gaResults);
            //gaResults.push(result);
            //gaResults = Object.assign({}, result);
            //console.log(gaResults);
            //console.log(JSON.stringify(gaResults.rows));
        }
    });
});

function exportCSV (gaResults) {
    var fields = gaResults[0].columnHeaders.map(function(header){
        return fields = header.name;
    });
    var data = gaResults[0].rows.map(function(row){
        console.log("row.key is: " + fields[row.key]);
    });
    console.log("table header: " + fields);
    console.log("rows: " + data);
    json2csv({data:data, fields:fields}, function(err, csv){
        if (err) console.log(err);
        console.log("csv is here" + csv);
    });
}

module.exports = getData;
// module.exports = gaResults;
// module.exports = exportCSV;
