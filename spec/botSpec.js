bot = require('../bot.js');
app = require('../app.js');

describe("coffeebot works", function() {
	var request;
	var rtm;
	var token;
	var messages;
	var channels;

	beforeEach(function() {
		token ='testToken';
		request= {get: function(options, callback) {
			if(options.url === 'https://slack.com/api/users.list') {
				callback(null, null, JSON.stringify({ok: true, members: [{name: 'coffeemate', id: 'coffemateId1234'}]}));
			};

			if(options.url === 'https://slack.com/api/mpim.open') {
				callback(null, null, JSON.stringify({ok: true, group: {id: 'groupId1234'}}));
			};
		}};
		messages = [];
		channels = [];
		rtm = {start: function(){}, 
				   sendMessage: function(message, channel) {
				   		messages.push(message);
				   		channels.push(channel);
				  	}}
	}) 
	
	it("responds to coffee me", function(done) {
		rtm.on = function(event, callback) {
						callback({type: "message", text: "coffee me", user: "userA", channel: "ch1"});
						}
		var coffeemate = bot.Bot(rtm, request, token)
		coffeemate.run();
		expect(messages[0].indexOf('in line') > 0).toBe(true);
		expect(channels[0]).toBe('ch1');
		done();
	});

	it("responds to coffee queue", function(done) {
		rtm.on = function(event, callback) {
						callback({type: "message", text: "coffee queue", user: "userA", channel: "ch1"});
						}
		var coffeemate = bot.Bot(rtm, request, token)
		coffeemate.run();
		expect(messages[0].indexOf('People in line for coffee') >= 0).toBe(true);
		expect(channels[0]).toBe('ch1');
		done();
	});
	
	it("responds with help text when mentioned", function(done) {
		rtm.on = function(event, callback) {
						callback({type: "message", 
							text: "<@coffemateId1234>: blahblah", user: "userA", channel: "ch1"});
						}
		var coffeemate = bot.Bot(rtm, request, token)
		coffeemate.run();
		expect(messages[0].indexOf("I’ll match you up with a teammate") >= 0).toBe(true);
		expect(channels[0]).toBe('ch1');
		done();
	});

	it("responds with help text when direct messaged", function(done) {
		rtm.on = function(event, callback) {
						callback({type: "message", 
							text: "blahblah", user: "userA", channel: "D1234"});
						}
		var coffeemate = bot.Bot(rtm, request, token)
		coffeemate.run();
		expect(messages[0].indexOf("I’ll match you up with a teammate") >= 0).toBe(true);
		expect(channels[0]).toBe('D1234');
		done();
	});

	it("pairs up users for coffee, sending message and setting up group chat", function(done) {
		rtm.on = function(event, callback) {
						callback({type: "message", 
							text: "coffee me", user: "userA", channel: "ch1"});
						callback({type: "message", 
							text: "please Coffee Me!", user: "userB", channel: "ch2"});
						}
		var coffeemate = bot.Bot(rtm, request, token)
		coffeemate.run();
		expect(messages[0].indexOf('in line') > 0).toBe(true);
		expect(channels[0]).toBe('ch1');
		expect(messages[1].indexOf("matched up for coffee") >= 0).toBe(true);
		expect(channels[1]).toBe('ch2');
		expect(messages[2].indexOf("You two have been paired up") >= 0).toBe(true);
		expect(channels[2]).toBe('groupId1234');
		done();
	});

	it("empties queue when self pairing", function(done) {
		rtm.on = function(event, callback) {
						callback({type: "message", 
							text: "coffee me", user: "userA", channel: "ch1"});
						callback({type: "message", 
							text: "please Coffee Me!", user: "userA", channel: "ch1"});
						callback({type: "message", 
							text: "coffee queue", user: "userA", channel: "ch1"});
						}
		var coffeemate = bot.Bot(rtm, request, token)
		coffeemate.run();
		expect(messages[0].indexOf('in line') > 0).toBe(true);
		expect(channels[0]).toBe('ch1');
		expect(messages[1].indexOf('You’re no longer in line for coffee.') >= 0).toBe(true);
		expect(channels[1]).toBe('ch1');
		expect(messages[2].indexOf('People in line for coffee: 0') >= 0).toBe(true);
		expect(channels[2]).toBe('ch1');
		done();
	});
});