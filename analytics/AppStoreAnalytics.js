var itc = require("itunesconnect");
var Report = itc.Report;
var Q = require('q');
// Connect to iTunes
var itunes = new itc.Connect('connectstats@indg.com', 'Dsc729max!');
var finalRes = {
    week : 0,
    month: 0,
    previousWeek: 0,
    previousMonth: 0,
    monthDelta: 0,
    weekDelta: 0
}

//helper method for getting deference between current and previous time interval in percents
var getDeltaPercentage = function(currentResult, prevResult){
    return -Math.floor(100 - currentResult*100/prevResult);
};
//helper method to format by country respone object
var formatByCountry = function(result, callback){
    var res = {}
    for(var i=0; i< result.length; i++){
        res[result[i].title] = result[i].units
    }
    callback(res)
}

var getAppStoreDataByCountry = function(interval, callback){
    //helper method for getting deference between current and previous time interval in percents

    itunes.request(Report.ranked().time(1, interval+"s").group('location'), function (error, result) {
        var finalRes = []
        var tempRes = {}
        if(error) return error
        if (result){
            formatByCountry(result,function(res){
                tempRes.res1=res
            })
            itunes.request(Report.ranked().time(2, interval+'s').group('location'), function (error, result) {
                if(error) return error
                formatByCountry(result,function(res){
                    tempRes.res2=res

                    var countries = Object.keys(tempRes.res1).slice(0,5)
                    finalRes = countries.map(function(country){
                        var countryObj={}
                        countryObj.name=country
                        countryObj.downloads = tempRes.res1[country]
                        countryObj.previousDownloads = tempRes.res2[country]-tempRes.res1[country]
                        countryObj.delta = countryObj.downloads - countryObj.previousDownloads
                        countryObj.deltaPercentage = getDeltaPercentage(countryObj.downloads, countryObj.previousDownloads)
                        return countryObj
                    })

                    //format othercountries downloads stats
                    //TODO check why not deltaPercentage is NaN
                    var otherCountries = {}

                    otherCountries.name = 'Other countries'

                    otherCountries.downloads = Object.keys(tempRes.res1).slice(4).map(function(country){
                        return tempRes.res1[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0)
                    //console.log('otherCountries.downloads: '+otherCountries.downloads);

                    otherCountries.previousDownloads = Object.keys(tempRes.res1).slice(4).map(function(country){
                        return tempRes.res2[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0)
                    //console.log('otherCountries.previousDownloads: '+otherCountries.previousDownloads);

                    otherCountries.delta = otherCountries.downloads - otherCountries.previousDownloads
                    otherCountries.deltaPercentage = getDeltaPercentage(otherCountries.downloads - otherCountries.previousDownloads)
                    console.log('otherCountries: '+JSON.stringify(otherCountries));

                    //format total downlods stats
                    //TODO check why not all stats are saved
                    var totalDl = {}
                    totalDl.name = 'Total Downloads'
                    totalDl.downloads = Object.keys(tempRes.res1).map(function(country){
                        return tempRes.res1[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0)
                    //console.log('totalDl.downloads: '+totalDl.downloads);

                    totalDl.previousDownloads = Object.keys(tempRes.res1).map(function(country){
                        return tempRes.res2[country]
                    }).reduce(function(prev, current){
                        return prev+current
                    },0)
                    //console.log('totalDl.previousDownloads: '+totalDl.previousDownloads);
                    //console.log('totalDl: '+JSON.stringify(totalDl));
                    finalRes.push(otherCountries, totalDl);
                    //console.log('finalRes: ' + JSON.stringify(finalRes));
                    if(callback) callback(finalRes)
                })
            })
        }
    });
}

var getAppStoreData = function(interval, callback){

    itunes.request(Report.ranked().time(1, interval+"s"), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
            finalRes.downloads = result[0].units;
            itunes.request(Report.ranked().time(2, interval+'s'), function (error, result) {
                if(error) return error
                if(result){
                    finalRes.previousDownloads = result[0].units - finalRes.downloads;
                    finalRes.delta = finalRes.downloads - finalRes.previousDownloads;
                    finalRes.deltaPercentage = getDeltaPercentage(finalRes.downloads, finalRes.previousDownloads);
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
}