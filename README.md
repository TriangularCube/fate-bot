This is a Discord bot for FATE Core System

You can add this bot to your server by using
[this link](https://discordapp.com/api/oauth2/authorize?client_id=700420012313411685&permissions=0&scope=bot)

Currently the only feature is to roll 4 Fate dice. I may expand the bot in the future.

### Commands
 
 `/fate [modifier]`  
 This will roll some Fate dice. This bot will use custom emoji if it exists
 in the server, otherwise it will default to generic text output.  
 The modifier is optional, so `/fate` will simply roll assuming a modifier
 of +0.
 
 Custom emoji is included in the `emoji` directory, or you can use your own.
 This bot will look for the following three emoji names: `fateplus`, `fateminus`,
 and `fatezero`.
