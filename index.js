// Modulos
const fs = require('fs');
const colors = require('colors');
const Discord = require('discord.js');

// Configuracion
const { prefix, token} = require ('./config.json');

// Iniciando
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

//  Requisitos
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
};
// Fin de Requisitos.

// Mensajes en la consola
client.once('ready', () => {
    console.log('\nIniciando...'.yellow);
    console.log('Ejecutando...'.yellow);
    console.log(`Ejecutado, \nNombre: ${client.user.tag}`.yellow);
    console.log(`Fecha de Creacion: ${client.user.createdAt}`.yellow);
});

client.on('message', message => {
    // Logs
    console.log(`${message.content}`.green);
    
    // Comandos
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    const noArgs = "No has enviado ningun argumento.";
    client.commands.find(cmd=> cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.args && !args.length) {
        return message.channel.send(`${noArgs}`);
    };
    
    // Cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        // Cooldown
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Por favor, espera ${timeLeft.toFixed(1)} segundos para volver a usar el comando. \`${command.name}\`.`);
        };
    };
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('Error al ingresar el comando.');
    };
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('No puedo ejecutar este comando.');
    }
});

// No Tocar
client.login(token);