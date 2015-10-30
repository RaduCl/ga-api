google.load('visualization', '1', {packages:['table']});
// google.load('visualization', '1.1', {packages:['table']});
// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {packages: ['corechart']});
google.load("visualization", "1.1", {packages:["bar"]});

google.setOnLoadCallback(initialize);




function initialize() {


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

    var table = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1:S5&pub=1&sheet=table','select A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S', function(result) {

        var data = result.getDataTable();

        var formatter = new google.visualization.ColorFormat();
        formatter.addRange(null, 0, '#FF0000', '');
        formatter.addRange(0, null, '#41CC00', '');

        for (var i=2;i<20;i=i+2) {
            formatter.format(data, i);
        }

        var table_kpi = new google.visualization.Table(document.getElementById('user-increase2'));
        table_kpi.draw(data, {allowHtml : true});

    });

    // App Usage statistics

    function tableCountries(){
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

    function userIncrease(){
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

    function popularBikes(){
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Event Label');
        data.addColumn('number', 'Total Events');
        data.addRows([
                [{v: 726}, {v: 776}, {v:-6.4}]
            ]);
        var options = {
            // 'title': 'Total Downloads by App Store',
            'width': '100%',
            'height': '100%'
        }
        var table= new google.visualization.Table(document.getElementById('popular-bikes'));
        table.draw(data, options);
    }

    loyalty();
    recency();
    userIncrease();
    appStoreDownloads();
    googlePlayDownloads();
    tableCountries();
    newReturningUsers();

    var visitors = getMyData('http://spreadsheets.google.com/tq?key=0Anr_udlm_tcjdFFhTGc2LUl2UlRfV3hWLTVlYXl1bWc&range=A1:E13&pub=1&sheet=channel_product','select B, sum(C) GROUP BY B', function(result) {

        var data = result.getDataTable();

        var options = {
            'title': 'Total Downloads by OS',
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

        var formatter = new google.visualization.NumberFormat(
            {});
        formatter.format(data, 1);


        var chart = new google.visualization.PieChart(document.getElementById('total-downloads-byOS'));
        jQuery('#cnt').text(data.Gf.length);
        chart.draw(data, options);

    });

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