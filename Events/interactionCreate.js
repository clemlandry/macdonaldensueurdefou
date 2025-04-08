const path = require('path');
const Discord = require('discord.js');
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ComponentType,
} = require('discord.js');

const { Op } = require('sequelize');


// IDs à ajuster selon votre serveur


module.exports = async (client, interaction) => {
  
  /********************************************************
   * GESTION DES COMMANDES SLASH
   ********************************************************/
  if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
      return;
    }
    
    try {
      // Appeler la méthode execute qui gère elle-même l'autocomplétion
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
    return;
  }

  if (interaction.isCommand()) {
    // Récupérer la commande via son nom
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: 'Commande introuvable.',
        ephemeral: true,
      });
    }
  
    // Exécuter directement la commande sans vérification des permissions
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
      interaction.reply({
        content: "Une erreur est survenue lors de l'exécution de cette commande.",
        ephemeral: true,
      });
    }
  }
};
