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
    if((prevResult)){
        return Math.floor((currentResult-prevResult)/prevResult*100);
    } else return('-')};
//helper method to format by country respone object
var formatByCountry = function(result, callback){
    var res = {}
    for(var i=0; i< result.length; i++){
        res[result[i].title] = result[i].units
    }
    callback(res)
}

var countryKeys = {
    'Italy' : 143450,
    'Spain' : 143454,
    'France' : 143442,
    'Germany' : 143443,
    'UK' : 143444
}

var getAppStoreDataByCountry = function(interval, callback){
    var finalRes = {}
    var tempRes = {}
    for(var country in countryKeys){

        itunes.request(Report.ranked().time(1, interval+"s").location(countryKeys[country]), function (error, result) {
            if(error) return error
            if(result){
                result.map(function(app){
                    var rObj = {}
                    rObj['downloads'] = app.units
                    tempRes[app.title.replace(/ /gi, '')] = rObj
                    //console.log(rObj);
                    return rObj
                })
            }
        })
    }


        //itunes.request(Report.ranked().time(1, interval+"s").location(143450), function (error, result) {
    //    var finalRes = []
    //    var tempRes = {}
    //    if(error) return error
    //    if (result){
    //        console.log(result);
    //        tempRes
    //        //formatByCountry(result,function(res){
    //        //    tempRes.res1=res
    //        //})
    //        console.log(tempRes);
    //        itunes.request(Report.ranked().time(2, interval+'s').location(143450), function (error, result) {
    //            if(error) return error
    //            formatByCountry(result,function(res){
    //                tempRes.res2=res
    //
    //                var countries = Object.keys(tempRes.res1).slice(0,5)
    //                finalRes = countries.map(function(country){
    //                    var countryObj={}
    //                    countryObj.name=country
    //                    countryObj.downloads = tempRes.res1[country]
    //                    countryObj.previousDownloads = tempRes.res2[country]-tempRes.res1[country]
    //                    countryObj.delta = countryObj.downloads - countryObj.previousDownloads
    //                    countryObj.deltaPercentage = getDeltaPercentage(countryObj.downloads, countryObj.previousDownloads)
    //                    return countryObj
    //                })
    //
    //                //format othercountries downloads stats
    //                var otherCountries = {}
    //
    //                otherCountries.name = 'Other countries'
    //                otherCountries.downloads = Object.keys(tempRes.res1).slice(6).map(function(country){
    //                    return tempRes.res1[country]
    //                }).reduce(function(prev, current){
    //                    return prev+current
    //                },0)
    //                otherCountries.previousDownloads = Object.keys(tempRes.res1).slice(6).map(function(country){
    //                    return tempRes.res2[country]
    //                }).reduce(function(prev, current){
    //                    return prev+current
    //                },0);
    //                otherCountries.previousDownloads = otherCountries.previousDownloads - otherCountries.downloads;
    //                otherCountries.delta = otherCountries.downloads - otherCountries.previousDownloads
    //                otherCountries.deltaPercentage = getDeltaPercentage(otherCountries.downloads, otherCountries.previousDownloads)
    //
    //                //format total downlods stats
    //                var totalDl = {}
    //
    //                totalDl.name = 'Total Downloads'
    //                totalDl.downloads = Object.keys(tempRes.res1).map(function(country){
    //                    return tempRes.res1[country]
    //                }).reduce(function(prev, current){
    //                    return prev+current
    //                },0)
    //                totalDl.previousDownloads = Object.keys(tempRes.res1).map(function(country){
    //                    return tempRes.res2[country]
    //                }).reduce(function(prev, current){
    //                    return prev+current
    //                },0)
    //                totalDl.previousDownloads = totalDl.previousDownloads - totalDl.downloads
    //                totalDl.delta = totalDl.downloads - totalDl.previousDownloads
    //                totalDl.deltaPercentage = getDeltaPercentage(totalDl.downloads, totalDl.previousDownloads)
    //                finalRes.push(otherCountries, totalDl);
    //                if(callback) callback(finalRes)
    //            })
    //        })
    //    }
    //});
}

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