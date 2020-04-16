const Eris = require("eris");
const { Random, nodeCrypto } = require("random-js")
 
let bot = new Eris(process.env.DISCORD_BOT_TOKEN)

bot.on("ready", () => console.log("Bot is ready"))

const random = new Random(nodeCrypto)
const rollDice = () => {
    let value = 0
    [1, 2, 3, 4].forEach( i => value += random.integer(-1, 1))
    return value
}

const ladder = [
    "Terrible",
    "Poor",
    "Mediocre",
    "Average",
    "Fair",
    "Good",
    "Great",
    "Superb",
    "Fantastic",
    "Epic",
    "Legendary"
]
const makeMessage = (modifier) => {
    let adjective
    if( modifier > 8 ){
        adjective = ladder[10]
    } else if( modifier < -2 ){
        adjective = ladder[0]
    } else {
        adjective = ladder[modifier + 2]
    }
    return `You rolled { ${modifier} } (${adjective})`
}

bot.on("createMessage", msg => {

    if( !msg.content.match(/^\/fate/) ){
        return
    }

    let tokens = msg.content.split(" ")

    let modifier
    let error = false

    if( tokens.length < 3 ){
        modifier = 0
    } else {
        try {
            modifier = parseInt(tokens[3])
        } catch ( e ){
            modifier = 0
            error = true
        }
    }

    let response = makeMessage(modifier)
    if( error ){
        response = `Could not parse modifier, using 0:\n${response}`
    }

    bot.createMessage(msg.channel.id, response)

})

bot.connect()
