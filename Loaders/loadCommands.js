const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandsFolder = path.join(__dirname, '../Commandes');

    function getCommandFiles(dir) {
        let commandFiles = [];
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                commandFiles = commandFiles.concat(getCommandFiles(fullPath)); // Récursion
            } else if (file.name.endsWith('.js')) {
                commandFiles.push(fullPath);
            }
        }
        return commandFiles;
    }

    const commandFiles = getCommandFiles(commandsFolder);

    for (const file of commandFiles) {
        const command = require(file);

        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            console.log(`[Command] ${command.data.name} loaded from ${file}`);
        } else {
            console.log(`Le fichier ${file} ne contient pas de nom de commande.`);
        }
    }
};
