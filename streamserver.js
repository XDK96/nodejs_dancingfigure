var http = require('http');
var ws = require('ws');
var express = require('express');
var app = express();
var fs = require('fs');

var fs = require('fs');
const readline = require('readline');

async function readLines(stream) {
 const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity
 });
 return new Promise(resolve => {
  stream.once('error', _ => resolve(null));
  const lines = [];
  rl.on('line', line => lines.push(line));
  rl.on('close', _ => resolve(lines));
 });
}

async function getData()
{
	return new Promise((resolve, reject) => {
		var rawdata=readLines(fs.createReadStream('dtl.csv'));
		rawdata.then(rawdata =>
		{
		var data=[];
		for (let i=0; i<rawdata.length; i++)
		{
			var tmp=rawdata[i].slice(0, -1).split(';');
			data.push(tmp);
		}
		resolve(data);
		});
	});
	
}
imgs=getFrames(3000);
//var imgs=[];

var iter=0;

var server = http.createServer(app);
var wsserver = new ws.Server({ 
    server: server,
});

http.createServer(function (req, res) {
  fs.readFile('main.html', function (err,html){
		if (err){
			throw err;
			console.log("bad");
		}
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(html);
		res.end();	
	});
}).listen(8081);

function getFrames(port)
{
	return new Promise((resolve, reject) => {
		var options = {
                	host: "localhost",
					port: port
		};
        	var request = http.request(options, function (result) {
                	var data = '';
                	result.on('data', function (chunk) {
                        	data += chunk;
                	});
                	result.on('end', function () {
						resolve(JSON.parse(data));
					});
        	});
        	request.on('error', function (e) {
			reject();
			console.log(e.message);
        	});
		request.end();
	});
}



wsserver.on('connection', function(wsconn) {
    console.log('Received new WS connection');
	imgs.then( imgs2 => { 
	console.log(imgs2.length);
	var inter=setInterval( stream, 24, wsconn, imgs2);});
    wsconn.on('message', function(data) {
        console.log(data);
    });
    
});


server.listen(8080, () => {
  
  var inter=setInterval( timer, 24);
  
});

function timer()
{
	iter=(iter+1)%1013;
}

function stream(wsconn, imgs2)
{
	console.log(iter);
	wsconn.send(JSON.stringify(imgs2[iter]));
}