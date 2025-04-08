const Discord = require('discord.js');

require('dotenv/config');
const intents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({intents});
const LoadCommands = require('./Loaders/loadCommands');
const LoadEvents = require('./Loaders/loadEvents');

client.commands = new Discord.Collection();
client.login(process.env.TOKEN);

LoadCommands(client);
LoadEvents(client);


