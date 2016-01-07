var prettyjson = require('prettyjson')
module.exports = function(timeInterval){
    var timeInterval = timeInterval
    //var selectedCountry = selectedCountry
    //var selectedApp = selectedApp
    console.log('timeInterval inside queries is: '+timeInterval);
    function setToday(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return today = yyyy+'-'+mm+'-'+dd;
    }

    function setWeekAgo(referenceDate){
        var oneWeekAgo = typeof referenceDate !== 'undefined' ? new Date(referenceDate) : new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        var dd = oneWeekAgo.getDate();
        var mm = oneWeekAgo.getMonth()+1; //January is 0!
        var yyyy = oneWeekAgo.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return oneWeekAgo = yyyy+'-'+mm+'-'+dd;
    }

    function setMonthAgo(referenceDate){
        var monthAgo = typeof referenceDate !== 'undefined' ? new Date(referenceDate) : new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        var dd = monthAgo.getDate();
        var mm = monthAgo.getMonth()+1; //January is 0!
        var yyyy = monthAgo.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return monthAgo = yyyy+'-'+mm+'-'+dd;
    }

    //TODO not sure if this returns correct date
    function setYearToDate(){
        var monthAgo = new Date();
        var yyyy = monthAgo.getFullYear();
        return monthAgo = yyyy+'-'+'01'+'-'+'01';
    }


    var setStartData = function(timeInterval){
        var startDate = ''
        var startDatePrev = ''
        switch (timeInterval) {
            case 'week':
                startDate = setWeekAgo()
                startDatePrev = setWeekAgo(startDate)
                break;
            case 'month':
                startDate = setMonthAgo()
                startDatePrev = setMonthAgo(startDate)
                break;
            case 'year':
                startDate = setYearToDate()
                startDatePrev = setYearToDate(startDate)
                break;
        }
        return {startDate: startDate, startDatePrev: startDatePrev}
    }


    var startDate = setStartData(timeInterval).startDate
    var startDatePrev = setStartData(timeInterval).startDatePrev

    var endDate = setToday();
    var endDatePrev = startDate;
    //Query objects used in getData()
    var bdqueries = function(selectedApp, selectedCountry){

        this.visitorTypesQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:users',
            'dimensions': 'ga:userType',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp :'ga:appID=='+selectedApp
        }

        this.visitorTypesQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:users',
            'dimensions': 'ga:userType',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp :'ga:appID=='+selectedApp
        }

        this.osQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystem, ga:operatingSystemVersion',
            'sort': '-ga:visits',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp :'ga:appID=='+selectedApp
        }
        this.osQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystem, ga:operatingSystemVersion',
            'sort': '-ga:visits',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp :'ga:appID=='+selectedApp
        }

        this.frequencyQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp :'ga:appID=='+selectedApp
        }
        this.frequencyQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp :'ga:appID=='+selectedApp
        }

        this.AndroidLoyaltyQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==Android;ga:appID=='+selectedApp
        }
        this.AndroidLoyaltyQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==Android;ga:appID=='+selectedApp
        }

         this.AndroidDownloadsQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:newUsers',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==Android;ga:appID=='+selectedApp
        }
        this.AndroidDownloadsQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:newUsers',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==Android;ga:appID=='+selectedApp
        }

        this.iOSLoyaltyQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==Android;ga:appID=='+selectedApp
        }
        this.iOSLoyaltyQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==Android;ga:appID=='+selectedApp
        }

        //new tabels queries
        this.popularBikesQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventCategory==Bike;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:eventCategory==Bike;ga:appID=='+selectedApp,
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        }
        this.popularBikesQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventCategory==Bike;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:eventCategory==Bike;ga:appID=='+selectedApp,
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        }

        this.popularPartsQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventCategory==Part;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventCategory==Part;ga:appID=='+selectedApp,
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        }
        this.popularPartsQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventCategory==Part;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventCategory==Part;ga:appID=='+selectedApp,
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        }

        this.AndroidExitQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:operatingSystem==Android;ga:appID=='+selectedApp,
            'sort': '-ga:visits',
            'max-results': 10
        }
        this.AndroidExitQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': selectedCountry ? 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:operatingSystem==Android;ga:appID=='+selectedApp,
            'sort': '-ga:visits',
            'max-results': 10
        }

        this.iOSExitQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': selectedCountry ? 'ga:operatingSystem==iOS;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==iOS;ga:appID=='+selectedApp,
            'sort': '-ga:visits',
            'max-results': 10,
        }
        this.iOSExitQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': selectedCountry ? 'ga:operatingSystem==iOS;ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:operatingSystem==iOS;ga:appID=='+selectedApp,
            'sort': '-ga:visits',
            'max-results': 10,
        }

        this.sharesQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventCategory==Share;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventCategory==Share;ga:appID=='+selectedApp,
        }
        this.sharesQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventCategory==Share;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventCategory==Share;ga:appID=='+selectedApp,
        }

        this.savedConfigsQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': selectedCountry ? 'ga:eventAction==save;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventAction==save;ga:appID=='+selectedApp,
        }
        this.savedConfigsQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': selectedCountry ? 'ga:eventAction==save;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventAction==save;ga:appID=='+selectedApp,
        }

        this.dealerContactedQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventLabel==success;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventLabel==success;ga:appID=='+selectedApp,
        }
        this.dealerContactedQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': selectedCountry ? 'ga:eventLabel==success;ga:country=='+selectedCountry+';ga:appID=='+selectedApp :  'ga:eventLabel==success;ga:appID=='+selectedApp,
        }

        this.averageUsageQuery = {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:avgSessionDuration',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:appID=='+selectedApp
        }
        this.averageUsageQueryPrev = {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:avgSessionDuration',
            'filters': selectedCountry ? 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp : 'ga:appID=='+selectedApp
        }
    }

    var countries = ['France','Italy', 'Spain', 'Germany', 'United Kingdom']
    var apps  = ['com.yamaha.mygarage', 'com.yamaha.mygaragesupersport', 'com.yamaha.mygaragemt']
    var finalQueries = {}
    var generateQueries = function(){
        var queries = require('./AnalyticsQueries')(timeInterval)
        for(var attrname in queries){finalQueries[attrname]=queries[attrname]}
        for(var app in apps){
            var tempQueries = new bdqueries(apps[app]);
            for(var attrname in tempQueries){
                finalQueries[attrname+'_'+apps[app].replace('com.yamaha.', '')] = tempQueries[attrname]
            }
            for(var country in countries){
                var tempQueries = new bdqueries(apps[app], countries[country]);
                for(var attrname in tempQueries){
                    finalQueries[attrname+'_'+apps[app].replace('com.yamaha.', '')+'_'+ countries[country].replace(/ /gi, '')] = tempQueries[attrname]
                }
            }
        }
    }
    generateQueries()
    //TODO remove logs in production
    console.log('finalQueries.length: ' +Object.keys(finalQueries).length);
    console.log("finalQueries :\n"+prettyjson.render(finalQueries));
    return finalQueries;

}

