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
    dev: true,
    owner: false,

    cooldown: 1500,

    run: async (bot, msg, args) => {
        msg.channel.send('working')
    }
}