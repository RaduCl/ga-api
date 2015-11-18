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


//var data = {}
//var googleAnalytics = require('../analytics/googleAnalytics2');
////var googleAnalytics = require('../analytics/visitorTypes');
//var i=0;
//var queryLength = Object.keys(querie).length;
//
//for(var q in querie){
//	//console.log('\n \n \n querie.q is: ' + querie[q])
//
//	googleAnalytics(function (err, result){
//
//		if(err) return console.log(err)
//		if(result){
//			i++;
//			console.log('\n \n \n i is: ' + i)
//
//			data[q] = result.rows
//			console.log('\n \n \n' + 'data is: ' + data.q)
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

//for(var i=0; i< queryLength; i++){
//	//console.log('\n \n \n querie.q is: ' + querie[q])
//	console.log('\n \n \n i is: ' + i)
//	console.log('\n \n \n querie[i] is: ' + querie)
//	googleAnalytics(function (err, result){
//
//		if(err) return console.log(err)
//		if(result){
//			data[i] = result.rows
//			console.log('\n \n \n' + 'data is: ' + data.i)
//			//res.send(result);
//		}
//		console.log('querie.i is: ' + i)
//		if(i==queryLength-1)
//		{
//			console.log(data)
//			res.send(data)
//		}
//	}, querie[i])
//}

//var osQuery = {
//    auth: authClient,
//    'ids': IDS,
//    'start-date': '2015-02-11',
//    'end-date': '2015-11-05',
//    'metrics': 'ga:visits',
//    'dimensions': 'ga:operatingSystemVersion, ga:operatingSystem'
//}
//
//var countryVisitsQuery = {
//    auth: authClient,
//    'ids': IDS,
//    'start-date': '2015-02-11',
//    'end-date': '2015-11-05',
//    'metrics': 'ga:visits',
//    'dimensions': 'ga:country'
//}
//
//var dailyUsersQuery = {
//    auth: authClient,
//    'ids': IDS,
//    'start-date': '2015-02-11',
//    'end-date': '2015-11-05',
//    'metrics': 'ga:1dayUsers',
//    'dimensions': 'ga:date'
//}
//
//var frequencyQuery = {
//    auth: authClient,
//    'ids': IDS,
//    'start-date': '2015-02-11',
//    'end-date': '2015-11-05',
//    'metrics': 'ga:sessions',
//    'dimensions': 'ga:daysSinceLastSession'
//}
//
//var loyaltyQuery = {
//    auth: authClient,
//    'ids': IDS,
//    'start-date': '2015-10-22',
//    'end-date': '2015-11-08',
//    'metrics': 'ga:sessions',
//    'dimensions': 'ga:sessionCount'
//}
//
//var visitorTypesQuery = {
//    auth: authClient,
//    'ids': IDS,
//    'start-date': '2015-10-22',
//    'end-date': '2015-11-08',
//    'metrics': 'ga:visits',
//    'dimensions': 'ga:userType'
//}