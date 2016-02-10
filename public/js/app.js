google.load('visualization', '1', {packages:['table']});
// google.load('visualization', '1.1', {packages:['table']});
// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {packages: ['corechart']});
google.load("visualization", "1.1", {packages: ["bar"]});
google.load("visualization", "1.1", {packages: ["sankey"]});


google.setOnLoadCallback(initialize);


function initialize() {

    //helper methods
    var getDeltaPercentage = function(currentResult, prevResult){
        if((prevResult && currentResult)){
            return Math.round((currentResult-prevResult)/prevResult*100);
        } else return('-')
    };

    var convertSecondsToMinutes = function(seconds){
        return (seconds/60).toFixed(2)
    }

    var checkValue = function(value){
        return value ? value : 0
    }

    //parse int and add thousant separator for each element in the array
    var arrayThousantSeparator = function(arr){
        arr.map(function(row){
            row[1] = parseInt(row[1]).toLocaleString('es')
            return row
        })
    }

    //find the active app tab
    var activeAppTab = function(){
        var app = $('li.active').find('a').attr('href').replace('#bs_', '')
        console.log('href: %s', app)
        switch (app){
            case 'mygarageMG':
                app = 'mygarage'
                break;
            case 'mygarageSS':
                app = 'mygaragesupersport'
                break;
            case 'mygarageMT':
                app = 'mygaragemt'
                break;
        }
        return app
    }

    //returns int necessary for chart functions
    var formatMissingValues = function(data){
        return parseInt(data) ? data : null
    }

    //returns string necessary for chart functions
    var formatInvalidFormatter = function(data){
        return parseInt(data) ? data + ' %' : '-'
    }

    //sets correct country param for gaQueries
    var gaCountryName = function(country){
        var countryName = '';
        if(country){
            switch (country){
                case 'UK':
                    countryName = '_UnitedKingdom'
                    break;
                default :
                    countryName = '_' + country
            }
            return countryName;
        }
    }

    //sets correct appID param for gaQueries
    var gaAppID = function(app){
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

        return appIDga;
    }

    var appleAppID = function(app){
        var appID = '';

        switch (app){
            case 'mygaragesupersport':
                appID = 'MyGarageSupersport'
                break;
            case 'mygarage':
                appID = 'MyGarageSportHeritage'
                break;
            case 'mygaragemt':
                appID = 'MyGarageMT'
                break;
            default :
                appID = ''
        }

        return appID;
    }



    //select ajax data filtered by app param
    var filteredAjaxData = function(result, query, app){
        return app != "undefined" ? result[ query + '_' + app] : result[query]; //check if app is undefined
    }

    //return date format 08Jan2016
    function formatDate(){
        var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        return dd+months[parseInt(mm)]+yyyy;
    }


    // XLSX export
    var exportExcel = function(app, chartName){
        var currentDate = '_' + formatDate();
        var country = ''

        var opts = {
            headers:false,
            sheetid:"Sheet1",
            column: {style:{Font:{Bold:"1"}}},
            rows: {1:{style:{Font:{Color:"#FF0000"}}}},
            cells: {1:{1:{
                style: {Font:{Color:"#00FFFF"}}
            }}}
        };

        //helper function strips '%' and parses ints from cells
        var objFormater = function(data){
            return data.map(function(row){
                var cellkeys = Object.keys(row)
                var formatedObj = cellkeys.map(function(cell){
                    var isIndexOf = row[cell].indexOf('%')
                    if( isIndexOf !== -1 ) { return row[cell] = parseFloat(row[cell].slice(0, isIndexOf)) }
                    return parseFloat(row[cell]) ? parseFloat(row[cell]) : row[cell]
                })
                return formatedObj
            })
        }
        //remove country from filename if no country is selected when exporting xlsx
        if($('#country-select option:selected').val() != 'select'){
            country = '_' + $('#country-select option:selected').val();
        }
        var fileName = chartName + '_' + app + country + currentDate
        var summaryTable = alasql('SELECT * FROM HTML("#'+chartName+'-'+app+'")')
        var big5Table = alasql('SELECT * FROM HTML("#coutriesDL-'+app+'")')
        var data = [{0: 'APP KPI',	1:'YTD', 2:'Month', 3:'Previous Month', 4:'Growth month (%)', 5:'Week', 6:'Previous Week', 7:'Growth Week (%)'}]
        data = data.concat(objFormater(summaryTable))
        data.push({0: '', 1:'', 2:'', 3:'', 4:'', 5:'', 6:'', 7:''})
        data.push({0: 'Country', 1:'YTD', 2:'Month', 3:'Previous Month', 4:'Growth month (%)', 5:'Week', 6:'Previous Week', 7:'Growth Week (%)'})
        data = data.concat(objFormater(big5Table))

        var query = 'SELECT * INTO XLSX("'+ fileName +'.xlsx", ? ) FROM ?';
        //var query = 'SELECT * INTO XLSX("'+ fileName +'.xlsx", ? ) FROM HTML("#'+chartName+'-'+app+'",{headers:true})';
        alasql(query, [opts, data]);
    }

    //export xlsx button events for Sport Heritage Summary
    $("#export-mygarageMG-xlsx").click(function (event) {
        exportExcel('MyGarageSportHeritage', 'summary')
    });

    $("#export-mygarageSS-xlsx").click(function (event) {
        exportExcel('MyGarageSupersport', 'summary')
    });

    $("#export-mygarageMT-xlsx").click(function (event) {
        exportExcel('MyGarageMT', 'summary')
    });

    //export xlsx button events for Big Five Country Downloads
    $("#export-mygarageMG-countriesDL-xlsx").click(function (event) {
        exportExcel('MyGarageSportHeritage', 'coutriesDL')
    });

    $("#export-mygarageSS-countriesDL-xlsx").click(function (event) {
        exportExcel('MyGarageSupersport', 'coutriesDL')
    });

    $("#export-mygarageMT-countriesDL-xlsx").click(function (event) {
        exportExcel('MyGarageMT', 'coutriesDL')
    });




    var getAjaxData = function(period, app){
        console.log(period);
        var period = typeof period !== 'undefined' ? period : '';
        var app = typeof app !== 'undefined' ? app : '';
        var url = '/mongo-data/'+ period;
        $.ajax({
            url: url,
            type: 'GET',
            error: function (http){
                alert(http.responseText)
            },
            //statusCode:{
            //  500: function(){
            //      alert('No data available, ingest cycle will start return when done')
            //  }
            //},
            //beforeSend: function(){
            //    $('#loading').show();
            //    $('#content').hide();
            //},
            //complete: function(){
            //    $('#loading').hide();
            //    $('#content').show();
            //},
            success: function(results){
                charts(results, app);
                $('#loading').hide();
                $('#content').show();
            },
            fail: function() {
                console.log('error');
            }
        });
    }

    var charts = function(results, app){
        //alert('inside charts')
        newReturningUsersData(results, app);
        AndroidcountryVisitsData(results, app);
        iOScountryVisitsData(results, app);
        //removed Downloads by OS
        //downloadsByOsData(results, app);
        // dailyUsersData(results, app);
        // recencyData(results, app);
        // androidloyaltyData(results, app);
        // iOSLoyaltyData(results, app);
        popularBikesData(results, app);
        popularPartsData(results, app);
        AndroidExitData(results, app);
        iOSExitData(results, app);
        totalShareData(results, app);
        savedConfigsData(results, app);
        contactDealerData(results, app);
        //contactDealerAttemptsData(results, app);
        //removed by client request

        // appStoreDownloads(results, app);
        // playStoreDownloads(results, app);
    }

    //default load with week data and SportHeritage app data
    getAjaxData('week', 'mygarage');

    //period filter function
    $('#time-interval').change(function(){
        var interval = $('#time-interval').val();
        var app = activeAppTab()
        getAjaxData(interval, app);
    })

    //country filter function
    $('#country-select').change(function(){
        var country = $('#country-select').val();
        getMyGarageData(country);
        $('#selected-country').html(country)
    })


    //app filter function
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
        var currentTab = $(e.target).attr('href').replace('#bs_', ''); // get current tab
        var interval = $('#time-interval').val();
        console.log('currentTab: %s', currentTab);
        var app = '';
        switch (currentTab){
            case 'mygarageMG':
                app = 'mygarage'
                break;
            case 'mygarageSS':
                app = 'mygaragesupersport'
                break;
            case 'mygarageMT':
                app = 'mygaragemt'
                break;
        }
        getAjaxData(interval, app)
    });

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
                    myGarage(results, 'MyGarageSportHeritage', country);
                    myGarage(results, 'MyGarageSupersport', country);
                    myGarage(results, 'MyGarageMT', country);
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

    var newReturningUsersData = function(result, app){
        var ajaxData = filteredAjaxData(result, 'visitorTypesQuery', app);
        var data = new google.visualization.DataTable();

        var newVisitors = parseInt(ajaxData[0][1]);
        var returningVisitors = parseInt(ajaxData[1][1]);

        data.addColumn('string', 'User Type');
        data.addColumn('number', 'Sessions');
        data.addRows([
            ['Returning Visitors', {v: returningVisitors}],
            ['New Visitors', {v: newVisitors}]
        ]);
        var options = {
            'title': 'New versus Returning Users',
            'width': '100%',
            'height': '100%'
        }
        var table = new google.visualization.Table(document.getElementById('new-vs-returning-users'));
        table.draw(data, options);
    }

    var AndroidcountryVisitsData = function(result, app){
        var ajaxData = result['AndroidcountryVisitsQuery_' + app];
        arrayThousantSeparator(ajaxData)

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

    var iOScountryVisitsData = function(result, app){
        var ajaxData = result['iOScountryVisitsQuery_' + app]
        //adding column headers
        arrayThousantSeparator(ajaxData)
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

    //removed by client request
    // var downloadsByOsData =  function(result, app) {
    //     //var ajaxData = result.osQuery
    //     var ajaxData = filteredAjaxData(result, 'osQuery', app)

    //     var formatedData = ajaxData.map(function(arr){
    //         var formatedArr = [];
    //         formatedArr[0] = arr[0]+ ' ' + arr[1];
    //         formatedArr[1] = parseInt(arr[2]);
    //         return formatedArr;
    //     })


    //     formatedData.unshift(['OS', 'Sessions'])

    //     var data = google.visualization.arrayToDataTable(formatedData)

    //     var options = {
    //         //'title': 'Total Downloads by OS',
    //         'width': "100%",
    //         'height': 400,
    //         'pieHole': 0.4,
    //         'pieSliceText': 'percentage',
    //         'titleTextStyle': {
    //             fontSize: 20
    //         },
    //         'chartArea': {
    //             left: 50,
    //             top: 50,
    //             width: "100%",
    //             height: "100%"
    //         },
    //         'slices': {
    //         }
    //     };

    //     var chart = new google.visualization.PieChart(document.getElementById('total-downloads-byOS'));
    //     chart.draw(data, options);
    // }

    //TODO curently this chart's db data is not supporting app filtering; check if this is acording to specs
    
    //removed by customer demand
    // var dailyUsersData = function(result, app){
    //     var ajaxData = result['dailyUsersQuery_' + app]
    //     var formatedData = ajaxData.map(function(element){
    //         var chartDate = new Date( element[0].slice(0,4) + '-' + element[0].slice(4,6) + '-' + element[0].slice(6,8) );
    //         element[0] = chartDate.toDateString().slice(4,10)
    //         element[1] = parseInt(element[1])
    //         return element
    //     })
    //     //add column Names
    //     formatedData.unshift(['Day', 'Users'])

    //     var data = google.visualization.arrayToDataTable(formatedData)

    //     var options = {
    //         // title: 'User Increase / Decrease',
    //         // hAxis: {title: 'Month',  titleTextStyle: {color: '#333'}},
    //         hAxis: {titleTextStyle: {color: '#333'}},
    //         vAxis: {minValue: 0},
    //         chartArea: {
    //             //left: 100,
    //             //top: 100,
    //             width: 900
    //             //height: 350
    //         }
    //     };

    //     var chart = new google.visualization.AreaChart(document.getElementById('user-increase'));
    //     chart.draw(data, options);

    // }

    //removed by customer demand
    // var recencyData = function(result, app){
    //     var ajaxData = filteredAjaxData(result, 'frequencyQuery', app)
    //     var freqBetween8and14 = []
    //     var freqBetween15and30 = []
    //     var freqBetween31and60 = []
    //     var freqMoreThan60Days = []
    //     var formatedData = ajaxData.map(function(element){
    //         //element[0] === '0'  ? element[0] = '< 1 day' : element[0];
    //         element[0] = parseInt(element[0])
    //         element[1] = parseInt(element[1])
    //         return element
    //     })
    //         .sort(function(a, b){
    //             return a[0]-b[0]
    //         })

    //     //add elements with frequnecy between 8 and 14 days to freqBetween8and14 arr
    //     for(var i = 0; i < formatedData.length; i++){
    //         if( formatedData[i][0] > 7 && formatedData[i][0] < 15){
    //             freqBetween8and14.push(formatedData[i][1])
    //         }
    //         if( formatedData[i][0] > 14 && formatedData[i][0] < 31){
    //             freqBetween15and30.push(formatedData[i][1])
    //         }
    //         if( formatedData[i][0] > 30 && formatedData[i][0] < 61){
    //             freqBetween31and60.push(formatedData[i][1])
    //         }
    //         if( formatedData[i][0] > 60){
    //             freqMoreThan60Days.push(formatedData[i][1])
    //         }
    //     }

    //     //remove elements with frequnecy more than 15 days from formatedData
    //     for(var i = 0; i < formatedData.length; i++){
    //         if( formatedData[i][0] > 7){
    //             formatedData.splice(i, formatedData.length-i)
    //         }
    //     }

    //     // sum all visits with frequency between 8 and 15
    //     freqBetween8and14 = freqBetween8and14.reduce(function(prev, next){
    //         return prev+next
    //     }, 0)
    //     // sum all visits with frequency between 15 and 31
    //     freqBetween15and30 = freqBetween15and30.reduce(function(prev, next){
    //         return prev+next
    //     }, 0)

    //    // sum all visits with frequency between 30 and 61
    //     freqBetween31and60 = freqBetween31and60.reduce(function(prev, next){
    //         return prev+next
    //     }, 0)

    //    // sum all visits with frequency more than 60
    //     freqMoreThan60Days = freqMoreThan60Days.reduce(function(prev, next){
    //         return prev+next
    //     }, 0)

    //     formatedData[0][0] = '< 1'
    //     formatedData.unshift(["Days between Sessions", "Sessions"])
    //     formatedData.push(
    //         ['8-14', freqBetween8and14],
    //         ['15-30', freqBetween15and30],
    //         ['31-60', freqBetween31and60],
    //         ['> 60', freqMoreThan60Days]
    //     )

    //     var data = google.visualization.arrayToDataTable(formatedData)

    //     var view = new google.visualization.DataView(data);
    //     view.setColumns([0, 1,
    //         { calc: "stringify",
    //             sourceColumn: 1,
    //             type: "string",
    //             role: "annotation" }]);
    //     var options = {
    //         // title: "Recency",
    //         width: 380,
    //         height: 400,
    //         bar: {groupWidth: "65%"},
    //         legend: { position: "none" },
    //         axes: {
    //             x: {
    //                 0: { side: 'top', label: 'Days between Sessions'}, // Top x-axis.
    //                 1: { side: 'top', label: 'Sessions'}
    //             }
    //         }
    //     };
    //     var chart = new google.visualization.BarChart(document.getElementById("recency"));
    //     chart.draw(view, options);
    // }

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

    //removed by customer demand
    // var androidloyaltyData = function(result, app){
    //     var ajaxData = filteredAjaxData(result, 'AndroidLoyaltyQuery', app);
    //     var formatedData = ajaxData.map(function(element){
    //         element[0] = parseInt(element[0]);
    //         element[1] = parseInt(element[1]);
    //         return element;
    //     }).sort(function(a,b){
    //         return a[0] - b[0]
    //     })


    //     var sessionInstances9to14 = filterAndSumSessions(formatedData, 9, 14)
    //     var sessionInstances15to25 = filterAndSumSessions(formatedData, 15, 25)
    //     var sessionInstances26to50 = filterAndSumSessions(formatedData, 26, 50)
    //     var sessionInstances51to100 = filterAndSumSessions(formatedData, 51, 100)
    //     var sessionInstances101to200 = filterAndSumSessions(formatedData, 101, 200)
    //     for ( var i = 0; i < formatedData.length; i++){
    //         if (formatedData[i][0] > 8){
    //             formatedData.splice(i, formatedData.length-i)
    //         }
    //     }

    //     formatedData.map(function(element){
    //         element[0]=String(element[0])
    //         element[1]=parseInt(element[1])
    //         return element
    //     })

    //     formatedData.unshift(["Session Instances", "Sessions"]);

    //     formatedData.push(sessionInstances9to14);
    //     formatedData.push(sessionInstances15to25);
    //     formatedData.push(sessionInstances26to50);
    //     formatedData.push(sessionInstances51to100);
    //     formatedData.push(sessionInstances101to200);

    //     //console.log('formatedData is: '+formatedData)
    //     var data = google.visualization.arrayToDataTable(formatedData)


    //     var view = new google.visualization.DataView(data);
    //     view.setColumns([0, 1,
    //         { calc: "stringify",
    //             sourceColumn: 1,
    //             type: "string",
    //             role: "annotation" }]);
    //     var options = {
    //         // title: "Loyalty Android",
    //         width: 380,
    //         height: 400,
    //         bar: {groupWidth: "65%"},
    //         legend: { position: "none" },
    //     };
    //     var chart = new google.visualization.BarChart(document.getElementById("loyalty-android"));
    //     chart.draw(view, options);
    // }

    //removed by customer demand
    // var iOSLoyaltyData = function(result, app){
    //     var ajaxData = filteredAjaxData(result, 'iOSLoyaltyQuery', app);
    //     var formatedData = ajaxData.map(function(element){
    //         element[0] = parseInt(element[0]);
    //         element[1] = parseInt(element[1]);
    //         return element;
    //     }).sort(function(a,b){
    //         return a[0] - b[0]
    //     })

    //     var filterAndSumSessions = function(array, min, max){
    //         var sessionsSum =  array.filter(function(element){
    //             if (element[0] >= min && element[0] <= max) return element
    //         }).map(function(element){
    //             return element[1]
    //         }).reduce(function(prev, next){
    //             return parseInt(prev) + parseInt(next)
    //         }, 0)
    //         return [min + '-' + max, sessionsSum]
    //     }

    //     var sessionInstances9to14 = filterAndSumSessions(formatedData, 9, 14)
    //     var sessionInstances15to25 = filterAndSumSessions(formatedData, 15, 25)
    //     var sessionInstances26to50 = filterAndSumSessions(formatedData, 26, 50)
    //     var sessionInstances51to100 = filterAndSumSessions(formatedData, 51, 100)
    //     var sessionInstances101to200 = filterAndSumSessions(formatedData, 101, 200)

    //     for ( var i = 0; i < formatedData.length; i++){
    //         if (formatedData[i][0] > 8){
    //             formatedData.splice(i, formatedData.length-i)
    //         }
    //     }

    //     formatedData.map(function(element){
    //         element[0]=String(element[0])
    //         element[1]=parseInt(element[1])
    //         return element
    //     })

    //     formatedData.unshift(["Session Instances", "Sessions"]);

    //     formatedData.push(sessionInstances9to14);
    //     formatedData.push(sessionInstances15to25);
    //     formatedData.push(sessionInstances26to50);
    //     formatedData.push(sessionInstances51to100);
    //     formatedData.push(sessionInstances101to200);

    //     //console.log('formatedData is: '+formatedData)
    //     var data = google.visualization.arrayToDataTable(formatedData)


    //     var view = new google.visualization.DataView(data);
    //     view.setColumns([0, 1,
    //         { calc: "stringify",
    //             sourceColumn: 1,
    //             type: "string",
    //             role: "annotation" }]);
    //     var options = {
    //         // title: "Loyalty iOS",
    //         width: 380,
    //         height: 400,
    //         bar: {groupWidth: "65%"},
    //         legend: { position: "none" },
    //     };
    //     var chart = new google.visualization.BarChart(document.getElementById("loyalty-iOS"));
    //     chart.draw(view, options);
    // }

    var popularBikesData = function(result, app){
        var ajaxData = filteredAjaxData(result, 'popularBikesQuery', app)
        arrayThousantSeparator(ajaxData)
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


    var popularPartsData = function(result, app){
        var ajaxData = filteredAjaxData(result, 'popularPartsQuery', app)
        arrayThousantSeparator(ajaxData)
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

    var AndroidExitData = function(result, app){
        var ajaxData = filteredAjaxData(result, 'AndroidExitQuery', app)
        arrayThousantSeparator(ajaxData)

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

    var iOSExitData = function(result, app){
        var ajaxData = filteredAjaxData(result, 'iOSExitQuery', app)
        arrayThousantSeparator(ajaxData)

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

    var totalShareData = function(result, app){
        var ajaxData = [
            ['Shares'],
            [parseInt(filteredAjaxData(result, 'sharesQuery', app)[0][0])]
        ]

        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Total number of shares',
            'showRowNumber': false,
            'width': "100%",
            'height': "100%"
        }
        var table_part = new google.visualization.Table(document.getElementById('share-number'));
        table_part.draw(data, options);
    }

    var savedConfigsData = function(result, app){
        var ajaxData = [
            ['Configurations'],
            [parseInt(filteredAjaxData(result, 'savedConfigsQuery', app)[0][0])]
        ]

        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Saved Configurations',
            'showRowNumber': false,
            'width': "100%",
            'height': "100%"
        }
        var table_part = new google.visualization.Table(document.getElementById('saved-configs'));
        table_part.draw(data, options);
    }

    var contactDealerData = function(result, app){
        //var ajaxData = filteredAjaxData(result, 'dealerContactedQuery', app)

        var ajaxData = [
            ['Attempts', 'Success'],
            [
                parseInt(filteredAjaxData(result, 'attdealerContactedQuery', app)),
                parseInt(filteredAjaxData(result, 'dealerContactedQuery', app))
            ]
        ]

        var data = google.visualization.arrayToDataTable(ajaxData)

        var options = {
            'title': 'Saved Configurations',
            'showRowNumber': false,
            'width': "100%",
            'height': "100%"
        }
        var table_part = new google.visualization.Table(document.getElementById('dealer-contacted'));
        table_part.draw(data, options);
    }

    //TODO does not have app param implmented in biDimQueries
    //var contactDealerAttemptsData = function(result, app){
    //    var ajaxData = filteredAjaxData(result, 'attdealerContactedQuery', app)
    //    $('#dealer-contacted-attempts').html('      ' + ajaxData)
    //}

    //removed by client request

    // var appStoreDownloads = function(result, app){
    //     var appID = appleAppID(app);
    //     var units = parseInt(result.appStoreDownloads[appID].downloads);
    //     var prevUnits = parseInt(result.appStoreDownloads[appID].previousDownloads);
    //     var growth = getDeltaPercentage(units, prevUnits);
    //     var data = new google.visualization.DataTable();
    //     data.addColumn('number', 'Units');
    //     data.addColumn('number', 'Previous');
    //     data.addColumn('number', 'Growth');
    //     data.addRows([
    //         [
    //             {v: units, f: units.toLocaleString('es')},
    //             {v: prevUnits, f: prevUnits.toLocaleString('es')},
    //             {v: parseInt(growth) ? growth : null, f: parseInt(growth) ? growth+' %' : '-'}
    //         ]
    //     ]);

    //     var formatter = new google.visualization.ArrowFormat();
    //     formatter.format(data, 2);

    //     var options = {
    //         'title': 'Total Downloads by App Store',
    //         'width': '100%',
    //         'height': '100%'
    //     }
    //     var table= new google.visualization.Table(document.getElementById('app-store-downloads'));
    //     table.draw(data, options);
    // }

    //removed by client request

    // var playStoreDownloads = function(result, app){
    //     var units = parseInt(result['AndroidDownloadsQuery_'+app][0]);
    //     var prevUnits = result['AndroidDownloadsQueryPrev_'+ app] ? parseInt(result['AndroidDownloadsQueryPrev_'+app][0]) : 0;
    //     var growth = getDeltaPercentage(units, prevUnits)

    //     var data = new google.visualization.DataTable();
    //     data.addColumn('number', 'Units');
    //     data.addColumn('number', 'Previous');
    //     data.addColumn('number', 'Growth');
    //     data.addRows([
    //         [
    //             {v: units, f: units.toLocaleString('es')},
    //             {v: prevUnits, f: prevUnits.toLocaleString('es')},
    //             {v: parseInt(growth) ? growth : null, f: parseInt(growth) ? growth+' %' : '-'}
    //         ]
    //     ]);

    //     var formatter = new google.visualization.ArrowFormat();
    //     formatter.format(data, 2);

    //     var options = {
    //         'title': 'Total Downloads by Play Store',
    //         'width': '100%',
    //         'height': '100%'
    //     }
    //     var table= new google.visualization.Table(document.getElementById('google-play-store-downloads'));
    //     table.draw(data, options);
    // }

    var myGarage = function(result, app, country){
        var app = app ? app : '';
        var appIDga = gaAppID(app);
        var countryName = gaCountryName(country) ? gaCountryName(country) : '';

        var weekResults = result.weekResults.Data;
        var monthResults = result.monthResults.Data;
        var yearResults = result.yearResults.Data;

        var getRow = function(baseQuery, appIDga, countryName, resultName){
            var ytd         = parseInt(yearResults[baseQuery+'_'+appIDga + countryName])
            var month       = parseInt(checkValue(monthResults[baseQuery+'_'+appIDga + countryName]))
            var prevMonth   = parseInt(checkValue(monthResults[baseQuery+'Prev'+'_'+appIDga + countryName]))
            var monthGrowth = {
                v : parseInt(getDeltaPercentage(month, prevMonth)) ? getDeltaPercentage(month, prevMonth) : null,
                f: parseInt(getDeltaPercentage(month, prevMonth)) ? getDeltaPercentage(month, prevMonth) + ' %' : '-'
            }
            var week        = parseInt(checkValue(weekResults[baseQuery+'_'+appIDga + countryName]))
            var prevWeek    = parseInt(checkValue(weekResults[baseQuery+'Prev'+'_'+appIDga + countryName]))
            var weekGrowth  = {
                v: parseInt(getDeltaPercentage(week, prevWeek)) ? getDeltaPercentage(week, prevWeek) : null,
                f: parseInt(getDeltaPercentage(week, prevWeek)) ? getDeltaPercentage(week, prevWeek) + ' %' : '-'
            }

            //var row =  [resultName, ytd, month, prevMonth, monthGrowth, week, prevWeek, weekGrowth]
            var row =  [
                resultName,
                {v: ytd, f:ytd.toLocaleString('es')},
                {v: month, f: month.toLocaleString('es')},
                {v: prevMonth, f: prevMonth.toLocaleString('es')},
                monthGrowth,
                {v: week, f: week.toLocaleString('es')},
                {v: prevWeek, f: prevWeek.toLocaleString('es')},
                weekGrowth
            ]
            return row
        }

        var getIosRow = function(app, country){
            var ytd, month, prevMonth, monthGrowth, week, prevWeek, weekGrowth;

            if(country){
                ytd         = yearResults.appStoreDownloadsByCountry[app][country].downloads
                month       = monthResults.appStoreDownloadsByCountry[app][country].downloads
                prevMonth   = monthResults.appStoreDownloadsByCountry[app][country].previousDownloads
                week        = weekResults.appStoreDownloadsByCountry[app][country].downloads
                prevWeek    = weekResults.appStoreDownloadsByCountry[app][country].previousDownloads
                monthGrowth = {
                    v: formatMissingValues(monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage),
                    f: formatInvalidFormatter(monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage)
                }
                weekGrowth = {
                    v: formatMissingValues(weekResults.appStoreDownloadsByCountry[app][country].deltaPercentage),
                    f: formatInvalidFormatter(weekResults.appStoreDownloadsByCountry[app][country].deltaPercentage)
                }
            } else {
                ytd         = yearResults.appStoreDownloads[app].downloads
                month       = monthResults.appStoreDownloads[app].downloads
                prevMonth   = monthResults.appStoreDownloads[app].previousDownloads
                week        = weekResults.appStoreDownloads[app].downloads
                prevWeek    = weekResults.appStoreDownloads[app].previousDownloads
                monthGrowth = {
                    v: formatMissingValues(monthResults.appStoreDownloads[app].deltaPercentage),
                    f: formatInvalidFormatter(monthResults.appStoreDownloads[app].deltaPercentage)
                }
                weekGrowth = {
                    v: formatMissingValues(weekResults.appStoreDownloads[app].deltaPercentage),
                    f: formatInvalidFormatter(weekResults.appStoreDownloads[app].deltaPercentage)
                }
            }


            var row =  [
                'Downloads iOS',
                {v: ytd, f:ytd.toLocaleString('es')},
                {v: month, f: month.toLocaleString('es')},
                {v: prevMonth, f: prevMonth.toLocaleString('es')},
                monthGrowth,
                {v: week, f: week.toLocaleString('es')},
                {v: prevWeek, f: prevWeek.toLocaleString('es')},
                weekGrowth
            ]
            return row
        }

        var getNewUsers = function(appIDga, countryName){
            var ytd, month, prevMonth, monthGrowth, week, prevWeek, weekGrowth;

            ytd         = parseInt(yearResults['visitorTypesQuery_' + appIDga + countryName][0][1])
            month       = parseInt(monthResults['visitorTypesQuery_' + appIDga + countryName][0][1])
            prevMonth   = monthResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(monthResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1])
            monthGrowth = {
                v: monthResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(getDeltaPercentage(month, prevMonth)),
                f: monthResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? '-' : getDeltaPercentage(month, prevMonth) + ' %'
            }
            week        = parseInt(weekResults['visitorTypesQuery_' + appIDga + countryName][0][1])
            prevWeek    = parseInt(weekResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1])
            weekGrowth  = {
                v: weekResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(getDeltaPercentage(week, prevWeek)),
                f: weekResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? '-' : getDeltaPercentage(week, prevWeek) + ' %'
            }
            var row =  [
                'New Users',
                {v: ytd, f:ytd.toLocaleString('es')},
                {v: month, f: month.toLocaleString('es')},
                {v: prevMonth, f: prevMonth.toLocaleString('es')},
                monthGrowth,
                {v: week, f: week.toLocaleString('es')},
                {v: prevWeek, f: prevWeek.toLocaleString('es')},
                weekGrowth
            ]
            return row
        }


        var totalDl = function(app, country, appIDga, countryName){
            var YTD, Month, prevMonth, Week, prevWeek ;
            if(country){
                YTD = parseInt(yearResults.appStoreDownloadsByCountry[app][country].downloads) + parseInt(yearResults['AndroidDownloadsQuery_'+appIDga + countryName])
                Month = parseInt(monthResults.appStoreDownloadsByCountry[app][country].downloads) + parseInt(monthResults['AndroidDownloadsQuery_'+appIDga + countryName])
                prevMonth = parseInt(monthResults.appStoreDownloadsByCountry[app][country].previousDownloads) + parseInt(monthResults['AndroidDownloadsQueryPrev_'+appIDga + countryName])
                Week = parseInt(weekResults.appStoreDownloadsByCountry[app][country].downloads) + parseInt(weekResults['AndroidDownloadsQuery_'+appIDga + countryName])
                prevWeek = parseInt(weekResults.appStoreDownloadsByCountry[app][country].previousDownloads) + parseInt(weekResults['AndroidDownloadsQueryPrev_'+appIDga + countryName])
            } else{
                YTD = parseInt(yearResults.appStoreDownloads[app].downloads) + parseInt(yearResults['AndroidDownloadsQuery_'+appIDga + countryName])
                Month = parseInt(monthResults.appStoreDownloads[app].downloads) + parseInt(monthResults['AndroidDownloadsQuery_'+appIDga + countryName])
                prevMonth = parseInt(monthResults.appStoreDownloads[app].previousDownloads) + parseInt(monthResults['AndroidDownloadsQueryPrev_'+appIDga + countryName])
                Week = parseInt(weekResults.appStoreDownloads[app].downloads) + parseInt(weekResults['AndroidDownloadsQuery_'+appIDga + countryName])
                prevWeek = parseInt(weekResults.appStoreDownloads[app].previousDownloads) + parseInt(weekResults['AndroidDownloadsQueryPrev_'+appIDga + countryName])
            }
            var growthMonth = {
                v: getDeltaPercentage(Month, prevMonth),
                f: getDeltaPercentage(Month, prevMonth) + ' %'
            }
            var growthWeek = {
                v: getDeltaPercentage(Week, prevWeek),
                f: getDeltaPercentage(Week, prevWeek) + ' %'
            }

            return[
                'Downloads Total',
                {v: YTD , f: YTD.toLocaleString('es')},
                {v: Month, f: Month.toLocaleString('es')},
                {v: prevMonth, f: prevMonth.toLocaleString('es')},
                growthMonth,
                {v: Week, f: Week.toLocaleString('es')},
                {v: prevWeek, f: prevWeek.toLocaleString('es')},
                growthWeek
            ]
        }


        var iOsDownloads = getIosRow(app, country)
        var androidDl = getRow('AndroidDownloadsQuery', appIDga, countryName, 'Downloads Android')
        var tdl = totalDl(app, country, appIDga, countryName)
        var savedConfigs = getRow('savedConfigsQuery', appIDga, countryName, 'Stored Bikes')
        var shares= getRow('sharesQuery', appIDga, countryName, 'Shared Pictures')
        var dealerContacted = getRow('dealerContactedQuery', appIDga, countryName, 'Sent to a dealer')
        var newUsers = getNewUsers(appIDga, countryName)

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
            iOsDownloads,
            //[
            //    'Downloads iOS',
            //    country ? yearResults.appStoreDownloadsByCountry[app][country].downloads : yearResults.appStoreDownloads[app].downloads,
            //    country ? monthResults.appStoreDownloadsByCountry[app][country].downloads : monthResults.appStoreDownloads[app].downloads,
            //    country ? monthResults.appStoreDownloadsByCountry[app][country].previousDownloads : monthResults.appStoreDownloads[app].previousDownloads,
            //    //country ? {v: parseInt(monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage) ? monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage : null, f: parseInt(monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage) ? monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage + ' %' : '-'} : {v: parseInt(monthResults.appStoreDownloads[app].deltaPercentage) ? monthResults.appStoreDownloads[app].deltaPercentage : null, f: parseInt(monthResults.appStoreDownloads[app].deltaPercentage) ? monthResults.appStoreDownloads[app].deltaPercentage + ' %' : '-'},
            //    country ? {v: formatMissingValues(monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage), f: formatInvalidFormatter(monthResults.appStoreDownloadsByCountry[app][country].deltaPercentage)} : {v: formatMissingValues(monthResults.appStoreDownloads[app].deltaPercentage), f: formatInvalidFormatter(monthResults.appStoreDownloads[app].deltaPercentage)},
            //    country ? weekResults.appStoreDownloadsByCountry[app][country].downloads : weekResults.appStoreDownloads[app].downloads,
            //    country ? weekResults.appStoreDownloadsByCountry[app][country].previousDownloads : weekResults.appStoreDownloads[app].previousDownloads,
            //    country ? {v: parseInt(weekResults.appStoreDownloadsByCountry[app][country].deltaPercentage) ? weekResults.appStoreDownloadsByCountry[app][country].deltaPercentage : null, f: parseInt(weekResults.appStoreDownloadsByCountry[app][country].deltaPercentage) ? weekResults.appStoreDownloadsByCountry[app][country].deltaPercentage + ' %' : '-'} : {v: parseInt(weekResults.appStoreDownloads[app].deltaPercentage) ? weekResults.appStoreDownloads[app].deltaPercentage : null, f: parseInt(weekResults.appStoreDownloads[app].deltaPercentage) ? weekResults.appStoreDownloads[app].deltaPercentage + ' %' : '-'},
            //],

            //TODO implement when googlePlay API credentials are available
            androidDl,

            //TODO implement when googlePlay API credentials are available
            tdl,

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

            savedConfigs,

            shares,

            dealerContacted,

            newUsers,
            //[
            //    'New Users',
            //    parseInt(yearResults['visitorTypesQuery_' + appIDga + countryName][0][1]),
            //    parseInt(monthResults['visitorTypesQuery_' + appIDga + countryName][0][1]),
            //    monthResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(monthResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1]),
            //    {
            //        v: monthResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(getDeltaPercentage(monthResults['visitorTypesQuery_' + appIDga + countryName][0][1], monthResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1])),
            //        f: monthResults['visitorTypesQueryPrev_' + appIDga + countryName] == null ? '-' : getDeltaPercentage(monthResults['visitorTypesQuery_' + appIDga + countryName][0][1], monthResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1]) + ' %'
            //    },
            //    parseInt(weekResults['visitorTypesQuery_' + appIDga + countryName][0][1]),
            //    parseInt(weekResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1]),
            //    {
            //        v: parseInt(getDeltaPercentage(weekResults['visitorTypesQuery_' + appIDga + countryName][0][1], weekResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1])),
            //        f: getDeltaPercentage(weekResults['visitorTypesQuery_' + appIDga + countryName][0][1], weekResults['visitorTypesQueryPrev_' + appIDga + countryName][0][1]) + ' %'
            //    },
            //],

            [
                'Average usage (min)',
                {
                    v: parseInt(yearResults['averageUsageQuery_' + appIDga + countryName]),
                    f: parseFloat(convertSecondsToMinutes(yearResults['averageUsageQuery_' + appIDga + countryName])).toFixed(1)
                },
                {
                    v: parseInt(monthResults['averageUsageQuery_' + appIDga + countryName]),
                    f: parseFloat(convertSecondsToMinutes(monthResults['averageUsageQuery_' + appIDga + countryName])).toFixed(1)
                },
                {
                    v: parseInt(monthResults['averageUsageQueryPrev_' + appIDga + countryName]),
                    f: parseFloat(convertSecondsToMinutes(monthResults['averageUsageQueryPrev_' + appIDga + countryName])).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(monthResults['averageUsageQuery_' + appIDga + countryName], monthResults['averageUsageQueryPrev_' + appIDga + countryName])),
                    f: parseInt(getDeltaPercentage(monthResults['averageUsageQuery_' + appIDga + countryName], monthResults['averageUsageQueryPrev_' + appIDga + countryName])) ? getDeltaPercentage(monthResults['averageUsageQuery_' + appIDga + countryName], monthResults['averageUsageQueryPrev_' + appIDga + countryName]) + ' %' : '-'
                },
                {
                    v: parseInt(weekResults['averageUsageQuery_' + appIDga + countryName]),
                    f: parseFloat(convertSecondsToMinutes(weekResults['averageUsageQuery_' + appIDga + countryName])).toFixed(1)
                },
                {
                    v: parseInt(weekResults['averageUsageQueryPrev_' + appIDga + countryName]),
                    f: parseFloat(convertSecondsToMinutes(weekResults['averageUsageQueryPrev_' + appIDga + countryName])).toFixed(1)
                },
                {
                    v: parseInt(getDeltaPercentage(weekResults['averageUsageQuery_' + appIDga + countryName], weekResults['averageUsageQueryPrev_' + appIDga + countryName])),
                    f: getDeltaPercentage(weekResults['averageUsageQuery_' + appIDga + countryName], weekResults['averageUsageQueryPrev_' + appIDga + countryName]) + ' %'
                },
            ],

            [
                'Popular bike',
                {v: parseInt(yearResults['popularBikesQuery_' + appIDga + countryName][0][0]), f: String(yearResults['popularBikesQuery_' + appIDga + countryName][0][0])},
                {v: parseInt(monthResults['popularBikesQuery_' + appIDga + countryName][0][0]), f: monthResults['popularBikesQuery_' + appIDga + countryName][0][0]},
                {v: monthResults['popularBikesQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(monthResults['popularBikesQueryPrev_' + appIDga + countryName][0][0]), f: monthResults['popularBikesQueryPrev_' + appIDga + countryName] == null ? '-' : monthResults['popularBikesQueryPrev_' + appIDga + countryName][0][0]},
                null,
                {v: parseInt(weekResults['popularBikesQuery_' + appIDga + countryName][0][0]), f: weekResults['popularBikesQuery_' + appIDga + countryName][0][0]},
                {v: parseInt(weekResults['popularBikesQueryPrev_' + appIDga + countryName][0][0]), f: weekResults['popularBikesQueryPrev_' + appIDga + countryName][0][0]},
                null
            ],

            [
                'Popular Accessory',
                {v: parseInt(yearResults['popularPartsQuery_' + appIDga + countryName][0][0]), f: String(yearResults['popularPartsQuery_' + appIDga + countryName][0][0])},
                {v: monthResults['popularPartsQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(monthResults['popularPartsQuery_' + appIDga + countryName][0][0]), f: monthResults['popularPartsQueryPrev_' + appIDga + countryName] == null ? '-' : monthResults['popularPartsQuery_' + appIDga + countryName][0][0]},
                {v: monthResults['popularPartsQueryPrev_' + appIDga + countryName] == null ? 0 : parseInt(monthResults['popularPartsQueryPrev_' + appIDga + countryName][0][0]), f: monthResults['popularPartsQuery_' + appIDga + countryName] == null ? '-' :  monthResults['popularPartsQuery_' + appIDga + countryName][0][0]},
                null,
                {v: parseInt(weekResults['popularPartsQuery_' + appIDga + countryName][0][0]), f: weekResults['popularPartsQuery_' + appIDga + countryName][0][0]},
                {v: parseInt(weekResults['popularPartsQueryPrev_' + appIDga + countryName][0][0]), f: weekResults['popularPartsQueryPrev_' + appIDga + countryName][0][0]},
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

        var table= new google.visualization.Table(document.getElementById('summary-' + app));
        table.draw(data, options);
    }

    var topAppStoreDownlodsByCountry = function(result, appID) {
        var appWeekResults = result.weekResults.Data.appStoreDownloadsByCountry[appID];
        var appMonthResults = result.monthResults.Data.appStoreDownloadsByCountry[appID];
        var appYearResults = result.yearResults.Data.appStoreDownloadsByCountry[appID];
        var weekResults = result.weekResults.Data;
        var monthResults = result.monthResults.Data;
        var yearResults = result.yearResults.Data;

        var appIDga = gaAppID(appID)
        var countries = ['Spain', 'Italy', 'France', 'Germany', 'UK']

        var tableRows = countries.map(function(country){
            var countryName = gaCountryName(country)

            var YTD = parseInt(appYearResults[country].downloads) + parseInt(yearResults['AndroidDownloadsQuery_'+appIDga + countryName])
            var Month = parseInt(appMonthResults[country].downloads) + parseInt(monthResults['AndroidDownloadsQuery_'+appIDga + countryName])
            var prevMonth = parseInt(appMonthResults[country].previousDownloads) + parseInt(monthResults['AndroidDownloadsQueryPrev_'+appIDga + countryName])
            var growthMonth = {
                v: getDeltaPercentage(Month, prevMonth),
                f: getDeltaPercentage(Month, prevMonth) + ' %'
            }
            var Week = parseInt(appWeekResults[country].downloads) + parseInt(weekResults['AndroidDownloadsQuery_'+appIDga + countryName])
            var prevWeek = parseInt(appWeekResults[country].previousDownloads) + parseInt(weekResults['AndroidDownloadsQueryPrev_'+appIDga + countryName])
            var growthWeek = {
                v: getDeltaPercentage(Week, prevWeek),
                f: getDeltaPercentage(Week, prevWeek) + ' %'
            }

            return[
                country,
                {v: YTD, f: YTD.toLocaleString('es')},
                {v: Month, f: Month.toLocaleString('es')},
                {v: prevMonth, f: prevMonth.toLocaleString('es')},
                growthMonth,
                {v: Week, f: Week.toLocaleString('es')},
                {v: prevWeek, f: prevWeek.toLocaleString('es')},
                growthWeek
            ]
        })

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Country');
        data.addColumn('number', 'YTD');
        data.addColumn('number', 'Month');
        data.addColumn('number', 'Previous Month');
        data.addColumn('number', 'Growth month');
        data.addColumn('number', 'Week');
        data.addColumn('number', 'Previous Week');
        data.addColumn('number', 'Growth Week');
        data.addRows(tableRows)
        var formatter = new google.visualization.ArrowFormat();
        formatter.format(data, 4);
        formatter.format(data, 7);

        var options = {
            'title': 'My Garage:'+appID,
            'width': '100%',
            'height': '100%'
        }

        var table= new google.visualization.Table(document.getElementById('coutriesDL-'+appID));
        table.draw(data, options);
    }

}