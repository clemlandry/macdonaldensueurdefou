const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Éteint le bot (admin only)'),

    async execute(interaction) {
        const allowedUserId = '464061688069488640'; // ← remplace par ton ID Discord

        if (interaction.user.id !== allowedUserId) {
            return interaction.reply({ content: '❌ Tu n’as pas la permission de faire ça.', ephemeral: true });
        }

        await interaction.reply('🛑 Déconnexion du bot...');
        console.log('🔌 Shutdown demandé par', interaction.user.username);
        process.exit(0); // ← quitte le processus proprement
    }
};
