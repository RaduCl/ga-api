var itc = require("itunesconnect");
var Report = itc.Report;

// Connect to iTunes
var itunes = new itc.Connect('connectstats@indg.com', 'Dsc729max!');

// Simple ranked report

itunes.request(Report.ranked().time(1, 'weeks').location(143450), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
			finalRes.downloads = []
			finalRes.previousDownloads = []
			finalRes.delta = []
            finalRes.downloads[0] = result[0].units;
			finalRes.downloads[1] = result[1].units;
			finalRes.downloads[2] = result[2].units;
            itunes.request(Report.ranked().time(2, 'weeks').location(143450), function (error, result) {
                if(error) return error
                if(result){
                    finalRes.previousDownloads[0] = result[0].units - finalRes.downloads[0];
					finalRes.previousDownloads[1] = result[1].units - finalRes.downloads[1];
					finalRes.previousDownloads[2] = result[2].units - finalRes.downloads[2];
                    finalRes.delta[0] = finalRes.downloads[0] - finalRes.previousDownloads[0];
					finalRes.delta[1] = finalRes.downloads[1] - finalRes.previousDownloads[1];
					finalRes.delta[2] = finalRes.downloads[2] - finalRes.previousDownloads[2];
               //     finalRes.deltaPercentage = getDeltaPercentage(finalRes.downloads[0], finalRes.previousDownloads[0]);
					console.log("Italy");
					console.log(finalRes);
                  //  if(callback) callback(finalRes)
                }
            });
        }
    });
	
	itunes.request(Report.ranked().time(1, 'weeks').location(143454), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
			finalRes.downloads = []
			finalRes.previousDownloads = []
			finalRes.delta = []
            finalRes.downloads[0] = result[0].units;
			finalRes.downloads[1] = result[1].units;
			finalRes.downloads[2] = result[2].units;
            itunes.request(Report.ranked().time(2, 'weeks').location(143454), function (error, result) {
                if(error) return error
                if(result){
                    finalRes.previousDownloads[0] = result[0].units - finalRes.downloads[0];
					finalRes.previousDownloads[1] = result[1].units - finalRes.downloads[1];
					finalRes.previousDownloads[2] = result[2].units - finalRes.downloads[2];
                    finalRes.delta[0] = finalRes.downloads[0] - finalRes.previousDownloads[0];
					finalRes.delta[1] = finalRes.downloads[1] - finalRes.previousDownloads[1];
					finalRes.delta[2] = finalRes.downloads[2] - finalRes.previousDownloads[2];
               //     finalRes.deltaPercentage = getDeltaPercentage(finalRes.downloads[0], finalRes.previousDownloads[0]);
					console.log("Spain");
					console.log(finalRes);
                  //  if(callback) callback(finalRes)
                }
            });
        }
    });
	
	itunes.request(Report.ranked().time(1, 'weeks').location(143442), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
			finalRes.downloads = []
			finalRes.previousDownloads = []
			finalRes.delta = []
            finalRes.downloads[0] = result[0].units;
			finalRes.downloads[1] = result[1].units;
			finalRes.downloads[2] = result[2].units;
            itunes.request(Report.ranked().time(2, 'weeks').location(143442), function (error, result) {
                if(error) return error
                if(result){
                    finalRes.previousDownloads[0] = result[0].units - finalRes.downloads[0];
					finalRes.previousDownloads[1] = result[1].units - finalRes.downloads[1];
					finalRes.previousDownloads[2] = result[2].units - finalRes.downloads[2];
                    finalRes.delta[0] = finalRes.downloads[0] - finalRes.previousDownloads[0];
					finalRes.delta[1] = finalRes.downloads[1] - finalRes.previousDownloads[1];
					finalRes.delta[2] = finalRes.downloads[2] - finalRes.previousDownloads[2];
               //     finalRes.deltaPercentage = getDeltaPercentage(finalRes.downloads[0], finalRes.previousDownloads[0]);
			   		console.log("France");
					console.log(finalRes);
                  //  if(callback) callback(finalRes)
                }
            });
        }
    });
	
		itunes.request(Report.ranked().time(1, 'weeks').location(143443), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
			finalRes.downloads = []
			finalRes.previousDownloads = []
			finalRes.delta = []
            finalRes.downloads[0] = result[0].units;
			finalRes.downloads[1] = result[1].units;
			finalRes.downloads[2] = result[2].units;
            itunes.request(Report.ranked().time(2, 'weeks').location(143443), function (error, result) {
                if(error) return error
                if(result){
                    finalRes.previousDownloads[0] = result[0].units - finalRes.downloads[0];
					finalRes.previousDownloads[1] = result[1].units - finalRes.downloads[1];
					finalRes.previousDownloads[2] = result[2].units - finalRes.downloads[2];
                    finalRes.delta[0] = finalRes.downloads[0] - finalRes.previousDownloads[0];
					finalRes.delta[1] = finalRes.downloads[1] - finalRes.previousDownloads[1];
					finalRes.delta[2] = finalRes.downloads[2] - finalRes.previousDownloads[2];
               //     finalRes.deltaPercentage = getDeltaPercentage(finalRes.downloads[0], finalRes.previousDownloads[0]);
			  		console.log("Germany");
					console.log(finalRes);
                  //  if(callback) callback(finalRes)
                }
            });
        }
    });
	
		itunes.request(Report.ranked().time(1, 'weeks').location(143444), function (error, result) {
        var finalRes = {}
        if(error) return error
        if (result){
			finalRes.downloads = []
			finalRes.previousDownloads = []
			finalRes.delta = []
            finalRes.downloads[0] = result[0].units;
			finalRes.downloads[1] = result[1].units;
			finalRes.downloads[2] = result[2].units;
            itunes.request(Report.ranked().time(2, 'weeks').location(143444), function (error, result) {
                if(error) return error
                if(result){
                    finalRes.previousDownloads[0] = result[0].units - finalRes.downloads[0];
					finalRes.previousDownloads[1] = result[1].units - finalRes.downloads[1];
					finalRes.previousDownloads[2] = result[2].units - finalRes.downloads[2];
                    finalRes.delta[0] = finalRes.downloads[0] - finalRes.previousDownloads[0];
					finalRes.delta[1] = finalRes.downloads[1] - finalRes.previousDownloads[1];
					finalRes.delta[2] = finalRes.downloads[2] - finalRes.previousDownloads[2];
               //     finalRes.deltaPercentage = getDeltaPercentage(finalRes.downloads[0], finalRes.previousDownloads[0]);
					console.log("UK");
					console.log(finalRes);
                  //  if(callback) callback(finalRes)
                }
            });
        }
    });