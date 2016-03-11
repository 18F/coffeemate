function Bot(rtm, request, token) {
	var coffeeQueue = []
	function openGroupChat(coffeemateId, coffeeQueue) {
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

	function listenForPrompts(coffeemateId) {
		rtm.start();

		var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

		rtm.on(RTM_EVENTS.MESSAGE, function (message) {
		  if(message.type === 'message' && message.text.toLowerCase().indexOf('coffee me') >= 0
		  		&& message.user !== coffeemateId) {
		  	coffeeQueue.push(message.user);
		  	if(coffeeQueue.length === 1) {
		  		rtm.sendMessage("You’re in line for coffee! " +
		  			"You’ll be introduced to the next person who wants to meet up.", message.channel);	
		  	}

		  	if(coffeeQueue.length === 2) {
		  		if(coffeeQueue[0] !== coffeeQueue[1]) {
			  		rtm.sendMessage(
			  			"You’ve been matched up for coffee with <@" + coffeeQueue[0] + ">! " +
			  			"I’ll start a direct message for you two. :coffee: :tada:", 
			  			message.channel);	
			  		openGroupChat(coffeemateId, coffeeQueue, rtm);	  		
		  		} else {
		  			rtm.sendMessage("You’re no longer in line for coffee. " +
		  				"But go ahead and pour yourself a cup—you deserve a break.", 
			  			message.channel);
		  		}

		  		coffeeQueue = [];
		  	}
		  } else {
		  	if(message.type === 'message' && 
		  		(message.text.indexOf(coffeemateId) >= 0 || message.channel[0] == 'D')) {
		  		rtm.sendMessage("Sorry, I didn’t get that. To set up a virtual coffee (or :tea:!), " +
		  			"direct message me and say `coffee me`, and I’ll match you up with a teammate. " +
		  			"You can also post `coffee me` in any channel I’m invited to.", 
			  			message.channel);
		  	}
		  }

		  if(message.type === 'message' && message.text.indexOf('coffee queue') >= 0) {
		  		rtm.sendMessage("People in line for coffee: " + coffeeQueue.length, 
		  			message.channel);	
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

	return {run: run};
}

module.exports.Bot = Bot;