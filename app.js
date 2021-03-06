var http = require('http');
var RtmClient = require('@slack/client').RtmClient;
var request = require('request');
var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token);
var bot = require('./bot.js').Bot(rtm, request, token);

var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Coffeemate is alive.\n');
});

server.listen(process.env.PORT || 3000, function() {
  if(process.env.testRun === 'true') {
  	server.close();
  } else {
	  bot.run();
	  console.log('Coffeemate is running.');	
  }
});