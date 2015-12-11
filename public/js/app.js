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
        return Math.floor((currentResult-prevResult)/prevResult*100);
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
        myGarage(results, period);
        myGarageMG(results, period);
        myGarageMT(results, period);
        myGarageSS(results, period);
    }

    //default load with week data
    getAjaxData('week');

    $('#time-interval').change(function(){
        var interval = $('#time-interval').val();
        getAjaxData(interval);
    })

    var csvData = []
    //function drawToolbar() {
    //    var components = [
    //        {type: 'csv', datasource: csvData},
    //    ];
    //
    //    var container = document.getElementById('toolbar_div');
    //    google.visualization.drawToolbar(container, components);
    //};
    //drawToolbar()



    // This must be a hyperlink
    $("#export-mygarageMG").click(function (event) {
        var csv = $('#my-garagemg').table2CSV({delivery:'value'});
        window.location.href = 'data:text/csv;charset=UTF-8,'+ encodeURIComponent(csv);
    });
    $("#export-mygarageMT").click(function (event) {
        var csv = $('#my-garagemt').table2CSV({delivery:'value'});
        window.location.href = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(csv);
    });
    $("#export-mygarageSS").click(function (event) {
        var csv = $('#my-garagess').table2CSV({delivery:'_blank'});
        window.location.href = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(csv);
    });



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
                myGarageMG(results);
                myGarageMT(results);
                myGarageSS(results);
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
                'Send to dealer attempts',
                parseInt(yearResults.Data.attdealerContactedQuery),
                parseInt(monthResults.Data.attdealerContactedQuery),
                parseInt(monthResults.Data.attdealerContactedQueryPrev),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.attdealerContactedQuery, monthResults.Data.attdealerContactedQueryPrev)),
                    f: getDeltaPercentage(monthResults.Data.attdealerContactedQuery, monthResults.Data.attdealerContactedQueryPrev) + ' %'
                },
                parseInt(weekResults.Data.attdealerContactedQuery),
                parseInt(weekResults.Data.attdealerContactedQueryPrev),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.attdealerContactedQuery, weekResults.Data.attdealerContactedQueryPrev)),
                    f: getDeltaPercentage(weekResults.Data.attdealerContactedQuery, weekResults.Data.attdealerContactedQueryPrev) + ' %'
                },
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
            'title': 'My Garage: All Apps',
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('my-garage'));
        table.draw(data, options);
    }

    var myGarageMG = function(result){
        var weekResults = result.weekResults;
        var monthResults = result.monthResults;
        var yearResults = result.yearResults;

        csvData['myGarageMG'] = [
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
                parseInt(yearResults.Data.savedConfigsQueryMG),
                parseInt(monthResults.Data.savedConfigsQueryMG),
                parseInt(monthResults.Data.savedConfigsQueryPrevMG),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.savedConfigsQueryMG, monthResults.Data.savedConfigsQueryPrevMG)),
                    f: getDeltaPercentage(monthResults.Data.savedConfigsQueryMG, monthResults.Data.savedConfigsQueryPrevMG) + ' %'
                },
                parseInt(weekResults.Data.savedConfigsQueryMG),
                parseInt(weekResults.Data.savedConfigsQueryPrevMG),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.savedConfigsQueryMG, weekResults.Data.savedConfigsQueryPrevMG)),
                    f: getDeltaPercentage(weekResults.Data.savedConfigsQueryMG, weekResults.Data.savedConfigsQueryPrevMG) + ' %'
                },
            ],

            [
                'Shared Pictures',
                parseInt(yearResults.Data.sharesQueryMG),
                parseInt(monthResults.Data.sharesQueryMG),
                parseInt(monthResults.Data.sharesQueryPrevMG),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.sharesQueryMG, monthResults.Data.sharesQueryPrevMG)),
                    f: getDeltaPercentage(monthResults.Data.sharesQueryMG, monthResults.Data.sharesQueryPrevMG) + ' %'
                },
                parseInt(weekResults.Data.sharesQueryMG),
                parseInt(weekResults.Data.sharesQueryMG),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.sharesQueryMG, weekResults.Data.sharesQueryPrevMG)),
                    f: getDeltaPercentage(weekResults.Data.sharesQueryMG, weekResults.Data.sharesQueryPrevMG) + ' %'
                },
            ],

            [
                'Sent to a dealer',
                parseInt(yearResults.Data.dealerContactedQueryMG),
                parseInt(monthResults.Data.dealerContactedQueryMG),
                parseInt(monthResults.Data.dealerContactedQueryPrevMG),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.dealerContactedQueryMG, monthResults.Data.dealerContactedQueryPrevMG)),
                    f: getDeltaPercentage(monthResults.Data.dealerContactedQueryMG, monthResults.Data.dealerContactedQueryPrevMG) + ' %'
                },
                parseInt(weekResults.Data.dealerContactedQueryMG),
                parseInt(weekResults.Data.dealerContactedQueryPrevMG),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.dealerContactedQueryMG, weekResults.Data.dealerContactedQueryPrevMG)),
                    f: getDeltaPercentage(weekResults.Data.dealerContactedQueryMG, weekResults.Data.dealerContactedQueryPrevMG) + ' %'
                },
            ],

            [
                'Send to dealer attempts',
                parseInt(yearResults.Data.attdealerContactedQueryMG),
                parseInt(monthResults.Data.attdealerContactedQueryMG),
                parseInt(monthResults.Data.attdealerContactedQueryPrevMG),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.attdealerContactedQueryMG, monthResults.Data.attdealerContactedQueryPrevMG)),
                    f: getDeltaPercentage(monthResults.Data.attdealerContactedQueryMG, monthResults.Data.attdealerContactedQueryPrevMG) + ' %'
                },
                parseInt(weekResults.Data.attdealerContactedQueryMG),
                parseInt(weekResults.Data.attdealerContactedQueryPrevMG),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.attdealerContactedQueryMG, weekResults.Data.attdealerContactedQueryPrevMG)),
                    f: getDeltaPercentage(weekResults.Data.attdealerContactedQueryMG, weekResults.Data.attdealerContactedQueryPrevMG) + ' %'
                },
            ],

            [
                'New Users',
                parseInt(yearResults.Data.visitorTypesQueryMG[0][1]),
                parseInt(monthResults.Data.visitorTypesQueryMG[0][1]),
                parseInt(monthResults.Data.visitorTypesQueryPrevMG[0][1]),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.visitorTypesQueryMG[0][1], monthResults.Data.visitorTypesQueryPrevMG[0][1])),
                    f: getDeltaPercentage(monthResults.Data.visitorTypesQueryMG[0][1], monthResults.Data.visitorTypesQueryPrevMG[0][1]) + ' %'
                },
                parseInt(weekResults.Data.visitorTypesQueryMG[0][1]),
                parseInt(weekResults.Data.visitorTypesQueryPrevMG[0][1]),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.visitorTypesQueryMG[0][1], weekResults.Data.visitorTypesQueryPrevMG[0][1])),
                    f: getDeltaPercentage(weekResults.Data.visitorTypesQueryMG[0][1], weekResults.Data.visitorTypesQueryPrevMG[0][1]) + ' %'
                },
            ],

            [
                'Average usage (min)',
                {
                    v: parseInt(yearResults.Data.averageUsageQueryMG),
                    f: parseFloat(yearResults.Data.averageUsageQueryMG).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQueryMG),
                    f: parseFloat(monthResults.Data.averageUsageQueryMG).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQueryPrevMG),
                    f: parseFloat(monthResults.Data.averageUsageQueryPrevMG).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.averageUsageQueryMG, monthResults.Data.averageUsageQueryPrevMG)),
                    f: getDeltaPercentage(monthResults.Data.averageUsageQueryMG, monthResults.Data.averageUsageQueryPrevMG) + ' %'
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQueryMG),
                    f: parseFloat(weekResults.Data.averageUsageQueryMG).toFixed(1)
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQueryPrevMG),
                    f: parseFloat(weekResults.Data.averageUsageQueryPrevMG).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.averageUsageQueryMG, weekResults.Data.averageUsageQueryPrevMG)),
                    f: getDeltaPercentage(weekResults.Data.averageUsageQueryMG, weekResults.Data.averageUsageQueryPrevMG) + ' %'
                },
            ],

            [
                'Popular bike',
                {v: parseInt(yearResults.Data.popularBikesQueryMG[0][0]), f: String(yearResults.Data.popularBikesQueryMG[0][0])},
                {v: parseInt(monthResults.Data.popularBikesQueryMG[0][0]), f: monthResults.Data.popularBikesQueryMG[0][0]},
                {v: parseInt(monthResults.Data.popularBikesQueryPrevMG[0][0]), f: monthResults.Data.popularBikesQueryPrevMG[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularBikesQueryMG[0][0]), f: weekResults.Data.popularBikesQueryMG[0][0]},
                {v: parseInt(weekResults.Data.popularBikesQueryPrevMG[0][0]), f: weekResults.Data.popularBikesQueryPrevMG[0][0]},
                null
            ],

            [
                'Popular Accessory',
                {v: parseInt(yearResults.Data.popularPartsQueryMG[0][0]), f: String(yearResults.Data.popularPartsQueryMG[0][0])},
                {v: parseInt(monthResults.Data.popularPartsQueryMG[0][0]), f: monthResults.Data.popularPartsQueryMG[0][0]},
                {v: parseInt(monthResults.Data.popularPartsQueryPrevMG[0][0]), f: monthResults.Data.popularPartsQueryPrevMG[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularPartsQueryMG[0][0]), f: weekResults.Data.popularPartsQueryMG[0][0]},
                {v: parseInt(weekResults.Data.popularPartsQueryPrevMG[0][0]), f: weekResults.Data.popularPartsQueryPrevMG[0][0]},
                null
            ],
        ]
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'APP KPI');
        data.addColumn('number', 'YTD');
        data.addColumn('number', 'Month');
        data.addColumn('number', 'Previous Month');
        data.addColumn('number', 'Growth month');
        data.addColumn('number', 'Week');
        data.addColumn('number', 'Previous Week');
        data.addColumn('number', 'Growth Week');
        data.addRows(csvData['myGarageMG'])

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage: All Apps',
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('my-garagemg'));
        table.draw(data, options);
    }

    var myGarageMT = function(result){
        var weekResults = result.weekResults;
        var monthResults = result.monthResults;
        var yearResults = result.yearResults;

        csvData['myGarageMT'] = [
            [
                'Downloads iOS',
                yearResults.Data.appStoreDownloadsMT.downloads,
                monthResults.Data.appStoreDownloadsMT.downloads,
                monthResults.Data.appStoreDownloadsMT.previousDownloads,
                {v: monthResults.Data.appStoreDownloadsMT.deltaPercentage, f: monthResults.Data.appStoreDownloadsMT.deltaPercentage + ' %'},
                weekResults.Data.appStoreDownloadsMT.downloads,
                weekResults.Data.appStoreDownloadsMT.previousDownloads,
                {v: weekResults.Data.appStoreDownloadsMT.deltaPercentage, f: weekResults.Data.appStoreDownloadsMT.deltaPercentage + ' %'},
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
                parseInt(yearResults.Data.savedConfigsQueryMT),
                parseInt(monthResults.Data.savedConfigsQueryMT),
                parseInt(monthResults.Data.savedConfigsQueryPreMTv),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.savedConfigsQueryMT, monthResults.Data.savedConfigsQueryPrevMT)),
                    f: getDeltaPercentage(monthResults.Data.savedConfigsQueryMT, monthResults.Data.savedConfigsQueryPrevMT) + ' %'
                },
                parseInt(weekResults.Data.savedConfigsQueryMT),
                parseInt(weekResults.Data.savedConfigsQueryPrevMT),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.savedConfigsQueryMT, weekResults.Data.savedConfigsQueryPrevMT)),
                    f: getDeltaPercentage(weekResults.Data.savedConfigsQueryMT, weekResults.Data.savedConfigsQueryPrevMT) + ' %'
                },
            ],

            [
                'Shared Pictures',
                parseInt(yearResults.Data.sharesQueryMT),
                parseInt(monthResults.Data.sharesQueryMT),
                parseInt(monthResults.Data.sharesQueryPrevMT),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.sharesQueryMT, monthResults.Data.sharesQueryPrevMT)),
                    f: getDeltaPercentage(monthResults.Data.sharesQueryMT, monthResults.Data.sharesQueryPrevMT) + ' %'
                },
                parseInt(weekResults.Data.sharesQueryMT),
                parseInt(weekResults.Data.sharesQueryMT),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.sharesQueryMT, weekResults.Data.sharesQueryPrevMT)),
                    f: getDeltaPercentage(weekResults.Data.sharesQueryMT, weekResults.Data.sharesQueryPrevMT) + ' %'
                },
            ],

            [
                'Sent to a dealer',
                parseInt(yearResults.Data.dealerContactedQueryMT),
                parseInt(monthResults.Data.dealerContactedQueryMT),
                parseInt(monthResults.Data.dealerContactedQueryPrevMT),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.dealerContactedQueryMT, monthResults.Data.dealerContactedQueryPrevMT)),
                    f: getDeltaPercentage(monthResults.Data.dealerContactedQueryMT, monthResults.Data.dealerContactedQueryPrevMT) + ' %'
                },
                parseInt(weekResults.Data.dealerContactedQueryMT),
                parseInt(weekResults.Data.dealerContactedQueryPrevMT),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.dealerContactedQueryMT, weekResults.Data.dealerContactedQueryPrevMT)),
                    f: getDeltaPercentage(weekResults.Data.dealerContactedQueryMT, weekResults.Data.dealerContactedQueryPrevMT) + ' %'
                },
            ],

            [
                'Send to dealer attempts',
                parseInt(yearResults.Data.attdealerContactedQueryMT),
                parseInt(monthResults.Data.attdealerContactedQueryMT),
                parseInt(monthResults.Data.attdealerContactedQueryPrevMT),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.attdealerContactedQueryMT, monthResults.Data.attdealerContactedQueryPrevMT)),
                    f: getDeltaPercentage(monthResults.Data.attdealerContactedQueryMT, monthResults.Data.attdealerContactedQueryPrevMT) + ' %'
                },
                parseInt(weekResults.Data.attdealerContactedQueryMT),
                parseInt(weekResults.Data.attdealerContactedQueryPrevMT),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.attdealerContactedQueryMT, weekResults.Data.attdealerContactedQueryPrevMT)),
                    f: getDeltaPercentage(weekResults.Data.attdealerContactedQueryMT, weekResults.Data.attdealerContactedQueryPrevMT) + ' %'
                },
            ],

            [
                'New Users',
                parseInt(yearResults.Data.visitorTypesQueryMT[0][1]),
                parseInt(monthResults.Data.visitorTypesQueryMT[0][1]),
                parseInt(monthResults.Data.visitorTypesQueryPrevMT[0][1]),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.visitorTypesQueryMT[0][1], monthResults.Data.visitorTypesQueryPrevMT[0][1])),
                    f: getDeltaPercentage(monthResults.Data.visitorTypesQueryMT[0][1], monthResults.Data.visitorTypesQueryPrevMT[0][1]) + ' %'
                },
                parseInt(weekResults.Data.visitorTypesQueryMT[0][1]),
                parseInt(weekResults.Data.visitorTypesQueryPrevMT[0][1]),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.visitorTypesQueryMT[0][1], weekResults.Data.visitorTypesQueryPrevMT[0][1])),
                    f: getDeltaPercentage(weekResults.Data.visitorTypesQueryMT[0][1], weekResults.Data.visitorTypesQueryPrevMT[0][1]) + ' %'
                },
            ],

            [
                'Average usage (min)',
                {
                    v: parseInt(yearResults.Data.averageUsageQueryMT),
                    f: parseFloat(yearResults.Data.averageUsageQueryMT).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQueryMT),
                    f: parseFloat(monthResults.Data.averageUsageQueryMT).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQueryPrevMT),
                    f: parseFloat(monthResults.Data.averageUsageQueryPrevMT).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.averageUsageQueryMT, monthResults.Data.averageUsageQueryPrevMT)),
                    f: getDeltaPercentage(monthResults.Data.averageUsageQueryMT, monthResults.Data.averageUsageQueryPrevMT) + ' %'
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQueryMT),
                    f: parseFloat(weekResults.Data.averageUsageQueryMT).toFixed(1)
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQueryPrevMT),
                    f: parseFloat(weekResults.Data.averageUsageQueryPrevMT).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.averageUsageQueryMT, weekResults.Data.averageUsageQueryPrevMT)),
                    f: getDeltaPercentage(weekResults.Data.averageUsageQueryMT, weekResults.Data.averageUsageQueryPrevMT) + ' %'
                },
            ],

            [
                'Popular bike',
                {v: parseInt(yearResults.Data.popularBikesQueryMT[0][0]), f: String(yearResults.Data.popularBikesQueryMT[0][0])},
                {v: parseInt(monthResults.Data.popularBikesQueryMT[0][0]), f: monthResults.Data.popularBikesQueryMT[0][0]},
                {v: parseInt(monthResults.Data.popularBikesQueryPrevMT[0][0]), f: monthResults.Data.popularBikesQueryPrevMT[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularBikesQueryMT[0][0]), f: weekResults.Data.popularBikesQueryMT[0][0]},
                {v: parseInt(weekResults.Data.popularBikesQueryPrevMT[0][0]), f: weekResults.Data.popularBikesQueryPrevMT[0][0]},
                null
            ],

            [
                'Popular Accessory',
                {v: parseInt(yearResults.Data.popularPartsQueryMT[0][0]), f: String(yearResults.Data.popularPartsQueryMT[0][0])},
                {v: parseInt(monthResults.Data.popularPartsQueryMT[0][0]), f: monthResults.Data.popularPartsQueryMT[0][0]},
                {v: parseInt(monthResults.Data.popularPartsQueryPrevMT[0][0]), f: monthResults.Data.popularPartsQueryPrevMT[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularPartsQueryMT[0][0]), f: weekResults.Data.popularPartsQueryMT[0][0]},
                {v: parseInt(weekResults.Data.popularPartsQueryPrevMT[0][0]), f: weekResults.Data.popularPartsQueryPrevMT[0][0]},
                null
            ],
        ]
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'APP KPI');
        data.addColumn('number', 'YTD');
        data.addColumn('number', 'Month');
        data.addColumn('number', 'Previous Month');
        data.addColumn('number', 'Growth month');
        data.addColumn('number', 'Week');
        data.addColumn('number', 'Previous Week');
        data.addColumn('number', 'Growth Week');
        data.addRows(csvData['myGarageMT'])

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage: All Apps',
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('my-garagemt'));
        table.draw(data, options);
    }

    var myGarageSS = function(result){
        var weekResults = result.weekResults;
        var monthResults = result.monthResults;
        var yearResults = result.yearResults;

        csvData['myGarageSS'] =[
            [
                'Downloads iOS',
                yearResults.Data.appStoreDownloadsSS.downloads,
                monthResults.Data.appStoreDownloadsSS.downloads,
                monthResults.Data.appStoreDownloadsSS.previousDownloads,
                {v: monthResults.Data.appStoreDownloadsSS.deltaPercentage, f: monthResults.Data.appStoreDownloadsSS.deltaPercentage + ' %'},
                weekResults.Data.appStoreDownloadsSS.downloads,
                weekResults.Data.appStoreDownloadsSS.previousDownloads,
                {v: weekResults.Data.appStoreDownloadsSS.deltaPercentage, f: weekResults.Data.appStoreDownloadsSS.deltaPercentage + ' %'},
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
                parseInt(yearResults.Data.savedConfigsQuerySS),
                parseInt(monthResults.Data.savedConfigsQuerySS),
                parseInt(monthResults.Data.savedConfigsQueryPrevSS),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.savedConfigsQuerySS, monthResults.Data.savedConfigsQueryPrevSS)),
                    f: getDeltaPercentage(monthResults.Data.savedConfigsQuerySS, monthResults.Data.savedConfigsQueryPrevSS) + ' %'
                },
                parseInt(weekResults.Data.savedConfigsQuerySS),
                parseInt(weekResults.Data.savedConfigsQueryPrevSS),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.savedConfigsQuerySS, weekResults.Data.savedConfigsQueryPrevSS)),
                    f: getDeltaPercentage(weekResults.Data.savedConfigsQuerySS, weekResults.Data.savedConfigsQueryPrevSS) + ' %'
                },
            ],

            [
                'Shared Pictures',
                parseInt(yearResults.Data.sharesQuerySS),
                parseInt(monthResults.Data.sharesQuerySS),
                parseInt(monthResults.Data.sharesQueryPrevSS),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.sharesQuerySS, monthResults.Data.sharesQueryPrevSS)),
                    f: getDeltaPercentage(monthResults.Data.sharesQuerySS, monthResults.Data.sharesQueryPrevSS) + ' %'
                },
                parseInt(weekResults.Data.sharesQuerySS),
                parseInt(weekResults.Data.sharesQuerySS),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.sharesQuerySS, weekResults.Data.sharesQueryPrevSS)),
                    f: getDeltaPercentage(weekResults.Data.sharesQuerySS, weekResults.Data.sharesQueryPrevSS) + ' %'
                },
            ],

            [
                'Sent to a dealer',
                parseInt(yearResults.Data.dealerContactedQuerySS),
                parseInt(monthResults.Data.dealerContactedQuerySS),
                parseInt(monthResults.Data.dealerContactedQueryPrevSS),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.dealerContactedQuerySS, monthResults.Data.dealerContactedQueryPrevSS)),
                    f: getDeltaPercentage(monthResults.Data.dealerContactedQuerySS, monthResults.Data.dealerContactedQueryPrevSS) + ' %'
                },
                parseInt(weekResults.Data.dealerContactedQuerySS),
                parseInt(weekResults.Data.dealerContactedQueryPrevSS),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.dealerContactedQuerySS, weekResults.Data.dealerContactedQueryPrevSS)),
                    f: getDeltaPercentage(weekResults.Data.dealerContactedQuerySS, weekResults.Data.dealerContactedQueryPrevSS) + ' %'
                },
            ],

            [
                'Send to dealer attempts',
                parseInt(yearResults.Data.attdealerContactedQuerySS),
                parseInt(monthResults.Data.attdealerContactedQuerySS),
                parseInt(monthResults.Data.attdealerContactedQueryPrevSS),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.attdealerContactedQuerySS, monthResults.Data.attdealerContactedQueryPrevSS)),
                    f: getDeltaPercentage(monthResults.Data.attdealerContactedQuerySS, monthResults.Data.attdealerContactedQueryPrevSS) + ' %'
                },
                parseInt(weekResults.Data.attdealerContactedQuerySS),
                parseInt(weekResults.Data.attdealerContactedQueryPrevSS),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.attdealerContactedQuerySS, weekResults.Data.attdealerContactedQueryPrevSS)),
                    f: getDeltaPercentage(weekResults.Data.attdealerContactedQuerySS, weekResults.Data.attdealerContactedQueryPrevSS) + ' %'
                },
            ],

            [
                'New Users',
                parseInt(yearResults.Data.visitorTypesQuerySS[0][1]),
                parseInt(monthResults.Data.visitorTypesQuerySS[0][1]),
                parseInt(monthResults.Data.visitorTypesQueryPrevSS[0][1]),
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.visitorTypesQuerySS[0][1], monthResults.Data.visitorTypesQueryPrevSS[0][1])),
                    f: getDeltaPercentage(monthResults.Data.visitorTypesQuerySS[0][1], monthResults.Data.visitorTypesQueryPrevSS[0][1]) + ' %'
                },
                parseInt(weekResults.Data.visitorTypesQuerySS[0][1]),
                parseInt(weekResults.Data.visitorTypesQueryPrevSS[0][1]),
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.visitorTypesQuerySS[0][1], weekResults.Data.visitorTypesQueryPrevSS[0][1])),
                    f: getDeltaPercentage(weekResults.Data.visitorTypesQuerySS[0][1], weekResults.Data.visitorTypesQueryPrevSS[0][1]) + ' %'
                },
            ],

            [
                'Average usage (min)',
                {
                    v: parseInt(yearResults.Data.averageUsageQuerySS),
                    f: parseFloat(yearResults.Data.averageUsageQuerySS).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQuerySS),
                    f: parseFloat(monthResults.Data.averageUsageQuerySS).toFixed(1)
                },
                {
                    v: parseInt(monthResults.Data.averageUsageQueryPrevSS),
                    f: parseFloat(monthResults.Data.averageUsageQueryPrevSS).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(monthResults.Data.averageUsageQuerySS, monthResults.Data.averageUsageQueryPrevSS)),
                    f: getDeltaPercentage(monthResults.Data.averageUsageQuerySS, monthResults.Data.averageUsageQueryPrevSS) + ' %'
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQuerySS),
                    f: parseFloat(weekResults.Data.averageUsageQuerySS).toFixed(1)
                },
                {
                    v: parseInt(weekResults.Data.averageUsageQueryPrevSS),
                    f: parseFloat(weekResults.Data.averageUsageQueryPrevSS).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(weekResults.Data.averageUsageQuerySS, weekResults.Data.averageUsageQueryPrevSS)),
                    f: getDeltaPercentage(weekResults.Data.averageUsageQuerySS, weekResults.Data.averageUsageQueryPrevSS) + ' %'
                },
            ],

            [
                'Popular bike',
                {v: parseInt(yearResults.Data.popularBikesQuerySS[0][0]), f: String(yearResults.Data.popularBikesQuerySS[0][0])},
                {v: parseInt(monthResults.Data.popularBikesQuerySS[0][0]), f: monthResults.Data.popularBikesQuerySS[0][0]},
                {v: parseInt(monthResults.Data.popularBikesQueryPrevSS[0][0]), f: monthResults.Data.popularBikesQueryPrevSS[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularBikesQuerySS[0][0]), f: weekResults.Data.popularBikesQuerySS[0][0]},
                {v: parseInt(weekResults.Data.popularBikesQueryPrevSS[0][0]), f: weekResults.Data.popularBikesQueryPrevSS[0][0]},
                null
            ],

            [
                'Popular Accessory',
                {v: parseInt(yearResults.Data.popularPartsQuerySS[0][0]), f: String(yearResults.Data.popularPartsQuerySS[0][0])},
                {v: parseInt(monthResults.Data.popularPartsQuerySS[0][0]), f: monthResults.Data.popularPartsQuerySS[0][0]},
                {v: parseInt(monthResults.Data.popularPartsQueryPrevSS[0][0]), f: monthResults.Data.popularPartsQueryPrevSS[0][0]},
                null,
                {v: parseInt(weekResults.Data.popularPartsQuerySS[0][0]), f: weekResults.Data.popularPartsQuerySS[0][0]},
                {v: parseInt(weekResults.Data.popularPartsQueryPrevSS[0][0]), f: weekResults.Data.popularPartsQueryPrevSS[0][0]},
                null
            ],
        ]
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'APP KPI');
        data.addColumn('number', 'YTD');
        data.addColumn('number', 'Month');
        data.addColumn('number', 'Previous Month');
        data.addColumn('number', 'Growth month');
        data.addColumn('number', 'Week');
        data.addColumn('number', 'Previous Week');
        data.addColumn('number', 'Growth Week');
        data.addRows(csvData['myGarageSS'])

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage: All Apps',
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('my-garagess'));
        table.draw(data, options);
    }

    var topAppStoreDownlodsByCountry = function(result) {
        var weekResults = result.weekResults.Data.appStoreDownloadsByCountry;
        var monthResults = result.monthResults.Data.appStoreDownloadsByCountry;
        var yearResults = result.yearResults.Data.appStoreDownloadsByCountry;
        //var weekResultsTotal = result.weekResults.Data.appStoreDownloadsByCountry;
        //var monthResultsTotal = result.monthResults.Data.appStoreDownloadsByCountry;
        //var yearResultsTotal = result.yearResults.Data.appStoreDownloadsByCountry;

        csvData['appStoreDLbyCountry'] = [
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
                'Others',
                yearResults[5].downloads,
                monthResults[5].downloads,
                monthResults[5].previousDownloads,
                {v: monthResults[5].deltaPercentage, f:monthResults[5].deltaPercentage+'%'},
                weekResults[5].downloads,
                weekResults[5].previousDownloads,
                {v: weekResults[5].deltaPercentage, f: weekResults[5].deltaPercentage + '%'},
            ],
            [
                'Total',
                yearResults[6].downloads,
                monthResults[6].downloads,
                monthResults[6].previousDownloads,
                {v: monthResults[6].deltaPercentage, f:monthResults[6].deltaPercentage+'%'},
                weekResults[6].downloads,
                weekResults[6].previousDownloads,
                {v: weekResults[6].deltaPercentage, f: weekResults[6].deltaPercentage + '%'},
            ],
        ]
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Country');
        data.addColumn('number', 'YTD');
        data.addColumn('number', 'Month');
        data.addColumn('number', 'Previous Month');
        data.addColumn('number', 'Growth month');
        data.addColumn('number', 'Week');
        data.addColumn('number', 'Previous Week');
        data.addColumn('number', 'Growth Week');
        data.addRows(csvData['appStoreDLbyCountry'])

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