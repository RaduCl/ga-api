
var queryController = function(startDate){

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


    var monthAgo = new Date(today)-30;

    var osQuery = function(){
        
    }
}
var query = {

    osQuery: {
        'start-date': '2015-02-11',
        'end-date': '2015-11-05',
        'metrics': 'ga:visits',
        'dimensions': 'ga:operatingSystemVersion, ga:operatingSystem'
    },

    countryVisitsQuery: {
        'start-date': '2015-02-11',
        'end-date': '2015-11-05',
        'metrics': 'ga:visits',
        'dimensions': 'ga:country'
    },

    dailyUsersQuery: {
        'start-date': '2015-02-11',
        'end-date': '2015-11-05',
        'metrics': 'ga:1dayUsers',
        'dimensions': 'ga:date'
    },

    frequencyQuery: {
        'start-date': '2015-02-11',
        'end-date': '2015-11-05',
        'metrics': 'ga:sessions',
        'dimensions': 'ga:daysSinceLastSession'
    },

    loyaltyQuery: {
        'start-date': '2015-10-22',
        'end-date': '2015-11-08',
        'metrics': 'ga:sessions',
        'dimensions': 'ga:sessionCount'
    },

    visitorTypesQuery: {
        'start-date': '2015-10-22',
        'end-date': '2015-11-08',
        'metrics': 'ga:visits',
        'dimensions': 'ga:userType'
    }
}



module.exports = query;