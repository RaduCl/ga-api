
module.exports = function(timeInterval, selectedCountry, selectedApp){
    var timeInterval = timeInterval
    var selectedCountry = selectedCountry
    var selectedApp = selectedApp
    selectedApp = 'com.yamaha.mygaragemt'
    selectedCountry = 'France'
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
    // Query objects used in getData()
    var bdqueries = {

        bdvisitorTypesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:users',
            'dimensions': 'ga:userType', 
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },

        bdvisitorTypesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:users',
            'dimensions': 'ga:userType',
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },

        //countryVisitsQuery: {
        //    'start-date': startDate,
        //    'end-date': endDate,
        //    'metrics': 'ga:visits',
        //    'dimensions': 'ga:country',
        //    'sort':'-ga:visits',//sort descending
        //    'max-results': 5
        //},

        bdosQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystem, ga:operatingSystemVersion',
            'sort': '-ga:visits',
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
            //'filters': 'ga:visits>60'
            //'output': 'dataTable'
        },
        bdosQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystem, ga:operatingSystemVersion',
            'sort': '-ga:visits',
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },

        // bddailyUsersQuery: {
        //     'start-date': startDate,
        //     'end-date': endDate,
        //     'metrics': 'ga:1dayUsers',
        //     'dimensions': 'ga:date',
        //     'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        // },
        // bddailyUsersQueryPrev: {
        //     'start-date': startDatePrev,
        //     'end-date': endDatePrev,
        //     'metrics': 'ga:1dayUsers',
        //     'dimensions': 'ga:date',
        //     'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        // },

        bdfrequencyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession',
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },
        bdfrequencyQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession',
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },

        bdAndroidLoyaltyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },
        bdAndroidLoyaltyQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },

        bdiOSLoyaltyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==iOS;ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },
        bdiOSLoyaltyQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==iOS;ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },

        //new tabels queries
        bdpopularBikesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:country=='+selectedCountry+';ga:appID=='+selectedApp, 
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },
        bdpopularBikesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:country=='+selectedCountry+';ga:appID=='+selectedApp, 
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        bdpopularPartsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:country=='+selectedCountry+';ga:appID=='+selectedApp, //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },
        bdpopularPartsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:country=='+selectedCountry+';ga:appID=='+selectedApp, //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        bdAndroidExitQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
            'sort': '-ga:visits'
        },
        bdAndroidExitQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==Android;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
            'sort': '-ga:visits'
        },

        bdiOSExitQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==iOS;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
            'sort': '-ga:visits'
        },
        bdiOSExitQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==iOS;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
            'sort': '-ga:visits'
        },

        bdsharesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:country=='+selectedCountry+';ga:appID=='+selectedApp, //ga:operatingSystem==iOS',
        },
        bdsharesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:country=='+selectedCountry+';ga:appID=='+selectedApp, //ga:operatingSystem==iOS',
        },

        bdsavedConfigsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
            // 'dimensions': 'ga:eventAction'
        },
        bdsavedConfigsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
            // 'dimensions': 'ga:eventAction'
        },

        bddealerContactedQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==contactdealer;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
            // 'dimensions': 'ga:eventAction'
        },
        bddealerContactedQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==contactdealer;ga:country=='+selectedCountry+';ga:appID=='+selectedApp,
        },
        bdaverageUsageQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:avgSessionDuration',
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },
        bdaverageUsageQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:avgSessionDuration',
            'filters': 'ga:country=='+selectedCountry+';ga:appID=='+selectedApp
        },
    }

    return bdqueries;

}