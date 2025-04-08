const { SlashCommandBuilder } = require('discord.js');
const { Profil, Pokemon } = require('../models');

function formatPokemonShowdown(poke) {
    const lignes = [];

    // Ligne 1 : surnom (Nom) @ Objet
    const surnom = poke.surnom || poke.nom;
    const objetPart = poke.objet ? ` @ ${poke.objet}` : '';
    lignes.push(`${surnom} (${poke.nom})${objetPart}`);

    // Talent
    if (poke.talent) lignes.push(`Ability: ${poke.talent}`);

    // Niveau
    if (poke.niveau && poke.niveau !== 100) lignes.push(`Level: ${poke.niveau}`);

    // Shiny
    if (poke.shiny) lignes.push(`Shiny: Yes`);

    // Tera Type
    if (poke.teraType) lignes.push(`Tera Type: ${poke.teraType}`);

    // EVs – tu peux plus tard stocker ça aussi, pour l’instant on peut skip ou mettre un placeholder
    // lignes.push(`EVs: 252 Atk / 252 Spe / 4 HP`);

    // Attaques
    if (poke.attaques && poke.attaques.length) {
        for (const move of poke.attaques) {
            lignes.push(`- ${move}`);
        }
    }

    return lignes.join('\n');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exportequipe')
        .setDescription('Export ta team actuelle au format Showdown/Smogon'),

    async execute(interaction) {
        const userId = interaction.user.id;

        const profil = await Profil.findOne({ where: { userId } });
        if (!profil) {
            return await interaction.reply("❌ Tu n'as pas encore de profil.");
        }

        const equipe = await Pokemon.findAll({
            where: { profilId: profil.id, equipe: true }
        });

        if (!equipe.length) {
            return await interaction.reply("🫤 Ton équipe est vide !");
        }

        const blocks = equipe.map(poke => formatPokemonShowdown(poke)).join('\n\n');

        // Envoie tout dans un bloc de code
        await interaction.reply({
            content: `📝 **Équipe exportée :**\n\`\`\`\n${blocks}\n\`\`\``,
            ephemeral: true
        });
    }
};
