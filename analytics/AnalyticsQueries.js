
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
            'dimensions': 'ga:userType'
        },

        visitorTypesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType'
        },

        //countryVisitsQuery: {
        //    'start-date': startDate,
        //    'end-date': endDate,
        //    'metrics': 'ga:visits',
        //    'dimensions': 'ga:country',
        //    'sort':'-ga:visits',//sort descending
        //    'max-results': 5
        //},

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

        //loyaltyQuery: {
        //    'start-date': startDate,
        //    'end-date': endDate,
        //    'metrics': 'ga:sessions',
        //    'dimensions': 'ga:sessionCount'
        //},

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
        popularBikesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike', //ga:operatingSystem==iOS',
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
        popularPartsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part', //ga:operatingSystem==iOS',
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
            'sort': '-ga:visits'
        },
        AndroidExitQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==Android',
            'sort': '-ga:visits'
        },

        iOSExitQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==iOS',
            'sort': '-ga:visits'
        },
        iOSExitQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==iOS',
            'sort': '-ga:visits'
        },

        sharesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share', //ga:operatingSystem==iOS',
        },
        sharesQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share', //ga:operatingSystem==iOS',
        },

        savedConfigsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save',
            // 'dimensions': 'ga:eventAction'
        },
        savedConfigsQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==save',
            // 'dimensions': 'ga:eventAction'
        },

        dealerContactedQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==contactdealer',
            // 'dimensions': 'ga:eventAction'
        },
        dealerContactedQueryPrev: {
            'start-date': startDatePrev,
            'end-date': endDatePrev,
            'metrics': 'ga:eventValue',
            'filters': 'ga:eventAction==contactdealer',
        },

        averageUsageQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:avgSessionDuration',
        },
        averageUsageQueryPrev: {
        'start-date': startDatePrev,
        'end-date': endDatePrev,
        'metrics': 'ga:avgSessionDuration',
        },
    }

    return queries;

}