const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const eventsFolder = path.join(__dirname, '../Events'); // Utiliser __dirname pour un chemin absolu
    const eventFiles = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`${eventsFolder}/${file}`);
        
     client.on(file.split(".js").join(""), event.bind(null, client));
     console.log(`[Event] ${file.split(".js").join("")} loaded.`);
    }
};
