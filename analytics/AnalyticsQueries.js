
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

        osQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:operatingSystemVersion, ga:operatingSystem'
        },

        countryVisitsQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:country'
        },

        dailyUsersQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:1dayUsers',
            'dimensions': 'ga:date'
        },

        frequencyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:daysSinceLastSession'
        },

        loyaltyQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:sessions',
            'dimensions': 'ga:sessionCount'
        },

        visitorTypesQuery: {
            'start-date': startDate,
            'end-date': endDate,
            'metrics': 'ga:visits',
            'dimensions': 'ga:userType'
        }
    }

    return queries;

}


module.exports = queryController();