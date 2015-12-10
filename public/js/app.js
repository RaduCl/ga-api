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

    var getDeltaPercentage = function(currentResult, prevResult){
        return -Math.floor(100 - currentResult*100/prevResult);
    };

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
        myGarage(results, period)
    }

    //default load with week data
    getAjaxData('week');

    $('#time-interval').change(function(){
        var interval = $('#time-interval').val();
        getAjaxData(interval);
    })

    var getMyGarageData = function(){
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
                myGarage(results);
                topAppStoreDownlodsByCountry(results);
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
        var appStoreData = result.appStoreDownloads;
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Units');
        data.addColumn('number', 'Previous');
        data.addColumn('number', 'Growth');
        data.addRows([
            [ appStoreData.downloads, appStoreData.previousDownloads, {v: appStoreData.deltaPercentage, f: appStoreData.deltaPercentage+' %'}]
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

    var myGarage = function(result){
        var weekResults = result.weekResults;
        var monthResults = result.monthResults;
        var yearResults = result.yearResults;

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
                yearResults.Data.appStoreDownloads.downloads,
                monthResults.Data.appStoreDownloads.downloads,
                monthResults.Data.appStoreDownloads.previousDownloads,
                {v: monthResults.Data.appStoreDownloads.deltaPercentage, f: monthResults.Data.appStoreDownloads.deltaPercentage + ' %'},
                weekResults.Data.appStoreDownloads.downloads,
                weekResults.Data.appStoreDownloads.previousDownloads,
                {v: weekResults.Data.appStoreDownloads.deltaPercentage, f: weekResults.Data.appStoreDownloads.deltaPercentage + ' %'},
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

            [
                'Storaged Bikes',
                parseInt(yearResults.Data.savedConfigsQuery),
                parseInt(monthResults.Data.savedConfigsQuery),
                parseInt(monthResults.Data.savedConfigsQueryPrev),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.savedConfigsQuery, monthResults.Data.savedConfigsQueryPrev)),
                    f: getDeltaPercentage(monthResults.Data.savedConfigsQuery, monthResults.Data.savedConfigsQueryPrev) + ' %'
                },
                parseInt(weekResults.Data.savedConfigsQuery),
                parseInt(weekResults.Data.savedConfigsQueryPrev),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.savedConfigsQuery, weekResults.Data.savedConfigsQueryPrev)),
                    f: getDeltaPercentage(weekResults.Data.savedConfigsQuery, weekResults.Data.savedConfigsQueryPrev) + ' %'
                },
            ],

            [
                'Shared Pictures',
                parseInt(yearResults.Data.sharesQuery),
                parseInt(monthResults.Data.sharesQuery),
                parseInt(monthResults.Data.sharesQueryPrev),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.sharesQuery, monthResults.Data.sharesQueryPrev)),
                    f: getDeltaPercentage(monthResults.Data.sharesQuery, monthResults.Data.sharesQueryPrev) + ' %'
                },
                parseInt(weekResults.Data.sharesQuery),
                parseInt(weekResults.Data.sharesQuery),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.sharesQuery, weekResults.Data.sharesQueryPrev)),
                    f: getDeltaPercentage(weekResults.Data.sharesQuery, weekResults.Data.sharesQueryPrev) + ' %'
                },
            ],

            [
                'Sent to a dealer',
                parseInt(yearResults.Data.dealerContactedQuery),
                parseInt(monthResults.Data.dealerContactedQuery),
                parseInt(monthResults.Data.dealerContactedQueryPrev),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.dealerContactedQuery, monthResults.Data.dealerContactedQueryPrev)),
                    f: getDeltaPercentage(monthResults.Data.dealerContactedQuery, monthResults.Data.dealerContactedQueryPrev) + ' %'
                },
                parseInt(weekResults.Data.dealerContactedQuery),
                parseInt(weekResults.Data.dealerContactedQueryPrev),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.dealerContactedQuery, weekResults.Data.dealerContactedQueryPrev)),
                    f: getDeltaPercentage(weekResults.Data.dealerContactedQuery, weekResults.Data.dealerContactedQueryPrev) + ' %'
                },
            ],

            [
                'New Accounts',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],

            [
                'New Users',
                parseInt(yearResults.Data.visitorTypesQuery[0][1]),
                parseInt(monthResults.Data.visitorTypesQuery[0][1]),
                parseInt(monthResults.Data.visitorTypesQueryPrev[0][1]),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.visitorTypesQuery[0][1], monthResults.Data.visitorTypesQueryPrev[0][1])),
                    f: getDeltaPercentage(monthResults.Data.visitorTypesQuery[0][1], monthResults.Data.visitorTypesQueryPrev[0][1]) + ' %'
                },
                parseInt(weekResults.Data.visitorTypesQuery[0][1]),
                parseInt(weekResults.Data.visitorTypesQueryPrev[0][1]),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.visitorTypesQuery[0][1], weekResults.Data.visitorTypesQueryPrev[0][1])),
                    f: getDeltaPercentage(weekResults.Data.visitorTypesQuery[0][1], weekResults.Data.visitorTypesQueryPrev[0][1]) + ' %'
                },
            ],

            [
                'Average usage (min)',
                {
                    v: parseInt(yearResults.Data.averageUsageQuery),
                    f: parseFloat(yearResults.Data.averageUsageQuery).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQuery),
                    f: parseFloat(monthResults.Data.averageUsageQuery).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQueryPrev),
                    f: parseFloat(monthResults.Data.averageUsageQueryPrev).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.averageUsageQuery, monthResults.Data.averageUsageQueryPrev)),
                    f: getDeltaPercentage(monthResults.Data.averageUsageQuery, monthResults.Data.averageUsageQueryPrev) + ' %'
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQuery),
                    f: parseFloat(weekResults.Data.averageUsageQuery).toFixed(1)
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQueryPrev),
                    f: parseFloat(weekResults.Data.averageUsageQueryPrev).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.averageUsageQuery, weekResults.Data.averageUsageQueryPrev)),
                    f: getDeltaPercentage(weekResults.Data.averageUsageQuery, weekResults.Data.averageUsageQueryPrev) + ' %'
                },
            ],

            [
                'Popular bike',
                {v: parseInt(yearResults.Data.popularBikesQuery[0][0]), f: String(yearResults.Data.popularBikesQuery[0][0])},
                {v: parseInt(monthResults.Data.popularBikesQuery[0][0]), f: monthResults.Data.popularBikesQuery[0][0]},
                {v: parseInt(monthResults.Data.popularBikesQueryPrev[0][0]), f: monthResults.Data.popularBikesQueryPrev[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularBikesQuery[0][0]), f: weekResults.Data.popularBikesQuery[0][0]},
                {v: parseInt(weekResults.Data.popularBikesQueryPrev[0][0]), f: weekResults.Data.popularBikesQueryPrev[0][0]},
                null
            ],

            [
                'Popular Accessory',
                {v: parseInt(yearResults.Data.popularPartsQuery[0][0]), f: String(yearResults.Data.popularPartsQuery[0][0])},
                {v: parseInt(monthResults.Data.popularPartsQuery[0][0]), f: monthResults.Data.popularPartsQuery[0][0]},
                {v: parseInt(monthResults.Data.popularPartsQueryPrev[0][0]), f: monthResults.Data.popularPartsQueryPrev[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularPartsQuery[0][0]), f: weekResults.Data.popularPartsQuery[0][0]},
                {v: parseInt(weekResults.Data.popularPartsQueryPrev[0][0]), f: weekResults.Data.popularPartsQueryPrev[0][0]},
                null
            ],
        ])

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage: Sport Heritage',
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('my-garage'));
        table.draw(data, options);
    }

    var topAppStoreDownlodsByCountry = function(result) {
        var weekResults = result.weekResults.Data.appStoreDownloadsByCountry;
        var monthResults = result.monthResults.Data.appStoreDownloadsByCountry;
        var yearResults = result.yearResults.Data.appStoreDownloadsByCountry;
        var weekResultsTotal = result.weekResults.Data.appStoreDownloads;
        var monthResultsTotal = result.monthResults.Data.appStoreDownloads;
        var yearResultsTotal = result.yearResults.Data.appStoreDownloads;

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
                monthResults[0].name,
                yearResults[0].downloads,
                monthResults[0].downloads,
                monthResults[0].previousDownloads,
                {v: monthResults[0].deltaPercentage, f:monthResults[0].deltaPercentage+'%'},
                weekResults[0].downloads,
                weekResults[0].previousDownloads,
                {v: weekResults[0].deltaPercentage, f: weekResults[0].deltaPercentage + '%'},
            ],
            [
                monthResults[1].name,
                yearResults[1].downloads,
                monthResults[1].downloads,
                monthResults[1].previousDownloads,
                {v: monthResults[1].deltaPercentage, f:monthResults[1].deltaPercentage+'%'},
                weekResults[1].downloads,
                weekResults[1].previousDownloads,
                {v: weekResults[1].deltaPercentage, f: weekResults[1].deltaPercentage + '%'},
            ],
            [
                monthResults[2].name,
                yearResults[2].downloads,
                monthResults[2].downloads,
                monthResults[2].previousDownloads,
                {v: monthResults[2].deltaPercentage, f:monthResults[2].deltaPercentage+'%'},
                weekResults[2].downloads,
                weekResults[2].previousDownloads,
                {v: weekResults[2].deltaPercentage, f: weekResults[2].deltaPercentage + '%'},
            ],
            [
                monthResults[3].name,
                yearResults[3].downloads,
                monthResults[3].downloads,
                monthResults[3].previousDownloads,
                {v: monthResults[3].deltaPercentage, f:monthResults[3].deltaPercentage+'%'},
                weekResults[3].downloads,
                weekResults[3].previousDownloads,
                {v: weekResults[3].deltaPercentage, f: weekResults[3].deltaPercentage + '%'},
            ],
            [
                monthResults[4].name,
                yearResults[4].downloads,
                monthResults[4].downloads,
                monthResults[4].previousDownloads,
                {v: monthResults[4].deltaPercentage, f:monthResults[4].deltaPercentage+'%'},
                weekResults[4].downloads,
                weekResults[4].previousDownloads,
                {v: weekResults[4].deltaPercentage, f: weekResults[4].deltaPercentage + '%'},
            ],
            [
                'Total',
                yearResultsTotal.downloads,
                monthResultsTotal.downloads,
                monthResultsTotal.previousDownloads,
                {v: monthResultsTotal.deltaPercentage, f:monthResultsTotal.deltaPercentage+'%'},
                weekResultsTotal.downloads,
                weekResultsTotal.previousDownloads,
                {v: weekResultsTotal.deltaPercentage, f: weekResultsTotal.deltaPercentage + '%'},
            ],
        ])

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage: Sport Heritage',
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('appStore-coutries'));
        table.draw(data, options);
    }


}