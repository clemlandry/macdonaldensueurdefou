const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { Profil, Pokemon } = require('../models');

async function checkPokemonExiste(nom) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nom.toLowerCase()}`);
        return response.status === 200;
    } catch {
        return false;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ajouterpoke')
        .setDescription('Ajoute un Pokémon à ton équipe ou à ta boîte')
        .addStringOption(opt => 
            opt.setName('nom').setDescription('Nom du Pokémon').setRequired(true))
        .addIntegerOption(opt => 
            opt.setName('niveau').setDescription('Niveau du Pokémon').setRequired(false))
        .addStringOption(opt =>
            opt.setName('talent').setDescription('Talent du Pokémon').setRequired(false))
        .addStringOption(opt =>
            opt.setName('objet').setDescription('Objet tenu').setRequired(false)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const nom = interaction.options.getString('nom');
        const niveau = interaction.options.getInteger('niveau') || 100;
        const talent = interaction.options.getString('talent') || null;
        const objet = interaction.options.getString('objet') || null;

        // Vérifie si le Pokémon existe
        const existe = await checkPokemonExiste(nom);
        if (!existe) {
            return await interaction.reply(`❌ Le Pokémon \`${nom}\` n'existe pas dans le Pokédex.`);
        }

        // Crée le profil si nécessaire
        let profil = await Profil.findOne({ where: { userId } });
        if (!profil) {
            profil = await Profil.create({
                userId,
                prenom: interaction.user.username,
                nom: "Inconnu"
            });
        }

        // Vérifie la taille de l'équipe
        const equipeCount = await Pokemon.count({ where: { profilId: profil.id, equipe: true } });
        const dansEquipe = equipeCount < 6;

        const poke = await Pokemon.create({
            nom,
            niveau,
            talent,
            objet,
            equipe: dansEquipe,
            profilId: profil.id
        });

        await interaction.reply(`✅ ${nom} (Niv ${niveau}) a été ajouté à votre ${dansEquipe ? "équipe" : "boîte"} !`);
    }
};
