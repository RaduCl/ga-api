
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
        console.log("azi "+today);
        return today = yyyy+'-'+mm+'-'+dd;
    }

    function setMonthAgo(){
        var today = new Date()-30;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        console.log("azi "+today);
        return today = yyyy+'-'+mm+'-'+dd;
    }

    var endDate = setToday()


    //var monthAgo = new Date(today)-30;


    var queries = {

        osQuery: {
            'start-date': '2015-10-11',
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystemVersion, ga:operatingSystem'
        },

        AndroidcountryVisitsQuery: {
            'start-date': '2015-09-11',
            'end-date': endDate,
            'metrics': 'ga:visits',
            'filters': 'ga:operatingSystem==Android',
            'dimensions': 'ga:country',
            'sort': '-ga:visits'
        },

        iOScountryVisitsQuery: {
            'start-date': '2015-09-11',
            'end-date': endDate,
            'metrics': 'ga:visits',
            'filters': 'ga:operatingSystem==iOS',
            'dimensions': 'ga:country',
            'sort': '-ga:visits'
        },

        dailyUsersQuery: {
            'start-date': '2015-09-11',
            'end-date': endDate,
            'metrics': 'ga:1dayUsers',
            'dimensions': 'ga:date'
        },

        frequencyQuery: {
            'start-date': '2015-09-11',
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession'
        },

        iOSLoyaltyQuery: {
            'start-date': '2015-10-22',
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==iOS'
        },

        AndroidLoyaltyQuery: {
            'start-date': '2015-10-22',
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount',
            'filters': 'ga:operatingSystem==Android'
        },

        visitorTypesQuery: {
            'start-date': '2015-10-22',
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType'
        },

        popularBikesQuery: {
            'start-date': '2015-10-20',
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Bike', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents'
        },

        popularPartsQuery: {
            'start-date': '2015-10-20',
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Part', //ga:operatingSystem==iOS',
            'dimensions': 'ga:eventLabel',
            'sort': '-ga:totalEvents'
        },

        sharesQuery: {
            'start-date': '2015-10-20',
            'end-date': endDate,
            'metrics': 'ga:totalEvents',
            'filters': 'ga:eventCategory==Share', //ga:operatingSystem==iOS',
        },

        iOSExitQuery: {
            'start-date': '2015-10-20',
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==iOS',
            'sort': '-ga:visits'
        },

        AndroidExitQuery: {
            'start-date': '2015-10-20',
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:exitScreenName',
            'filters': 'ga:operatingSystem==Android',
            'sort': '-ga:visits'
        }

    }

    return queries;

}


module.exports = queryController();