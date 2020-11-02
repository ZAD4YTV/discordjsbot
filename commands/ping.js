module.exports = {
    name: 'ping',
    description: 'Pingea a todos!',
    args: false,
    usage: '$ping',
    cooldown: 300,
    execute(message, args) {
        message.channel.send('Si lo pedis, asi sera, @everyone.');
    },
};