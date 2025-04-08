const { SlashCommandBuilder } = require('discord.js');
const { Profil, Pokemon } = require('../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equipe')
        .setDescription('Affiche les Pokémon actuellement dans ton équipe'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Cherche le profil
        const profil = await Profil.findOne({ where: { userId } });
        if (!profil) {
            return await interaction.reply("❌ Tu n'as pas encore de profil. Utilise `/ajouterpoke` pour commencer.");
        }

        // Récupère les Pokémon en équipe
        const pokemons = await Pokemon.findAll({
            where: {
                profilId: profil.id,
                equipe: true
            }
        });

        if (!pokemons.length) {
            return await interaction.reply("🫤 Ton équipe est vide !");
        }

        // Construit le texte d'équipe
        const description = pokemons.map((poke, i) => {
            const attaques = poke.attaques.length ? poke.attaques.join(', ') : 'Aucune';
            return `**${i + 1}. ${poke.nom}** (${poke.surnom}) (Niv ${poke.niveau})${poke.objet ? ` @ ${poke.objet}` : ''}
• Talent : ${poke.talent || "?"}
• Attaques : ${attaques}`;
        }).join('\n\n');

        await interaction.reply({ content: `📦 **Ton équipe :**\n\n${description}`, ephemeral: true });
    }
};
