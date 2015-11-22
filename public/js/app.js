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

    var getAjaxData = function(){
        //TODO implmenent month or week time interval for the queries - this can be a value from dropdown select
        //var date = '2015-11-05'; // can be a value from a txtbox
        var url = '/ga-data';
        $.ajax({
            url: url,
            type: 'GET',
            success: function(results){
                charts(results);
            }
        });
    }

    var charts = function(results){
        newReturningUsersData(results);
        countryVisitsData(results);
        downloadsByOsData(results);
        daylyUsersData(results);
        recencyData(results);
        loyaltyData(results);
    }



    getAjaxData();

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

        //var data = new google.visualization.DataTable();

        // convert array of arrays to objects
        //var convertedToObj = ajaxData.map(function(arr){
        //    var obj = {}
        //    obj.country = arr[0]
        //    obj.visits = parseInt(arr[1])
        //    return obj
        //})
        // sort descending by number of visits
        //var sortedVisitNrDesc = convertedToObj.sort(function(a, b){
        //    return parseInt(b.visits)-parseInt(a.visits)
        //})

        //data.addColumn('string', 'Country');
        //data.addColumn('number', 'Users');
        //for(var i = 0; i<5; i++){
        //    data.addRows([
        //        [convertedToObj[i].country, {v:convertedToObj[i].visits}]
        //    ]);
        //}

        var options = {
            'title': 'Top 5 Countries by Total Users',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_c = new google.visualization.Table(document.getElementById('top-countries'));
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
            formatedArr = [];
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
            'pieHole': 0.5,
            'pieSliceText': 'percentage',
            'titleTextStyle': {
                fontSize: 20
            },
            'chartArea': {
                left: 50,
                top: 40,
                width: "100%",
                height: "100%"
            },
            'slices': {
            }
        };

        var chart = new google.visualization.PieChart(document.getElementById('total-downloads-byOS'));
        chart.draw(data, options);
    }

    function daylyUsersData(result){
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
            vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('user-increase'));
        chart.draw(data, options);

    }

    function recencyData(result){
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
            bar: {groupWidth: "60%"},
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

    function loyaltyData(result){
        var ajaxData = result.loyaltyQuery;
        var formatedData = ajaxData.map(function(element){
            element[0] = parseInt(element[0]);
            element[1] = parseInt(element[1]);
            return element;
        }).sort(function(a,b){
            return a[0] - b[0]
        })

        var filterAndSumSessions = function(array, min, max){
            console.log(array)
            var sessionsSum =  array.filter(function(element){
                if (element[0] >= min && element[0] <= max)
                {
                    //element.shift()
                    return element
                }
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

        console.log('formatedData is: '+formatedData)
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

    function getMyData(linkToGs, myQuery, responseCallback) {

        var my_query = new google.visualization.Query(linkToGs);
        my_query.setQuery(myQuery);
        my_query.send(handleQueryReposnse);

        function handleQueryReposnse(response) {
            if (response.isError()) {
                alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
                return;
            }
            responseCallback(response);
        };
    };


    // var summary = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1&pub=1&sheet=summary','select A', function(result) {

    //     document.getElementById("summary").innerHTML = result.getDataTable().getValue(0,0);

    // });

    //var table = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1:S5&pub=1&sheet=table','select A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S', function(result) {
    //
    //    var data = result.getDataTable();
    //
    //    var formatter = new google.visualization.ColorFormat();
    //    formatter.addRange(null, 0, '#FF0000', '');
    //    formatter.addRange(0, null, '#41CC00', '');
    //
    //    for (var i=2;i<20;i=i+2) {
    //        formatter.format(data, i);
    //    }
    //
    //    var table_kpi = new google.visualization.Table(document.getElementById('user-increase2'));
    //    table_kpi.draw(data, {allowHtml : true});
    //
    //});

    // App Usage statistics



    function countryVisits(){
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Country');
        data.addColumn('number', 'Users');
        data.addRows([
          ['Japan', {v:12, f:'12.0%'}],
          ['France', {v:-7.3, f:'-7.3%'}],
          ['Italy', {v:0, f:'0%'}],
          ['Germany', {v:-2.1, f:'-2.1%'}],
          ['Spain', {v:22, f:'22.0%'}]
        ]);
        var options = {
            'title': 'Top 5 Countries by Total Users',
            'showRowNumber': true,
            'width': "100%",
            'height': "100%"
        }
        var table_c = new google.visualization.Table(document.getElementById('top-countries'));
        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 1);
        table_c.draw(data, options);
    }

    function newReturningUsers(){
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'User Type');
        data.addColumn('number', 'Sessions');
        data.addRows([
                ['Returning Visitors', {v:6974}],
                ['New Visitors', {v: 1816}]
            ]);
        var options = {
            'title': 'New versus Returning Users',
            'width': '100%',
            'height': '100%'
        }
        var table= new google.visualization.Table(document.getElementById('new-vs-returning-users'));
        // var formatter = new google.visualization.ArrowFormat();
        // formatter.format(data, 1);
        table.draw(data, options);
    }

    function googlePlayDownloads(){
        var data = new google.visualization.arrayToDataTable([
          ['Store Listing Visitors', 'Users'],
          ["Store Listing Visitors\n1594", 1594],
          ["Installers\n516", 516]
        ]);

        var options = {
          title: 'Downloads by Google Play Store',
          width: "100%",
          height: "100%",
          legend: { position: 'none' },
          // chart: { subtitle: 'popularity by percentage' },
          // axes: {
          //   x: {
          //     0: { side: 'top', label: 'White to move'} // Top x-axis.
          //   }
          // },
          bar: { groupWidth: "90%" }
        };

        var chart = new google.charts.Bar(document.getElementById('google-play-store-downloads'));
        // Convert the Classic options to Material options.
        chart.draw(data,options);
    }

    function appStoreDownloads(){
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Units');
        data.addColumn('number', 'Previous');
        data.addColumn('number', 'Range');
        data.addRows([
                [{v: 726}, {v: 776}, {v:-6.4}]
            ]);
        var options = {
            'title': 'Total Downloads by App Store',
            'width': '100%',
            'height': '100%'
        }
        var table= new google.visualization.Table(document.getElementById('app-store-downloads'));
        table.draw(data, options);
    }

    function daylyUsers(){
        var data = google.visualization.arrayToDataTable([
          ['Day', 'Users'],
          ['Oct 5',  1000],
          ['Oct 6',  1170],
          ['Oct 7',  660],
          ['Oct 8',  1030],
          ['Oct 9',  1630],
          ['Oct 10',  1250],
          ['Oct 11',  630]
        ]);

        var options = {
          // title: 'User Increase / Decrease',
          // hAxis: {title: 'Month',  titleTextStyle: {color: '#333'}},
          hAxis: {titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('user-increase'));
        chart.draw(data, options);

    }

    function loyalty(){
        var data = google.visualization.arrayToDataTable([
                ["Session Instances", "Sessions"],
                ["1", 1816],
                ["2", 1760],
                ["3", 1020],
                ["4", 857],
                ["5", 582],
                ["6", 471],
                ["7", 343],
                ["8", 281],
                ["9", 884],
                ["9-14", 884],
                ["15-25", 481],
                ["26-50", 205],
                ["51-100", 94],
                ["101-200", 1]
            ]);

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

    function recency(){
        var data = google.visualization.arrayToDataTable([
                ["Days between Sessions", "Sessions"],
                ["< 1 day", 1816],
                ["1", 5578],
                ["2", 275],
                ["3", 163],
                ["4", 75],
                ["5", 61],
                ["6", 51],
                ["7", 46],
                ["8-14", 277],
                ["15-30", 248],
                ["31-60", 13]
            ]);

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
            bar: {groupWidth: "60%"},
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

    function behaviorFlowByOS(){
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'From');
        data.addColumn('string', 'To');
        data.addColumn('number', 'Sessions');
        data.addRows([
            [ 'Android', 'Home', 2300 ],
            [ 'iOS', 'Home', 1900 ],

            [ 'Home', 'RangeSelect', 2100 ],
            [ 'Home', 'MyGarage', 1200 ],
            [ 'Home', 'Settings', 900 ],

            [ 'RangeSelect', 'BikeSelect', 2100],
            [ 'MyGarage', 'BikeOverview', 926],
            [ 'Settings', 'Homee', 600],
            [ 'Settings', 'RangeSelecte', 300],

            [ 'BikeSelect', 'Configurator', 1800],
            [ 'BikeOverview', 'MyGaragee', 200],
            [ 'Homee', 'RangeSelectee', 260],
            [ 'RangeSelecte', 'BikeSelectee', 200],
        ]);

        // Set chart options
        var options = {
            width: "100%",
            sankey: {
                node: {
                    width: 20,
                }
            },
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.Sankey(document.getElementById('behavior-byOS'));
        chart.draw(data, options);

    }


    //loyalty();
    //recency();
    //daylyUsers();
    appStoreDownloads();
    googlePlayDownloads();
    //countryVisits();
    //newReturningUsers();
    behaviorFlowByOS();

    //var visitors = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1:E13&pub=1&sheet=channel_product','select B, sum(C) GROUP BY B', function(result) {
    //
    //    var data = result.getDataTable();
    //
    //    var options = {
    //        'title': 'Total Downloads by OS',
    //        'width': "100%",
    //        'height': 400,
    //        'pieHole': 0.5,
    //        'pieSliceText': 'percentage',
    //        'titleTextStyle': {
    //            fontSize: 20
    //        },
    //        'chartArea': {
    //            left: 50,
    //            top: 40,
    //            width: "100%",
    //            height: "100%"
    //        },
    //        'slices': {
    //        }
    //    };
    //
    //    var formatter = new google.visualization.NumberFormat(
    //        {});
    //    formatter.format(data, 1);
    //
    //
    //    var chart = new google.visualization.PieChart(document.getElementById('total-downloads-byOS'));
    //    jQuery('#cnt').text(data.Gf.length);
    //    chart.draw(data, options);
    //
    //});

    var margin = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1:E13&pub=1&sheet=channel_product','select B, sum(D) GROUP BY B', function(result) {

        var data = result.getDataTable();

        var options = {
            'title': 'Margin',
            'width': 540,
            'height': 400,
            'pieSliceText': 'percentage',
            'titleTextStyle': {
                fontSize: 26
            },
            'chartArea': {
                left: 50,
                top: 40,
                width: "100%",
                height: "100%"
            },
            'slices': {

            }
        };

        var formatter = new google.visualization.NumberFormat(
            {});
        formatter.format(data, 1);


        var chart = new google.visualization.PieChart(document.getElementById('margin'));
        chart.draw(data, options);

    });

    // var userIncrease = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1:E13&pub=1&sheet=channel_product','select A, sum(E) GROUP BY A pivot B', function(result) {
    //     var data = new google.visualization.DataTable();
    //     data.addColumn('string', 'Name');
    //     data.addColumn('number', 'Salary');
    //     data.addColumn('boolean', 'Full Time Employee');
    //     data.addRows([
    //       ['Mike',  {v: 10000, f: '$10,000'}, true],
    //       ['Jim',   {v:8000,   f: '$8,000'},  false],
    //       ['Alice', {v: 12500, f: '$12,500'}, true],
    //       ['Bob',   {v: 7000,  f: '$7,000'},  true]
    //     ]);

    //     var options = {
    //         'title': 'New verses Returning Users',
    //         'width' : '100%',
    //         'height' : '100%',
    //         'fontSize' : 23,
    //         'showRowNumber': true
    //     }

    //     var table = new google.visualization.Table(document.getElementById());
    //     table.draw(data, option);
    // });


    var ttv = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1:E13&pub=1&sheet=channel_product','select A, sum(E) GROUP BY A pivot B', function(result) {

        var data = result.getDataTable();

        //var table = new google.visualization.Table(document.getElementById('table_div'));

        var options = {
            'title': "User Increase / Decrease",
            'fontSize' : 12,
            'width': "100%",
            'height': "100%",
            'vAxis': {
                'gridlines' : {
                    'color':'71035a',
                    'count': 2
                }
            },
            'legend': {
                'position':'bottom',
                'textStyle' : {
                    'fontSize':'12'
                }
            },
            'hAxis': {
                'format' : '£###,###',
                gridlines : {
                    color : 'dddddd',
                    count: 17
                }
            },
            'titleTextStyle': {
                fontSize: 26
            },
            'isStacked': true,
            'chartArea': {
                left: 50,
                top: 0,
                width: "100%",
                height: "65%"
            },
            'series': {

            },


        };

        var formatter = new google.visualization.NumberFormat({prefix: '£'});

        for (var i=0; i<data.getNumberOfColumns(); i++) {
            formatter.format(data, i);
        }

        var chart = new google.visualization.BarChart(document.getElementById('retention'));

        chart.draw(data, options);

    });

}