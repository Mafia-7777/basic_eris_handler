module.exports = {
    name: "help",
    alli: [],
    description: "Help command",
    category: "Misc",
    usage: "help [ command ]",
    botPerms: ['embedLinks'],
    memberPerm: ['sendMessages'],
    
    channelPermCheck: true,
    allowInDm: false,
    nsfw: false,
    dev: false,
    owner: false,
    caryData: true,

    cooldown: 1500,

    minArgs: 0,
    maxArgs: 1,
    ignoreArgs: false,
    
    run: async (bot, msg, args, data) => {
        msg.channel.send('working')
    }
}
