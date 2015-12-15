var itc = require("itunesconnect");
var Report = itc.Report;
var Q = require('q');
var prettyjson = require('prettyjson')
// Connect to iTunes
var itunes = new itc.Connect('connectstats@indg.com', 'Dsc729max!');


//helper method for getting deference between current and previous time interval in percents
var getDeltaPercentage = function(currentResult, prevResult){
    if((prevResult)){
        return Math.floor((currentResult-prevResult)/prevResult*100);
    } else return('-')};

var getAppStoreDataByCountryTemp = function(interval, country, callback){
    var finalRes = {}
    var countryKeys = {
        'Italy' : 143450,
        'Spain' : 143454,
        'France' : 143442,
        'Germany' : 143443,
        'UK' : 143444
    }
    var country = country
    itunes.request(Report.ranked().time(1, interval+"s").location(countryKeys[country]), function (error, result) {
        if(error) return error
        if(result){
            //console.log(result);
            var x = result.map(function(app){
                var rObj = {}
                rObj['downloads'] = app.units
                return finalRes[app.title.replace(/ /gi, '')] = rObj
            })
            //console.log(finalRes);
            //console.log(x);
            itunes.request(Report.ranked().time(2, interval+"s").location(countryKeys[country]), function (error, result) {
                if(error) return error
                if(result){
                    //console.log(result);
                    var data = result.map(function(app){
                        console.log(finalRes[app.title.replace(/ /gi, '')]);
                        finalRes[app.title.replace(/ /gi, '')].previousDownloads = app.units - finalRes[app.title.replace(/ /gi, '')].downloads
                        finalRes[app.title.replace(/ /gi, '')].delta = finalRes[app.title.replace(/ /gi, '')].downloads - finalRes[app.title.replace(/ /gi, '')].previousDownloads
                        finalRes[app.title.replace(/ /gi, '')].deltaPercentage = getDeltaPercentage(finalRes[app.title.replace(/ /gi, '')].downloads, finalRes[app.title.replace(/ /gi, '')].previousDownloads )
                        finalRes[app.title.replace(/ /gi, '')].country = country
                        return finalRes
                    })
                    //console.log(data);
                    if(callback) callback(data)
                }
            })
        }
    })
}
var getAppStoreDataByCountry = function(interval, callback){
    var rObj = {}
    getAppStoreDataByCountryTemp(interval, 'Spain', function(data){
        console.log('\n'+data);
        rObj.Spain = data
        getAppStoreDataByCountryTemp(interval, 'Italy', function(data){
            console.log('\n'+prettyjson.render(data));
            rObj.Italy = data
            getAppStoreDataByCountryTemp(interval, 'France', function(data){
                console.log('\n'+data);
                rObj.France = data
                getAppStoreDataByCountryTemp(interval, 'Germany', function(data){
                    console.log('\n'+data);
                    rObj.Germany = data
                    getAppStoreDataByCountryTemp(interval, 'UK'), function(data){
                        console.log('\n'+prettyjson.render(data));
                        rObj.UK = data
                        //console.log(prettyjson.render(rObj));
                        if(callback) callback(rObj)
                    }
                })
            })
        })
    })
}
//getAppStoreDataByCountry('week', 'Spain')

var getAppStoreData = function(interval, callback){

    itunes.request(Report.ranked().time(1, interval+"s"), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
            result.map(function(app){
                var rObj = {}
                rObj['downloads'] = app.units
                finalRes[app.title.replace(/ /gi, '')] = rObj
            })
            itunes.request(Report.ranked().time(2, interval+'s'), function (error, result) {
                if(error) return error
                if(result){
                    result.map(function(app){
                        finalRes[app.title.replace(/ /gi, '')].previousDownloads = app.units - finalRes[app.title.replace(/ /gi, '')].downloads
                        finalRes[app.title.replace(/ /gi, '')].delta = finalRes[app.title.replace(/ /gi, '')].downloads - finalRes[app.title.replace(/ /gi, '')].previousDownloads
                        finalRes[app.title.replace(/ /gi, '')].deltaPercentage = getDeltaPercentage(finalRes[app.title.replace(/ /gi, '')].downloads, finalRes[app.title.replace(/ /gi, '')].previousDownloads )
                    })
                    if(callback) callback(finalRes)
                }
            });
        }
    });

}


module.exports = {
    getAppStoreData: getAppStoreData,
    getAppStoreDataByCountry: getAppStoreDataByCountry
}
//module.exports = getAppStoreDataByCountry

if(process.argv[2]){
    getAppStoreDataByCountry(process.argv[2]);
    getAppStoreData(process.argv[2])
}