# Coffeemate

### The creamiest virtual coffee matchmaking slackbot

[![Build Status](https://travis-ci.org/18F/coffeemate.svg?branch=master)](https://travis-ci.org/18F/coffeemate)  [![Coverage Status](https://coveralls.io/repos/github/18F/coffeemate/badge.svg?branch=master)](https://coveralls.io/github/18F/coffeemate?branch=master)


Coffeemate is a slackbot which helps team members get to know each other by setting them up on virtual coffees. The usage is simple:

To sign up for a coffee session, direct message @coffeemate with:
```
+ coffee me!
```

Or, to sign up for coffee from a public channel, invite @coffeemate and then say:
```
+ coffee me!
```

It just looks for "coffee me" in a case-insensitive way in the sentence, so `coffee me`, `Please Coffee Me`, etc work as well.

If you are wondering if anyone is in line right now, you can also write
```
+ coffee queue
```
And it will respond with the number of people in line, which should always be 0 or 1, since once a pair is made the queue is emptied.

If you ran `coffee me` by mistake and weren't paired with anyone, you can run `coffee me` again and you will be paired with yourself, which empties the queue and leaves you with two cups of coffee all for yourself!