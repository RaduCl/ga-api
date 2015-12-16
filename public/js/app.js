google.load('visualization', '1', {packages:['table']});
// google.load('visualization', '1.1', {packages:['table']});
// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {packages: ['corechart']});
google.load("visualization", "1.1", {packages: ["bar"]});
google.load("visualization", "1.1", {packages: ["sankey"]});


google.setOnLoadCallback(initialize);



function initialize() {

    var ajaxData = {};

    //api routes
    const visitorTypesLink = '/ga-data/visitor-type-data';
    const countryVisitsLink = '/ga-data/visits-by-country-data';
    const osLink = '/ga-data/os-data';
    const daylyUsersLink = '/ga-data/dayly-users-data';
    const recencyLink = '/ga-data/user-frequency-data';
    const loyaltyLink = '/ga-data/user-loyalty-data';

    //helper methods
    var getDeltaPercentage = function(currentResult, prevResult){
        if((prevResult)){
            return Math.floor((currentResult-prevResult)/prevResult*100);
        } else return('-')
    };

    var convertSecondsToMinutes = function(seconds){
        return (seconds/60).toFixed(2)
    }

    var checkValue = function(value){
        return value ? value : 0
    }

    // This must be a hyperlink
    $("#export-mygarageMG").click(function (event) {
        var csv = $('#garage-MyGarageSportHeritage').table2CSV({delivery:'value'});
        window.location.href = 'data:text/csv;charset=UTF-8,'+ encodeURIComponent(csv);
    });
    $("#export-mygarageMT").click(function (event) {
        var csv = $('#garage-MyGarageMT').table2CSV({delivery:'value'});
        window.location.href = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(csv);
    });
    $("#export-mygarageSS").click(function (event) {
        var csv = $('#garage-MyGarageSupersport').table2CSV({delivery:'_blank'});
        window.location.href = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(csv);
    });

    //implmentation for single query
    //var getAjaxData = function(apiLink, responseCallback){
    //    //TODO implmenent month or week time interval for the queries - this can be a value from dropdown select
    //    //var date = '2015-11-05'; // can be a value from a txtbox
    //    var url = '/ga-data';
    //    $.ajax({
    //        url: url,
    //        type: 'GET',
    //        success: function (result) {
    //            //console.log('result inside ajax is: '+ result)
    //            //ajaxData['queryResults'] = result
    //            //alert(ajaxData)
    //            //console.log(ajaxData);
    //            responseCallback(result)
    //        }
    //    });
    //}

    var getAjaxData = function(period){
        var period = typeof period !== 'undefined' ? period : '';
        var url = '/mongo-data/'+ period;
        $.ajax({
            url: url,
            type: 'GET',
            statusCode:{
              500: function(){
                  alert('No data available, ingest cycle will start return when done')
              }
            },
            //beforeSend: function(){
            //    $('#loading').show();
            //    $('#content').hide();
            //},
            //complete: function(){
            //    $('#loading').hide();
            //    $('#content').show();
            //},
            success: function(results){
                charts(results, period);
                $('#loading').hide();
                $('#content').show();
            },
            fail: function() {
                console.log('error');
            }
        });
    }

    var charts = function(results, period){
        //alert('inside charts')

        newReturningUsersData(results);
        //countryVisitsData(results);
        iOScountryVisitsData(results);
        AndroidcountryVisitsData(results);
        downloadsByOsData(results);
        daylyUsersData(results);
        recencyData(results);
        //loyaltyData(results);
        iOSLoyaltyData(results);
        androidloyaltyData(results);
        popularBikesData(results);
        popularPartsData(results);
        AndroidExitData(results);
        iOSExitData(results);
        totalShareData(results);
        savedConfigsData(results);
        contactDealerData(results);
        appStoreDownloads(results);
        //myGarage(results, period)
    }

    //default load with week data
    getAjaxData('week');

    $('#time-interval').change(function(){
        var interval = $('#time-interval').val();
        getAjaxData(interval);
    })

    $('#country-select').change(function(){
        var country = $('#country-select').val();
        getMyGarageData(country);
    })

    var getMyGarageData = function(country){
        var url = '/mygarage-data/';
        $.ajax({
            url: url,
            type: 'GET',
            statusCode:{
                500: function(){
                    alert('No data available, ingest cycle will start return when done')
                }
            },
            success: function(results){
                if(country){
                    alert('country selected: ' + country)
                    myGarage(results, 'MyGarageSportHeritage', country);
                    //myGarage(results, 'MyGarageSupersport', country);
                    //myGarage(results, 'MyGarageMT', country);
                } else{
                    myGarage(results, 'MyGarageSportHeritage');
                    myGarage(results, 'MyGarageSupersport');
                    myGarage(results, 'MyGarageMT');
                    topAppStoreDownlodsByCountry(results, 'MyGarageSportHeritage');
                    topAppStoreDownlodsByCountry(results, 'MyGarageSupersport');
                    topAppStoreDownlodsByCountry(results, 'MyGarageMT');
                }
            },
            fail: function() {
                console.log('error');
            }
        });
    }
    getMyGarageData()

    var newReturningUsersData = function(result){
        var ajaxData = result.visitorTypesQuery;
        var data = new google.visualization.DataTable();

        var newVisitors = parseInt(ajaxData[0][1]);
        var returningVisitors = parseInt(ajaxData[1][1]);

        data.addColumn('string', 'User Type');
        data.addColumn('number', 'Sessions');
        data.addRows([
            ['Returning Visitors', {v: newVisitors}],
            ['New Visitors', {v: returningVisitors}]
        ]);
        var options = {
            'title': 'New versus Returning Users',
            'width': '100%',
            'height': '100%'
        }
        var table = new google.visualization.Table(document.getElementById('new-vs-returning-users'));
        // var formatter = new google.visualization.ArrowFormat();
        // formatter.format(data, 1);
        table.draw(data, options);
    }

    var countryVisitsData = function(result){
        var ajaxData = result.countryVisitsQuery
        //adding column headers
        ajaxData.unshift(['Country', 'Users'])
        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Top 5 Countries by Total Users',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_c = new google.visualization.Table(document.getElementById('top-countries'));
        table_c.draw(data, options);
    }

    var iOScountryVisitsData = function(result){
        var ajaxData = result.iOScountryVisitsQuery
        //adding column headers
        ajaxData.unshift(['Country', 'Users'])
        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Top 5 Countries iOS Users',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_c = new google.visualization.Table(document.getElementById('top-countries-iOS'));
        table_c.draw(data, options);
    }

    var AndroidcountryVisitsData = function(result){
        var ajaxData = result.AndroidcountryVisitsQuery
        //adding column headers
        ajaxData.unshift(['Country', 'Users'])
        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Top 5 Countries Android users',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_c = new google.visualization.Table(document.getElementById('top-countries-android'));
        table_c.draw(data, options);
    }

    var downloadsByOsData =  function(result) {
        var ajaxData = result.osQuery
        // merge OSname and OSversion
        //TODO filter OS with less than 5% and add them otherOS
        //var downloadsTotalNumber = ajaxData.map(function(element){
        //    return parseInt(element[2])
        //})
        //    .reduce(function(preVal, nextVal){
        //        return  preVal+nextVal
        //    }, 0)
        //console.log(downloadsTotalNumber)
        ////procentage filter for displaying distinct OS
        //var percentageFilter = Math.floor(downloadsTotalNumber/100*3);
        //console.log(percentageFilter)
        //var otherOS = 0;

        var formatedData = ajaxData.map(function(arr){
            var formatedArr = [];
            formatedArr[0] = arr[0]+ ' ' + arr[1];
            formatedArr[1] = parseInt(arr[2]);
            return formatedArr;
        })


        formatedData.unshift(['OS', 'Sessions'])

        var data = google.visualization.arrayToDataTable(formatedData)

        var options = {
            //'title': 'Total Downloads by OS',
            'width': "100%",
            'height': 400,
            'pieHole': 0.4,
            'pieSliceText': 'percentage',
            'titleTextStyle': {
                fontSize: 20
            },
            'chartArea': {
                left: 50,
                top: 50,
                width: "100%",
                height: "100%"
            },
            'slices': {
            }
        };

        var chart = new google.visualization.PieChart(document.getElementById('total-downloads-byOS'));
        chart.draw(data, options);
    }

    var daylyUsersData = function(result){
        var ajaxData = result.dailyUsersQuery
        var formatedData = ajaxData.map(function(element){
            var chartDate = new Date( element[0].slice(0,4) + '-' + element[0].slice(4,6) + '-' + element[0].slice(6,8) );
            element[0] = chartDate.toDateString().slice(4,10)
            element[1] = parseInt(element[1])
            return element
        })
        //add column Names
        formatedData.unshift(['Day', 'Users'])

        var data = google.visualization.arrayToDataTable(formatedData)

        var options = {
            // title: 'User Increase / Decrease',
            // hAxis: {title: 'Month',  titleTextStyle: {color: '#333'}},
            hAxis: {titleTextStyle: {color: '#333'}},
            vAxis: {minValue: 0},
            //chartArea: {
            //    left: 100,
            //    top: 100,
            //    width: 600,
            //    height: 350
            //}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('user-increase'));
        chart.draw(data, options);

    }

    var recencyData = function(result){
        var ajaxData = result.frequencyQuery
        var freqBetween8and14 = []
        var freqBetween15and30 = []
        var freqBetween31and60 = []
        var freqMoreThan60Days = []
        var formatedData = ajaxData.map(function(element){
            //element[0] === '0'  ? element[0] = '< 1 day' : element[0];
            element[0] = parseInt(element[0])
            element[1] = parseInt(element[1])
            return element
        })
            .sort(function(a, b){
                return a[0]-b[0]
            })

        //add elements with frequnecy between 8 and 14 days to freqBetween8and14 arr
        for(var i = 0; i < formatedData.length; i++){
            if( formatedData[i][0] > 7 && formatedData[i][0] < 15){
                freqBetween8and14.push(formatedData[i][1])
            }
            if( formatedData[i][0] > 14 && formatedData[i][0] < 31){
                freqBetween15and30.push(formatedData[i][1])
            }
            if( formatedData[i][0] > 30 && formatedData[i][0] < 61){
                freqBetween31and60.push(formatedData[i][1])
            }
            if( formatedData[i][0] > 60){
                freqMoreThan60Days.push(formatedData[i][1])
            }
        }

        //remove elements with frequnecy more than 15 days from formatedData
        for(var i = 0; i < formatedData.length; i++){
            if( formatedData[i][0] > 7){
                formatedData.splice(i, formatedData.length-i)
            }
        }

        // sum all visits with frequency between 8 and 15
        freqBetween8and14 = freqBetween8and14.reduce(function(prev, next){
            return prev+next
        }, 0)
        // sum all visits with frequency between 15 and 31
        freqBetween15and30 = freqBetween15and30.reduce(function(prev, next){
            return prev+next
        }, 0)

       // sum all visits with frequency between 30 and 61
        freqBetween31and60 = freqBetween31and60.reduce(function(prev, next){
            return prev+next
        }, 0)

       // sum all visits with frequency more than 60
        freqMoreThan60Days = freqMoreThan60Days.reduce(function(prev, next){
            return prev+next
        }, 0)

        formatedData[0][0] = '< 1'
        formatedData.unshift(["Days between Sessions", "Sessions"])
        formatedData.push(
            ['8-14', freqBetween8and14],
            ['15-30', freqBetween15and30],
            ['31-60', freqBetween31and60],
            ['> 60', freqMoreThan60Days]
        )

        var data = google.visualization.arrayToDataTable(formatedData)

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            { calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation" }]);
        var options = {
            // title: "Recency",
            width: 380,
            height: 400,
            bar: {groupWidth: "65%"},
            legend: { position: "none" },
            axes: {
                x: {
                    0: { side: 'top', label: 'Days between Sessions'}, // Top x-axis.
                    1: { side: 'top', label: 'Sessions'}
                }
            }
        };
        var chart = new google.visualization.BarChart(document.getElementById("recency"));
        chart.draw(view, options);
    }

    //helper function for loyalty charts
    var filterAndSumSessions = function(array, min, max){
        var sessionsSum =  array.filter(function(element){
            if (element[0] >= min && element[0] <= max) return element
        }).map(function(element){
            return element[1]
        }).reduce(function(prev, next){
            return parseInt(prev) + parseInt(next)
        }, 0)
        return [min + '-' + max, sessionsSum]
    }

    var loyaltyData = function(result){
        var ajaxData = result.loyaltyQuery;
        var formatedData = ajaxData.map(function(element){
            element[0] = parseInt(element[0]);
            element[1] = parseInt(element[1]);
            return element;
        }).sort(function(a,b){
            return a[0] - b[0]
        })

        var sessionInstances9to14 = filterAndSumSessions(formatedData, 9, 14)
        var sessionInstances15to25 = filterAndSumSessions(formatedData, 15, 25)
        var sessionInstances26to50 = filterAndSumSessions(formatedData, 26, 50)
        var sessionInstances51to100 = filterAndSumSessions(formatedData, 51, 100)
        var sessionInstances101to200 = filterAndSumSessions(formatedData, 101, 200)

        for ( var i = 0; i < formatedData.length; i++){
            if (formatedData[i][0] > 8){
                formatedData.splice(i, formatedData.length-i)
            }
        }

        formatedData.map(function(element){
            element[0]=String(element[0])
            element[1]=parseInt(element[1])
            return element
        })

        formatedData.unshift(["Session Instances", "Sessions"]);

        formatedData.push(sessionInstances9to14);
        formatedData.push(sessionInstances15to25);
        formatedData.push(sessionInstances26to50);
        formatedData.push(sessionInstances51to100);
        formatedData.push(sessionInstances101to200);

        //console.log('formatedData is: '+formatedData)
        var data = google.visualization.arrayToDataTable(formatedData)


        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            { calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation" }]);
        var options = {
            // title: "Loyalty",
            width: 380,
            height: 400,
            bar: {groupWidth: "60%"},
            legend: { position: "none" },
        };
        var chart = new google.visualization.BarChart(document.getElementById("loyalty"));
        chart.draw(view, options);
    }

    var androidloyaltyData = function(result){
        var ajaxData = result.AndroidLoyaltyQuery;
        var formatedData = ajaxData.map(function(element){
            element[0] = parseInt(element[0]);
            element[1] = parseInt(element[1]);
            return element;
        }).sort(function(a,b){
            return a[0] - b[0]
        })


        var sessionInstances9to14 = filterAndSumSessions(formatedData, 9, 14)
        var sessionInstances15to25 = filterAndSumSessions(formatedData, 15, 25)
        var sessionInstances26to50 = filterAndSumSessions(formatedData, 26, 50)
        var sessionInstances51to100 = filterAndSumSessions(formatedData, 51, 100)
        var sessionInstances101to200 = filterAndSumSessions(formatedData, 101, 200)
        for ( var i = 0; i < formatedData.length; i++){
            if (formatedData[i][0] > 8){
                formatedData.splice(i, formatedData.length-i)
            }
        }

        formatedData.map(function(element){
            element[0]=String(element[0])
            element[1]=parseInt(element[1])
            return element
        })

        formatedData.unshift(["Session Instances", "Sessions"]);

        formatedData.push(sessionInstances9to14);
        formatedData.push(sessionInstances15to25);
        formatedData.push(sessionInstances26to50);
        formatedData.push(sessionInstances51to100);
        formatedData.push(sessionInstances101to200);

        //console.log('formatedData is: '+formatedData)
        var data = google.visualization.arrayToDataTable(formatedData)


        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            { calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation" }]);
        var options = {
            // title: "Loyalty Android",
            width: 380,
            height: 400,
            bar: {groupWidth: "65%"},
            legend: { position: "none" },
        };
        var chart = new google.visualization.BarChart(document.getElementById("loyalty-android"));
        chart.draw(view, options);
    }

    var iOSLoyaltyData = function(result){
        var ajaxData = result.iOSLoyaltyQuery;
        var formatedData = ajaxData.map(function(element){
            element[0] = parseInt(element[0]);
            element[1] = parseInt(element[1]);
            return element;
        }).sort(function(a,b){
            return a[0] - b[0]
        })

        var filterAndSumSessions = function(array, min, max){
            var sessionsSum =  array.filter(function(element){
                if (element[0] >= min && element[0] <= max) return element
            }).map(function(element){
                return element[1]
            }).reduce(function(prev, next){
                return parseInt(prev) + parseInt(next)
            }, 0)
            return [min + '-' + max, sessionsSum]
        }

        var sessionInstances9to14 = filterAndSumSessions(formatedData, 9, 14)
        var sessionInstances15to25 = filterAndSumSessions(formatedData, 15, 25)
        var sessionInstances26to50 = filterAndSumSessions(formatedData, 26, 50)
        var sessionInstances51to100 = filterAndSumSessions(formatedData, 51, 100)
        var sessionInstances101to200 = filterAndSumSessions(formatedData, 101, 200)

        for ( var i = 0; i < formatedData.length; i++){
            if (formatedData[i][0] > 8){
                formatedData.splice(i, formatedData.length-i)
            }
        }

        formatedData.map(function(element){
            element[0]=String(element[0])
            element[1]=parseInt(element[1])
            return element
        })

        formatedData.unshift(["Session Instances", "Sessions"]);

        formatedData.push(sessionInstances9to14);
        formatedData.push(sessionInstances15to25);
        formatedData.push(sessionInstances26to50);
        formatedData.push(sessionInstances51to100);
        formatedData.push(sessionInstances101to200);

        //console.log('formatedData is: '+formatedData)
        var data = google.visualization.arrayToDataTable(formatedData)


        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            { calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation" }]);
        var options = {
            // title: "Loyalty iOS",
            width: 380,
            height: 400,
            bar: {groupWidth: "65%"},
            legend: { position: "none" },
        };
        var chart = new google.visualization.BarChart(document.getElementById("loyalty-iOS"));
        chart.draw(view, options);
    }

    var popularBikesData = function(result){
        var ajaxData = result.popularBikesQuery
        ajaxData.unshift(['Bike', 'totalEvents'])
        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Top 5 Popular bikes',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_c = new google.visualization.Table(document.getElementById('popular-bikes'));
        table_c.draw(data, options);
    }

    var popularPartsData = function(result){
        var ajaxData = result.popularPartsQuery
        //adding column headers
        ajaxData.unshift(['eventLabel', 'totalEvents'])
        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Top 5 Popular Parts',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_part = new google.visualization.Table(document.getElementById('popular-parts'));
        table_part.draw(data, options);
    }

    var AndroidExitData = function(result){
        var ajaxData = result.AndroidExitQuery
        //adding column headers
        ajaxData.unshift(['Exit Event Name', 'Events'])
        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Android Exit Events',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_part = new google.visualization.Table(document.getElementById('android-exit-event'));
        table_part.draw(data, options);
    }

    var iOSExitData = function(result){
        var ajaxData = result.iOSExitQuery
        //adding column headers
        ajaxData.unshift(['Exit Event Name', 'Events'])
        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'iOS Exit events',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_part = new google.visualization.Table(document.getElementById('iOS-exit-event'));
        table_part.draw(data, options);
    }

    var totalShareData = function(result){
        $('#share-number').html('      ' + result.sharesQuery)
    }

    var savedConfigsData = function(result){
        $('#saved-configs').html('      ' + result.savedConfigsQuery)
    }

    var contactDealerData = function(result){
        $('#dealer-contacted').html('      ' + result.dealerContactedQuery)
    }

    var appStoreDownloads = function(result){
        var appStoreData = result.appStoreDownloads.AllApps;
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Units');
        data.addColumn('number', 'Previous');
        data.addColumn('number', 'Growth');
        data.addRows([
            [ appStoreData.downloads, appStoreData.previousDownloads, {v: appStoreData.deltaPercentage, f: parseInt(appStoreData.deltaPercentage) ? appStoreData.deltaPercentage +' %' : '-'}]
        ]);

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 2);

        var options = {
            'title': 'Total Downloads by App Store',
            'width': '100%',
            'height': '100%'
        }
        var table= new google.visualization.Table(document.getElementById('app-store-downloads'));
        table.draw(data, options);
    }

    var myGarage = function(result, app, country){
        var app = app ? app : '';
        var countryName = country ? country.replace(/ /gi, '') : '';
        var appIDga = '';

        switch (app){
            case 'MyGarageSupersport':
                appIDga = 'mygaragesupersport'
                break;
            case 'MyGarageSportHeritage':
                appIDga = 'mygarage'
                break;
            case 'MyGarageMT':
                appIDga = 'mygaragemt'
                break;
            default :
                appIDga = ''
        }

        var weekResults = result.weekResults.Data;
        var monthResults = result.monthResults.Data;
        var yearResults = result.yearResults.Data;
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'APP KPI');
        data.addColumn('number', 'YTD');
        data.addColumn('number', 'Month');
        data.addColumn('number', 'Previous Month');
        data.addColumn('number', 'Growth month');
        data.addColumn('number', 'Week');
        data.addColumn('number', 'Previous Week');
        data.addColumn('number', 'Growth Week');
        data.addRows([
            [
                'Downloads iOS',
                country ? yearResults.appStoreDownloadsByCountry[app][countryName].downloads : yearResults.appStoreDownloads[app].downloads,
                monthResults.appStoreDownloads[app].downloads,
                monthResults.appStoreDownloads[app].previousDownloads,
                {v: parseInt(monthResults.appStoreDownloads[app].deltaPercentage) ? monthResults.appStoreDownloads[app].deltaPercentage : null, f: parseInt(monthResults.appStoreDownloads[app].deltaPercentage) ? monthResults.appStoreDownloads[app].deltaPercentage + ' %' : '-'},
                weekResults.appStoreDownloads[app].downloads,
                weekResults.appStoreDownloads[app].previousDownloads,
                {v: parseInt(weekResults.appStoreDownloads[app].deltaPercentage) ? weekResults.appStoreDownloads[app].deltaPercentage : null, f: parseInt(weekResults.appStoreDownloads[app].deltaPercentage) ? weekResults.appStoreDownloads[app].deltaPercentage + ' %' : '-'},
            ],

            //TODO implement when googlePlay API credentials are available
            [
                'Downloads Android',
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ],
            //TODO implement when googlePlay API credentials are available
            [
                'Downloads Total',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],

            //TODO implement when googlePlay API credentials are available
            [
                'Created User Accounts',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],

            [
                'Storaged Bikes',
                parseInt(yearResults['savedConfigsQuery_'+appIDga]),
                parseInt(monthResults['savedConfigsQuery_'+appIDga]),
                parseInt(monthResults['savedConfigsQueryPrev_'+appIDga]),
                {
                    v: parseInt(getDeltaPercentage(monthResults['savedConfigsQuery_'+appIDga], monthResults['savedConfigsQueryPrev_'+appIDga])) ? getDeltaPercentage(monthResults['savedConfigsQuery_'+appIDga], monthResults['savedConfigsQueryPrev_'+appIDga]) : null,
                    f: parseInt(getDeltaPercentage(monthResults['savedConfigsQuery_'+appIDga], monthResults['savedConfigsQueryPrev_'+appIDga])) ? getDeltaPercentage(monthResults['savedConfigsQuery_'+appIDga], monthResults['savedConfigsQueryPrev_'+appIDga]) + ' %' : '-'
                },
                parseInt(weekResults['savedConfigsQuery_'+appIDga]),
                parseInt(weekResults['savedConfigsQueryPrev_'+appIDga]),
                {
                    v: parseInt(getDeltaPercentage(weekResults['savedConfigsQuery_'+appIDga], weekResults['savedConfigsQueryPrev_'+appIDga])) ? getDeltaPercentage(weekResults['savedConfigsQuery_'+appIDga], weekResults['savedConfigsQueryPrev_'+appIDga]) : null,
                    f: parseInt(getDeltaPercentage(weekResults['savedConfigsQuery_'+appIDga], weekResults['savedConfigsQueryPrev_'+appIDga])) ? getDeltaPercentage(weekResults['savedConfigsQuery_'+appIDga], weekResults['savedConfigsQueryPrev_'+appIDga]) + ' %' : '-'
                },
            ],

            [
                'Shared Pictures',
                parseInt(yearResults['sharesQuery_' + appIDga]),
                parseInt(monthResults['sharesQuery_' + appIDga]),
                parseInt(monthResults['sharesQueryPrev_' + appIDga]),
                {
                    v: parseInt(getDeltaPercentage(monthResults['sharesQuery_' + appIDga], monthResults['sharesQueryPrev_' + appIDga])) ? getDeltaPercentage(monthResults['sharesQuery_' + appIDga], monthResults['sharesQueryPrev_' + appIDga]) : null,
                    f: parseInt(getDeltaPercentage(monthResults['sharesQuery_' + appIDga], monthResults['sharesQueryPrev_' + appIDga])) ? getDeltaPercentage(monthResults['sharesQuery_' + appIDga], monthResults['sharesQueryPrev_' + appIDga]) + ' %' : '-'
                },
                parseInt(weekResults['sharesQuery_' + appIDga]),
                parseInt(weekResults['sharesQueryPrev_' + appIDga]),
                {
                    v: parseInt(getDeltaPercentage(weekResults['sharesQuery_' + appIDga], weekResults['sharesQueryPrev_' + appIDga])) ? getDeltaPercentage(weekResults['sharesQuery_' + appIDga], weekResults['sharesQueryPrev_' + appIDga]) : null,
                    f: parseInt(getDeltaPercentage(weekResults['sharesQuery_' + appIDga], weekResults['sharesQueryPrev_' + appIDga])) ? getDeltaPercentage(weekResults['sharesQuery_' + appIDga], weekResults['sharesQueryPrev_' + appIDga]) + ' %' : '-'
                },
            ],

            [
                'Sent to a dealer',
                parseInt(checkValue(yearResults['dealerContactedQuery_' + appIDga])),
                parseInt(checkValue(monthResults['dealerContactedQuery_' + appIDga])),
                parseInt(checkValue(monthResults['dealerContactedQueryPrev_' + appIDga])),
                {
                    v: parseInt(getDeltaPercentage(monthResults['dealerContactedQuery_' + appIDga], monthResults['dealerContactedQueryPrev_' + appIDga])),
                    f: parseInt(getDeltaPercentage(monthResults['dealerContactedQuery_' + appIDga], monthResults['dealerContactedQueryPrev_' + appIDga])) ?  getDeltaPercentage(monthResults['dealerContactedQuery_' + appIDga], monthResults['dealerContactedQueryPrev_' + appIDga]) + ' %' : '-'
                },
                parseInt(checkValue(weekResults['dealerContactedQuery_' + appIDga])),
                parseInt(checkValue(weekResults['dealerContactedQueryPrev_' + appIDga])),
                {
                    v: parseInt(getDeltaPercentage(weekResults['dealerContactedQuery_' + appIDga], weekResults['dealerContactedQueryPrev_' + appIDga])),
                    f: parseInt(getDeltaPercentage(weekResults['dealerContactedQuery_' + appIDga], weekResults['dealerContactedQueryPrev_' + appIDga])) ? getDeltaPercentage(weekResults['dealerContactedQuery_' + appIDga], weekResults['dealerContactedQueryPrev_' + appIDga]) + ' %' : '-'
                },
            ],

            [
                'New Users',
                parseInt(yearResults['visitorTypesQuery_' + appIDga][0][1]),
                parseInt(monthResults['visitorTypesQuery_' + appIDga][0][1]),
                parseInt(monthResults['visitorTypesQueryPrev_' + appIDga][0][1]),
                {
                    v: parseInt(getDeltaPercentage(monthResults['visitorTypesQuery_' + appIDga][0][1], monthResults['visitorTypesQueryPrev_' + appIDga][0][1])),
                    f: getDeltaPercentage(monthResults['visitorTypesQuery_' + appIDga][0][1], monthResults['visitorTypesQueryPrev_' + appIDga][0][1]) + ' %'
                },
                parseInt(weekResults['visitorTypesQuery_' + appIDga][0][1]),
                parseInt(weekResults['visitorTypesQueryPrev_' + appIDga][0][1]),
                {
                    v: parseInt(getDeltaPercentage(weekResults['visitorTypesQuery_' + appIDga][0][1], weekResults['visitorTypesQueryPrev_' + appIDga][0][1])),
                    f: getDeltaPercentage(weekResults['visitorTypesQuery_' + appIDga][0][1], weekResults['visitorTypesQueryPrev_' + appIDga][0][1]) + ' %'
                },
            ],

            [
                'Average usage (min)',
                {
                    v: parseInt(yearResults['averageUsageQuery_' + appIDga]),
                    f: parseFloat(convertSecondsToMinutes(yearResults['averageUsageQuery_' + appIDga])).toFixed(1)
                },
                {
                    v: parseInt(monthResults['averageUsageQuery_' + appIDga]),
                    f: parseFloat(convertSecondsToMinutes(monthResults['averageUsageQuery_' + appIDga])).toFixed(1)
                },
                {
                    v: parseInt(monthResults['averageUsageQueryPrev_' + appIDga]),
                    f: parseFloat(convertSecondsToMinutes(monthResults['averageUsageQueryPrev_' + appIDga])).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(monthResults['averageUsageQuery_' + appIDga], monthResults['averageUsageQueryPrev_' + appIDga])),
                    f: getDeltaPercentage(monthResults['averageUsageQuery_' + appIDga], monthResults['averageUsageQueryPrev_' + appIDga]) + ' %'
                },
                {
                    v: parseInt(weekResults['averageUsageQuery_' + appIDga]),
                    f: parseFloat(convertSecondsToMinutes(weekResults['averageUsageQuery_' + appIDga])).toFixed(1)
                },
                {
                    v: parseInt(weekResults['averageUsageQueryPrev_' + appIDga]),
                    f: parseFloat(convertSecondsToMinutes(weekResults['averageUsageQueryPrev_' + appIDga])).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(weekResults['averageUsageQuery_' + appIDga], weekResults['averageUsageQueryPrev_' + appIDga])),
                    f: getDeltaPercentage(weekResults['averageUsageQuery_' + appIDga], weekResults['averageUsageQueryPrev_' + appIDga]) + ' %'
                },
            ],

            [
                'Popular bike',
                {v: parseInt(yearResults['popularBikesQuery_' + appIDga][0][0]), f: String(yearResults['popularBikesQuery_' + appIDga][0][0])},
                {v: parseInt(monthResults['popularBikesQuery_' + appIDga][0][0]), f: monthResults['popularBikesQuery_' + appIDga][0][0]},
                {v: parseInt(monthResults['popularBikesQueryPrev_' + appIDga][0][0]), f: monthResults['popularBikesQueryPrev_' + appIDga][0][0]},
                null,
                {v: parseInt(weekResults['popularBikesQuery_' + appIDga][0][0]), f: weekResults['popularBikesQuery_' + appIDga][0][0]},
                {v: parseInt(weekResults['popularBikesQueryPrev_' + appIDga][0][0]), f: weekResults['popularBikesQueryPrev_' + appIDga][0][0]},
                null
            ],

            [
                'Popular Accessory',
                {v: parseInt(yearResults['popularPartsQuery_' + appIDga][0][0]), f: String(yearResults['popularPartsQuery_' + appIDga][0][0])},
                {v: parseInt(monthResults['popularPartsQuery_' + appIDga][0][0]), f: monthResults['popularPartsQuery_' + appIDga][0][0]},
                {v: parseInt(monthResults['popularPartsQueryPrev_' + appIDga][0][0]), f: monthResults['popularPartsQuery_' + appIDga][0][0]},
                null,
                {v: parseInt(weekResults['popularPartsQuery_' + appIDga][0][0]), f: weekResults['popularPartsQuery_' + appIDga][0][0]},
                {v: parseInt(weekResults['popularPartsQueryPrev_' + appIDga][0][0]), f: weekResults['popularPartsQueryPrev_' + appIDga][0][0]},
                null
            ],
        ])

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage',
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('garage-' + app));
        table.draw(data, options);
    }

    var topAppStoreDownlodsByCountry = function(result, appID) {
        //var appID = appID
        var weekResults = result.weekResults.Data.appStoreDownloadsByCountry[appID];
        var monthResults = result.monthResults.Data.appStoreDownloadsByCountry[appID];
        var yearResults = result.yearResults.Data.appStoreDownloadsByCountry[appID];
        //var weekResultsTotal = result.weekResults.Data.appStoreDownloadsByCountry;
        //var monthResultsTotal = result.monthResults.Data.appStoreDownloadsByCountry;
        //var yearResultsTotal = result.yearResults.Data.appStoreDownloadsByCountry;
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Country');
        data.addColumn('number', 'YTD');
        data.addColumn('number', 'Month');
        data.addColumn('number', 'Previous Month');
        data.addColumn('number', 'Growth month');
        data.addColumn('number', 'Week');
        data.addColumn('number', 'Previous Week');
        data.addColumn('number', 'Growth Week');
        data.addRows([
            [
                monthResults[0].country,
                yearResults[0].downloads,
                monthResults[0].downloads,
                monthResults[0].previousDownloads,
                {v: parseInt(monthResults[0].deltaPercentage), f:parseInt(monthResults[0].deltaPercentage) ? monthResults[0].deltaPercentage + '%' : '-'},
                weekResults[0].downloads,
                weekResults[0].previousDownloads,
                {v: parseInt(weekResults[0].deltaPercentage), f:parseInt(weekResults[0].deltaPercentage) ? weekResults[0].deltaPercentage + '%' : '-'},
            ],

            [
                monthResults[1].country,
                yearResults[1].downloads,
                monthResults[1].downloads,
                monthResults[1].previousDownloads,
                {v: parseInt(monthResults[1].deltaPercentage), f:parseInt(monthResults[1].deltaPercentage) ? monthResults[1].deltaPercentage + '%' : '-'},
                weekResults[1].downloads,
                weekResults[1].previousDownloads,
                {v: parseInt(weekResults[1].deltaPercentage), f:parseInt(weekResults[1].deltaPercentage) ? weekResults[1].deltaPercentage + '%' : '-'},
            ],

            [
                monthResults[2].country,
                yearResults[2].downloads,
                monthResults[2].downloads,
                monthResults[2].previousDownloads,
                {v: parseInt(monthResults[2].deltaPercentage), f:parseInt(monthResults[2].deltaPercentage) ? monthResults[2].deltaPercentage + '%' : '-'},
                weekResults[2].downloads,
                weekResults[2].previousDownloads,
                {v: parseInt(weekResults[2].deltaPercentage), f:parseInt(weekResults[2].deltaPercentage) ? weekResults[2].deltaPercentage + '%' : '-'},
            ],

            [
                monthResults[3].country,
                yearResults[3].downloads,
                monthResults[3].downloads,
                monthResults[3].previousDownloads,
                {v: parseInt(monthResults[3].deltaPercentage), f:parseInt(monthResults[3].deltaPercentage) ? monthResults[3].deltaPercentage + '%' : '-'},
                weekResults[3].downloads,
                weekResults[3].previousDownloads,
                {v: parseInt(weekResults[3].deltaPercentage), f:parseInt(weekResults[3].deltaPercentage) ? weekResults[3].deltaPercentage + '%' : '-'},
            ],

            [
                monthResults[4].country,
                yearResults[4].downloads,
                monthResults[4].downloads,
                monthResults[4].previousDownloads,
                {v: parseInt(monthResults[4].deltaPercentage), f:parseInt(monthResults[4].deltaPercentage) ? monthResults[4].deltaPercentage + '%' : '-'},
                weekResults[4].downloads,
                weekResults[4].previousDownloads,
                {v: parseInt(weekResults[4].deltaPercentage), f:parseInt(weekResults[4].deltaPercentage) ? weekResults[4].deltaPercentage + '%' : '-'},
            ],


            //[
            //    'Others',
            //    yearResults[5].downloads,
            //    monthResults[5].downloads,
            //    monthResults[5].previousDownloads,
            //    {v: monthResults[5].deltaPercentage, f:monthResults[5].deltaPercentage+'%'},
            //    weekResults[5].downloads,
            //    weekResults[5].previousDownloads,
            //    {v: weekResults[5].deltaPercentage, f: weekResults[5].deltaPercentage + '%'},
            //],
            //[
            //    'Total',
            //    yearResults[6].downloads,
            //    monthResults[6].downloads,
            //    monthResults[6].previousDownloads,
            //    {v: monthResults[6].deltaPercentage, f:monthResults[6].deltaPercentage+'%'},
            //    weekResults[6].downloads,
            //    weekResults[6].previousDownloads,
            //    {v: weekResults[6].deltaPercentage, f: weekResults[6].deltaPercentage + '%'},
            //],
        ])

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage:'+appID,
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('appStore-coutries-'+appID));
        table.draw(data, options);
    }


}