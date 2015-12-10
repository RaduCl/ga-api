
module.exports = function(timeInterval){
    var timeInterval = timeInterval
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
    var queries = {

        visitorTypesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType',
        },

        visitorTypesQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType',
            'filters': 'ga:appID==com.yamaha.mygarage'
        },

        visitorTypesQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType',
            'filters': 'ga:appID==com.yamaha.mygaragemt'
        },

        visitorTypesQuerySS: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType',
            'filters': 'ga:appID==com.yamaha.mygaragesupersport'
        },

        visitorTypesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType'
        },

        visitorTypesQueryPrevMG: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType',
            'filters': 'ga:appID==com.yamaha.mygarage'
        },

         visitorTypesQueryPrevMT: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType',
            'filters': 'ga:appID==com.yamaha.mygaragemt'
        },

         visitorTypesQueryPrevSS: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType',
            'filters': 'ga:appID==com.yamaha.mygaragesupersport'
        },

        AndroidcountryVisitsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'filters': 'ga:operatingSystem==Android',
            'dimensions': 'ga:country',
            'sort': '-ga:visits',//sort descending
            'max-results': 5,
        },
        AndroidcountryVisitsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'filters': 'ga:operatingSystem==Android',
            'dimensions': 'ga:country',
            'sort': '-ga:visits',//sort descending
            'max-results': 5,
        },

        iOScountryVisitsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'filters': 'ga:operatingSystem==iOS',
            'dimensions': 'ga:country',
            'sort': '-ga:visits',//sort descending
            'max-results': 5,
        },
        iOScountryVisitsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'filters': 'ga:operatingSystem==iOS',
            'dimensions': 'ga:country',
            'sort': '-ga:visits',//sort descending
            'max-results': 5,
        },

        osQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystem, ga:operatingSystemVersion',
            'sort': '-ga:visits',
            //'filters': 'ga:visits>60'
            //'output': 'dataTable'
        },
        osQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystem, ga:operatingSystemVersion',
            'sort': '-ga:visits',
        },

        dailyUsersQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:1dayUsers',
            'dimensions': 'ga:date',
        },
        dailyUsersQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:1dayUsers',
            'dimensions': 'ga:date',
        },

        frequencyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession',
        },
        frequencyQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession',
        },

        AndroidLoyaltyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==Android'
        },
        AndroidLoyaltyQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==Android'
        },

        iOSLoyaltyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==iOS'
        },
        iOSLoyaltyQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==iOS'
        },

        //new tabels queries
        popularBikesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },
        popularBikesQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:appID==com.yamaha.mygarage', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularBikesQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:appID==com.yamaha.mygaragemt', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },
        popularBikesQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:appID==com.yamaha.mygaragesupersport', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularBikesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

         popularBikesQueryPrevMG: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:appID==com.yamaha.mygarage', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularBikesQueryPrevMT: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:appID==com.yamaha.mygaragemt', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularBikesQueryPrevSS: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike;ga:appID==com.yamaha.mygaragesupersport', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:appID==com.yamaha.mygarage', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:appID==com.yamaha.mygaragemt', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQuerySS: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:appID==com.yamaha.mygaragesupersport', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQueryPrevMG: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:appID==com.yamaha.mygarage', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQueryPrevMT: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:appID==com.yamaha.mygaragemt', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        popularPartsQueryPrevSS: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part;ga:appID==com.yamaha.mygaragesupersport', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents',
            'max-results': 5,
        },

        AndroidExitQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==Android',
            'sort': '-ga:visits',
            'max-results': 10
        },
        AndroidExitQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==Android',
            'sort': '-ga:visits',
            'max-results': 10,
        },

        iOSExitQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==iOS',
            'sort': '-ga:visits',
            'max-results': 10,
        },
        iOSExitQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==iOS',
            'sort': '-ga:visits',
            'max-results': 10,
        },

        sharesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share', //ga:operatingSystem==iOS',
        },

        sharesQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:appID==com.yamaha.mygarage', //ga:operatingSystem==iOS',
        },

        sharesQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:appID==com.yamaha.mygaragemt', //ga:operatingSystem==iOS',
        },

        sharesQuerySS: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:appID==com.yamaha.mygaragesupersport', //ga:operatingSystem==iOS',
        },

        sharesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share', //ga:operatingSystem==iOS',
        },

        sharesQueryPrevMG: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:appID==com.yamaha.mygarage', //ga:operatingSystem==iOS',
        },

        sharesQueryPrevMT: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:appID==com.yamaha.mygaragemt', //ga:operatingSystem==iOS',
        },

        sharesQueryPrevSS: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share;ga:appID==com.yamaha.mygaragesupersport', //ga:operatingSystem==iOS',
        },

        savedConfigsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save',
            // 'dimensions': 'ga:eventAction'
        },

        savedConfigsQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:appID==com.yamaha.mygarage',
        },

        savedConfigsQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:appID==com.yamaha.mygaragemt',
        },

        savedConfigsQuerySS: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:appID==com.yamaha.mygaragesupersport',
        },
        savedConfigsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save',
            // 'dimensions': 'ga:eventAction'
        },

        savedConfigsQueryPrevMG: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:appID==com.yamaha.mygarage',
        },

        savedConfigsQueryPrevMT: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:appID==com.yamaha.mygaragemt',
        },

        savedConfigsQueryPrevSS: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save;ga:appID==com.yamaha.mygaragesupersport',
        },

        dealerContactedQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success',
            // 'dimensions': 'ga:eventAction'
        },
        dealerContactedQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success;ga:appID==com.yamaha.mygarage',
            // 'dimensions': 'ga:eventAction'
        },
        dealerContactedQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success;ga:appID==com.yamaha.mygaragemt',
            // 'dimensions': 'ga:eventAction'
        },
        dealerContactedQuerySS: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success;ga:appID==com.yamaha.mygaragesupersport',
            // 'dimensions': 'ga:eventAction'
        },
        dealerContactedQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success',
        },
        dealerContactedQueryPrevMG: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success;ga:appID==com.yamaha.mygarage',
        },
        dealerContactedQueryPrevMT: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success;ga:appID==com.yamaha.mygaragemt',
        },
        dealerContactedQueryPrevSS: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success;ga:appID==com.yamaha.mygaragesupersport',
        },

        attdealerContactedQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error',
            // 'dimensions': 'ga:eventAction'
        },
        attdealerContactedQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error;ga:appID==com.yamaha.mygarage',
            // 'dimensions': 'ga:eventAction'
        },
         attdealerContactedQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error;ga:appID==com.yamaha.mygaragemt',
            // 'dimensions': 'ga:eventAction'
        },
        attdealerContactedQuerySS: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error;ga:appID==com.yamaha.mygaragesupersport',
            // 'dimensions': 'ga:eventAction'
        },

        attdealerContactedQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error',
        },
        attdealerContactedQueryPrevMG: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error;ga:appID==com.yamaha.mygarage',
        },
        attdealerContactedQueryPrevMT: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error;ga:appID==com.yamaha.mygaragemt',
        },
        attdealerContactedQueryPrevSS: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventLabel==success,ga:eventLabel==error;ga:appID==com.yamaha.mygaragesupersport',
        },

        averageUsageQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:avgSessionDuration',
        },
        averageUsageQueryMG: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:avgSessionDuration',
            'filters': 'ga:appID==com.yamaha.mygarage'
        },
         averageUsageQueryMT: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:avgSessionDuration',
            'filters': 'ga:appID==com.yamaha.mygaragemt'
        },
         averageUsageQuerySS: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:avgSessionDuration',
            'filters': 'ga:appID==com.yamaha.mygaragesupersport'
        },

        averageUsageQueryPrev: {
        'start-date': startDatePrev,
        'end-date': endDatePrev,
        'metrics': 'ga:avgSessionDuration',
        },
        averageUsageQueryPrevMG: {
        'start-date': startDatePrev,
        'end-date': endDatePrev,
        'metrics': 'ga:avgSessionDuration',
        'filters': 'ga:appID==com.yamaha.mygarage'
        },
        averageUsageQueryPrevMT: {
        'start-date': startDatePrev,
        'end-date': endDatePrev,
        'metrics': 'ga:avgSessionDuration',
        'filters': 'ga:appID==com.yamaha.mygaragemt'
        },
        averageUsageQueryPrevSS: {
        'start-date': startDatePrev,
        'end-date': endDatePrev,
        'metrics': 'ga:avgSessionDuration',
        'filters': 'ga:appID==com.yamaha.mygaragesupersport'
        },
    }

    return queries;

}