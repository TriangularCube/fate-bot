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
        rollValues.push(randomValue)
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
const defaultRunes = {
        plus: "+",
        minus: "-",
        zero: "O"
}
const makeMessage = (roll, modifier, runes) => {

    let total = roll.total + modifier
    let adjective;

    if( total > 8 ){
        adjective = ladder[10];
    } else if( total < -2 ){
        adjective = ladder[0];
    } else {
        adjective = ladder[total + 2];
    }

    let rollArray = roll.rollValues.map( value => {
        switch ( value ) {
            case 1:
                return runes.plus;
            case -1:
                return runes.minus;
            case 0:
                return runes.zero;
        }
    })

    const modifierString = modifier > -1 ? `+${modifier}` : modifier

    return `You rolled { ${total} } (${adjective})\n{ ${rollArray.join(" ")} } with ${modifierString}`;
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

    const emojis = msg.channel.guild.emojis;
    const emojiNames = emojis.map(emoji => emoji.name);
    let runes = defaultRunes;
    if(emojiNames.includes("fatezero") && emojiNames.includes("fateplus") && emojiNames.includes("fateminus")) {
        runes = {
            plus: `<:fateplus:${emojis.find(emoji => emoji.name === "fateplus").id}>`,
            minus: `<:fateminus:${emojis.find(emoji => emoji.name === "fateminus").id}>`,
            zero: `<:fatezero:${emojis.find(emoji => emoji.name === "fatezero").id}>`
        }
    }

    let response = makeMessage(rollDice(), modifier, runes);
    if( error ){
        response = `Could not parse modifier\n${response}`;
    }

    bot.createMessage(msg.channel.id, response);

})

bot.connect();
