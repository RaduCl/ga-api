var googleapis = require('googleapis');
var json2csv = require('json2csv');
var gaResults = [];

var JWT = googleapis.auth.JWT;
var analytics = googleapis.analytics('v3');

var SERVICE_ACCOUNT_EMAIL = '497642813566-pbindqmqoj01s01gjcafchkrubqo8lkd@developer.gserviceaccount.com';//my email
//var SERVICE_ACCOUNT_EMAIL = '235882346313-gjaeilnvgj0p6kt5akpa4uokds0va2u0%40developer.gserviceaccount.com;//chris email
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/key.pem';


var authClient = new JWT(
  SERVICE_ACCOUNT_EMAIL,
  SERVICE_ACCOUNT_KEY_FILE,
  null,
  ['https://www.googleapis.com/auth/analytics.readonly']
);

function getData(callback){
    authClient.authorize(function(err, tokens) {
        //console.log('hello from getData')
        if (err) {
            console.error(err);
        }
        // building the query
        analytics.data.ga.get({
            auth: authClient,
            'ids': 'ga:110116145',//my viewID
            //'ids': 'ga:105895952',
            'start-date': '2015-02-11',
            'end-date': '2015-10-25',
            'metrics': 'ga:visits',
            //'dimensions': 'ga:browser,ga:city,ga:sessionDurationBucket'
        }, function(err, result) {
            if(err)
                console.error(err)
            if(result){
                //console.log("reuslt is: " + result)
                gaResults.push(result);
                //console.log("gaResults inside" + gaResults+"\n");
                console.log("intru in callback")
                callback(err, result)
            }
        })
    })
}

function returnResult(err, result){
    if(err) return console.log(err)
    if(result){
        //console.log("The result is inside callback:" + JSON.stringify(gaResult))
        console.log("Result inside callback is" + result);
        return result;
    }
}

getData(returnResult);

module.exports = gaResults;
//module.exports = getData(returnResult);
//module.exports = getData;