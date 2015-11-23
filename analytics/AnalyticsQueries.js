
var queryController = function(){

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

    function setWeekAgo(){
        var oneWeekAgo = new Date();
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

    function setMonthAgo(){
        var monthAgo = new Date();
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

    var endDate = setToday();
    var startDate = setWeekAgo();
    //var startDate = setMonthAgo()

    // Query objects used in getData()
    var queries = {

        visitorTypesQuery: {
            'start-date': startDate,
            'end-date': endDate,
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

        iOScountryVisitsQuery: {
            'start-date': startDate,
            'end-date': endDate,
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

        dailyUsersQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:1dayUsers',
            'dimensions': 'ga:date',
        },

        frequencyQuery: {
            'start-date': startDate,
            'end-date': endDate,
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

        iOSLoyaltyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==iOS'
        },

        //new tabels queries
        //popularBikesQuery: {
        //    'start-date': startDate,
        //    'end-date': endDate,
        //    'metrics': 'ga:totalEvents',
        //    'filters': 'ga:eventCategory==Bike', //ga:operatingSystem==iOS',
        //    'dimensions': 'ga:eventLabel',
        //    'sort': '-ga:totalEvents'
        //},
        //
        popularPartsQuery: {
           'start-date': startDate,
           'end-date': endDate,
           'metrics': 'ga:totalEvents',
           'filters': 'ga:eventCategory==Part', //ga:operatingSystem==iOS',
           'dimensions': 'ga:eventLabel',
           'max-results': 5,
           'sort': '-ga:totalEvents'
        },
        //
        //sharesQuery: {
        //    'start-date': startDate,
        //    'end-date': endDate,
        //    'metrics': 'ga:totalEvents',
        //    'filters': 'ga:eventCategory==Share', //ga:operatingSystem==iOS',
        //},
        //
        //iOSExitQuery: {
        //    'start-date': startDate,
        //    'end-date': endDate,
        //    'metrics': 'ga:visits',
        //    'dimensions': 'ga:exitScreenName',
        //    'filters': 'ga:operatingSystem==iOS',
        //    'sort': '-ga:visits'
        //},
        //
        //AndroidExitQuery: {
        //    'start-date': startDate,
        //    'end-date': endDate,
        //    'metrics': 'ga:visits',
        //    'dimensions': 'ga:exitScreenName',
        //    'filters': 'ga:operatingSystem==Android',
        //    'sort': '-ga:visits'
        //}

    }

    return queries;

}


module.exports = queryController();