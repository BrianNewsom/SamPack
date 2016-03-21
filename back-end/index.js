var http = require('http'),
    Communicator = require('./node-MaxComm/index.js'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    watson = require('watson-developer-cloud');

function start(){
  //TODO: Refactor
	var toneAnalyzer = watson.tone_analyzer({
		username: process.env.WATSON_USERNAME,
		password: process.env.WATSON_PASSWORD,
		version: 'v3-beta',
		version_date: '2016-02-11'
	});

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	var KEYWORDS = [{
					"keyword": "reverb", 
					"rex": /(reverb.?)|(echo.*)/, 
					arrIndex: 5
			}, {
					"keyword": "distortion", 
					"rex": /(distort.*)|(crunch.?)|(overdrive.?)|(loud)/, 
					arrIndex: 6
			}
	];

	app.get('/tone', function(req, res){
			console.log("Got /tone");
			var raw = req.query.text
			var output = [0, 0, 0, 0, 0, 0, 0]

			if (!raw){
					res.json({"error":"Please provide text query param"});
					return
			}

			toneAnalyzer.tone({ text: raw },
					function(err, tone) {
							if (err){
								console.log(err);
								res.json({"error": err});
							} else{
								res.json({
									"status": "OK",
									"data": addKeywords(raw, parseResponse(tone, output))
								});
							}
					});
	})

	function addKeywords(rawText, output){
			var found = []
			for (i in KEYWORDS){
					var k = KEYWORDS[i];
					if (k.rex.test(rawText)){
							found.push(k.keyword);
							output[k.arrIndex] = 1;
					}
			}
			console.log(found);
			return output
	}

	app.get('*', function(req, res){

	});

	function parseResponse(res, output){
			var data = res["document_tone"]["tone_categories"][0].tones

			for (i in data) {
					var tone = data[i];
					switch(tone["tone_id"]) {
							case "anger":
									output[0] = tone.score
									break;
							case "disgust":
									output[1] = tone.score
									break;
							case "fear":
									output[2] = tone.score
									break;
							case "joy":
									output[3] = tone.score
									break;
							case "sadness":
									output[4] = tone.score
									break;
							default:
									break;
					}
			}
			return output;
	}

	var comm = new Communicator(7374, server);
	console.log("Starting BackEnd on port 8080");
	server.listen(8080);
}

module.exports = start;
