var RtmClient = require('@slack/client').RtmClient;
var request = require('request');
var http = require('http');

var token = process.env.SLACK_API_TOKEN || '';

function openGroupChat(coffeemateId, coffeeQueue, rtm) {
	var users = coffeemateId + ',' + coffeeQueue[0] + ',' + coffeeQueue[1];
	var options = {url: "https://slack.com/api/mpim.open",
					qs: {token: token, users: users}};
	request.get(options, function(err, response, body) {
	    bodyObj = JSON.parse(body);
	    if(bodyObj.ok) {
	    	rtm.sendMessage("Hey! You two have been paired up for coffee. Next step is to figure out a time that works for both of you. Enjoy! :coffee:"
	  			, bodyObj.group.id);
	    }
});
}

var coffeeQueue = []
function listenForPrompts(coffeemateId) {
	var rtm = new RtmClient(token, {logLevel: 'debug'});
	rtm.start();

	var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

	rtm.on(RTM_EVENTS.MESSAGE, function (message) {
	  if(message.type === 'message' && message.text.toLowerCase().indexOf('coffee me') >= 0) {
	  	coffeeQueue.push(message.user);
	  	if(coffeeQueue.length === 1) {
	  		rtm.sendMessage("<@" + message.user + ">: You're in line for coffee!" +
	  			" You'll be introduced to the next person who wants coffee.", message.channel);	
	  	}

	  	if(coffeeQueue.length === 2) {
	  		if(coffeeQueue[0] !== coffeeQueue[1]) {
		  		rtm.sendMessage("<@" + message.user + ">: " + 
		  			"You've been matched up for coffee with <@" + coffeeQueue[0] + ">!" + 
		  			" I'll set up a direct message channel for you two. :coffee: :fireworks:", 
		  			message.channel);	
		  		openGroupChat(coffeemateId, coffeeQueue, rtm);	  			
	  		} else {
	  			rtm.sendMessage("<@" + message.user + ">: " + 
	  				"You just paired with yourself for coffee! You really don't need a " +
	  				"bot to orchestrate this, you can just go get a cup. You are no longer " +
	  				"in line to get coffee.", 
		  			message.channel);
	  		}

	  		coffeeQueue = [];
	  	}
	  } else {
	  	if(message.type === 'message' && 
	  		(message.text.indexOf(coffeemateId) >= 0 || message.channel[0] == 'D')) {
	  		rtm.sendMessage("I'm just a simple, creamy, matchmaking robot. To set up a virtual coffee, " + 
	  				"direct message me and say `coffee me`, and I'll match you with another " +
	  				"18fer who has done the same thing. You can also post `coffee me` in any channel " +
	  				"I am invited to.", 
		  			message.channel);
	  	}
	  }

	  if(message.type === 'message' && message.text.indexOf('coffee queue') >= 0) {
	  		rtm.sendMessage("<@" + message.user + ">: There are " + coffeeQueue.length + " folks in line for coffee."
	  			, message.channel);	
	   };	
});}

function run() {
	var options = {url: "https://slack.com/api/users.list",
					qs: {token: token}};
	request.get(options, function(err, response, body) {
	    bodyObj = JSON.parse(body);
	    if(bodyObj.ok) {
	    	var coffeemateId = bodyObj.members.filter(function(member) {
	    		return member.name === 'coffeemate'})[0].id
	    	listenForPrompts(coffeemateId);
	    }
})}


var port = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Coffeemate is alive.\n');
}).listen(port, function() {
  run();
  console.log('Server running.');
});
run();
