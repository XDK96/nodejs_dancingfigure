var http = require('http');

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
var imgs=[];


var app = http.createServer(function(req,res){
    res.setHeader('Content-Type', 'application/json');
	imgs=getData();
	imgs.then( imgs2 => { 
    res.end(JSON.stringify(imgs2));
	});
});
app.listen(3000);