# Coffeemate

### The creamiest matchmaking slackbot

Coffeemate is a slackbot which helps team member get to know each other by setting them up on virtual coffees. The usage is simple:

To sign up for a coffee session, direct message @coffeemate with:
```
+ coffee me!
```

To sign up for coffee from a public channel, invite @coffeemate and then say:
```
+ coffee me!
```

It just looks for "coffee me" in a case-insensitive way in the sentence, so `coffee me`, `Please Coffee Me`, etc work as well.

If you are wondering if anyone is in line right now, you can also write
```
+ coffee queue
```
And it will respond with the number of people in line, which should always be 0 or 1, since once a pair is made the queue is emptied.

If you ran `coffee me` by mistake and weren't paired with anyone, and don't want to be, you can run `coffee me` again and you will be paired with yourself, which empties the queue and leaves you with 2 cups of coffee all for yourself!