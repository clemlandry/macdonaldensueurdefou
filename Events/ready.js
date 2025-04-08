const Discord = require('discord.js');
const ActivityType = require('discord.js')
const { startApiServer } = require('../api/index.js');


const loadSlashCommands = require('../Loaders/loadSlashCommands.js');

module.exports = async client => {

    await loadSlashCommands(client);
    startApiServer(); // Démarre ton API Express

    

    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: `tg`, type: ActivityType.Watching }],
        status: 'dnd',
      });
}