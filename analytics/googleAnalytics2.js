var googleapis = require('googleapis');
var json2csv = require('json2csv');

var JWT = googleapis.auth.JWT;
var analytics = googleapis.analytics('v3');

var SERVICE_ACCOUNT_EMAIL = 'account-1@yamaha-1118.iam.gserviceaccount.com';//Yamaha email
//var SERVICE_ACCOUNT_EMAIL = '497642813566-pbindqmqoj01s01gjcafchkrubqo8lkd@developer.gserviceaccount.com';//my email
//var SERVICE_ACCOUNT_EMAIL = '861670132384-kftaau08jonkrcemo8sq5slqr6lrk3l2@developer.gserviceaccount.com';//DRB email
//var SERVICE_ACCOUNT_EMAIL = '235882346313-gjaeilnvgj0p6kt5akpa4uokds0va2u0%40developer.gserviceaccount.com;//chris email

var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/keyYamaha.pem';


var authClient = new JWT(
  SERVICE_ACCOUNT_EMAIL,
  SERVICE_ACCOUNT_KEY_FILE,
  null,
  ['https://www.googleapis.com/auth/analytics.readonly']
);

//const IDS = 'ga:110318051';//DRB viewID
const IDS = 'ga:105895952';//INDG viewID
//const ids = 'ids': 'ga:110116145',//my viewID
//const ids ='ids': 'ga:105895952', // chris viewID



var baseQuery = {
    auth: authClient,
    'ids': IDS
}

function getData(callback, query, queryKey){
    var resultQuery = {};
    for (var attrname in baseQuery) { resultQuery[attrname] = baseQuery[attrname]; }
    for (var attrname in query) { resultQuery[attrname] = query[attrname]; }

    authClient.authorize(function(err, tokens) {
        if (err) {
            console.error(err);
        }
        // building the query
        analytics.data.ga.get(resultQuery, function(err, result) {
            if(err)
                console.error(err)
            if(result){
                callback(err, result, queryKey)
            }
        })
    })
}


module.exports = getData;
