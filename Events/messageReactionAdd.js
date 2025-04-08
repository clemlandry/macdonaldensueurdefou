const { Op } = require('sequelize');
const {Profil} = require('../models');

// ID de l'emoji <:flop:...>
const FLOP_EMOJI_ID = '1356708425517502634';

module.exports = async (client, reaction, user) => {
  try {
    // Sécurité : on fetch si nécessaire
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;

    // Vérifie si c’est l’emoji flop
    if (reaction.emoji.id !== FLOP_EMOJI_ID) return;

    // Si c’est la 3e fois que cet emoji est utilisé sur ce message
    if(reaction.count = 1) {console.log("1 compte")}
    if (reaction.count >= 3) {
      const messageAuthor = reaction.message.author;

      // On ne flop pas les bots
      if (!messageAuthor || messageAuthor.bot) return;

      // Récupère ou crée le profil
      const [profil] = await Profil.findOrCreate({
        where: { userId: messageAuthor.id },
        defaults: { prenom: messageAuthor.username },
      });

      profil.flops += 1;
      await profil.save();

      // Moquerie publique
      await reaction.message.channel.send({
        content: `<:flop:${FLOP_EMOJI_ID}> **${messageAuthor.username} vient de se prendre un flop légendaire !**\nIl en a maintenant **${profil.flops}**.`,
      });
    }
  } catch (error) {
    console.error('Erreur dans messageReactionAdd :', error);
  }
};
