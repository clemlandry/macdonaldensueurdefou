const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const commands = [];
    const commandsFolder = path.join(__dirname, '../Commandes');

    function getCommandFiles(dir) {
        let commandFiles = [];
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                commandFiles = commandFiles.concat(getCommandFiles(fullPath));
            } else if (file.name.endsWith('.js')) {
                commandFiles.push(fullPath);
            }
        }
        return commandFiles;
    }

    const commandFiles = getCommandFiles(commandsFolder);

    for (const file of commandFiles) {
        const command = require(file);
        if (command.data && command.data instanceof SlashCommandBuilder) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        }
    }

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    try {
        console.log('[INFO] Déploiement des commandes slash.');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('[SUCCESS] Les commandes slash ont été déployées avec succès.');
    } catch (error) {
        console.error(error);
    }
};
