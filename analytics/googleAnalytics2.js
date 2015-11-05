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


authClient.authorize(function(err, tokens) {
  if (err) {
      console.error(err);
  }
  // building the query
  analytics.data.ga.get({
      auth: authClient,
      'ids': 'ga:110116145',
      'start-date': '2015-02-11',
      'end-date': '2015-10-25',
      'metrics': 'ga:visits',
      //'dimensions': 'ga:browser,ga:city,ga:sessionDurationBucket'
  }, function(err, result) {
      if(err)
          console.error(err)
      if(result){
        // console.log(result);
        gaResults.push(result);
        // return result
      }
  })
})


console.log("getData is:" + gaResults[0])

module.exports = gaResults;
