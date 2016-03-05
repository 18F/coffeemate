var RtmClient = require('@slack/client').RtmClient;
var request = require('request');

var token = process.env.SLACK_API_TOKEN || '';


function getCoffeemateId(callback) {
	var options = {url: "https://slack.com/api/users.list",
					qs: {token: token}};
	request.get(options, function(err, response, body) {
	    bodyObj = JSON.parse(body);
	    if(bodyObj.ok) {
	    	var coffeemateId = bodyObj.members.filter(function(member) {
	    		return member.name === 'coffeemate'})[0].id
	    	console.log(coffeemateId);
	    	callback(coffeemateId);
	    }
})}



	
function listenForPrompts() {
	var rtm = new RtmClient(token, {logLevel: 'debug'});
	rtm.start();

	var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

	rtm.on(RTM_EVENTS.MESSAGE, function (message) {
		console.log('-------MESSAGE---------');
		console.log(message);
	  if(message.type === 'message' && message.text.indexOf('coffee me') >= 0) {
	  	console.log('YOU HAVE SIGNED UP FOR VIRTUAL COFFEE!!!!!')
	  	console.log(message);

	  	rtm.sendMessage("<@" + message.user + ">: You're signed up for coffee!", message.channel);	
	  }
	});	
}

getCoffeemateId(listenForPrompts)
