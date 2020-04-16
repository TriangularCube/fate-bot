require('dotenv').config()

const Eris = require("eris");
const { Random, nodeCrypto } = require("random-js");

let bot = new Eris(process.env.DISCORD_BOT_TOKEN);

bot.on("ready", () => console.log("Bot is ready"));

const random = new Random(nodeCrypto);
const rollDice = () => {
    let total = 0;
    const rollValues = [];
    [1, 2, 3, 4].forEach( i => {
        const randomValue = random.integer(-1, 1);
        total += randomValue;
        switch (randomValue) {
            case 0:
                rollValues.push("O");
                break;
            case 1:
                rollValues.push("+");
                break;
            case -1:
                rollValues.push("-");
                break;
        }
    });
    return {total, rollValues};
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
];
const makeMessage = (roll, modifier) => {

    let total = roll.total + modifier
    let adjective;

    if( total > 8 ){
        adjective = ladder[10];
    } else if( total < -2 ){
        adjective = ladder[0];
    } else {
        adjective = ladder[total + 2];
    }

    const modifierString = modifier > -1 ? `+${modifier}` : modifier

    return `You rolled { ${total} } (${adjective})\n{ ${roll.rollValues.join(" ")} } and ${modifierString}`;
}

bot.on("messageCreate", msg => {
    if( !msg.content.match(/^\/fate/) ){
        return;
    }

    let tokens = msg.content.split(" ");

    let modifier = 0
    let error = false;

    if( tokens.length > 1 ){
        const parsed = parseInt(tokens[1])

        if(isNaN(parsed)){
            error = true;
        } else {
            modifier = parsed
        }
    }

    let response = makeMessage(rollDice(), modifier);
    if( error ){
        response = `Could not parse modifier`;
    }

    bot.createMessage(msg.channel.id, response);

})

bot.connect();
