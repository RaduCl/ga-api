var itc = require("itunesconnect");
var Report = itc.Report;

// Connect to iTunes 
var itunes = new itc.Connect('apple@id.com', 'password');

// Simple ranked report 
itunes.request(Report.ranked().time(10, 'days'), function (error, result) {
    console.log(result);
});

// Or 
itunes.request(Report('timed').time(3, 'weeks').interval('week'), function (error, result) {
    console.log(result);
});