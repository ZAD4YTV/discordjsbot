module.exports = {
    name: 'example',
    description: 'Example command',
    args: false,
    usage: 'prefix + name',
    cooldown: 300,
    execute(message, args) {
        message.channel.send('Hi! The value "usage" works to describe the usage of the command, for example, if your prefix is!, The usage has to be! + the name of the command.');
    },
};
