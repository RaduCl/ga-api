var googleapis = require('googleapis');
var json2csv = require('json2csv');
var gaResults = [];

var JWT = googleapis.auth.JWT;
var analytics = googleapis.analytics('v3');

//var SERVICE_ACCOUNT_EMAIL = '497642813566-pbindqmqoj01s01gjcafchkrubqo8lkd@developer.gserviceaccount.com';//my email
var SERVICE_ACCOUNT_EMAIL = '861670132384-kftaau08jonkrcemo8sq5slqr6lrk3l2@developer.gserviceaccount.com';//DRB email
//var SERVICE_ACCOUNT_EMAIL = '235882346313-gjaeilnvgj0p6kt5akpa4uokds0va2u0%40developer.gserviceaccount.com;//chris email
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/keyDRB.pem';


var authClient = new JWT(
  SERVICE_ACCOUNT_EMAIL,
  SERVICE_ACCOUNT_KEY_FILE,
  null,
  ['https://www.googleapis.com/auth/analytics.readonly']
);

const IDS = 'ga:110318051';//DRB viewID
//var ids = 'ids': 'ga:110116145',//my viewID
//var ids ='ids': 'ga:105895952', // chris viewID


// Query objects used in getData()



var baseQuery = {
    auth: authClient,
    'ids': IDS
}

function getData(callback, query){
    var resultQuery = {};
    for (var attrname in baseQuery) { resultQuery[attrname] = baseQuery[attrname]; }
    for (var attrname in query) { resultQuery[attrname] = query[attrname]; }
    //console.log(resultQuery)
    authClient.authorize(function(err, tokens) {
        if (err) {
            console.error(err);
        }
        // building the query
        analytics.data.ga.get(resultQuery, function(err, result) {
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


//var data = getData(returnResult);
//console.log("datata is:" + data)
module.exports = getData;
//module.exports = getData(returnResult);
//module.exports = getData;