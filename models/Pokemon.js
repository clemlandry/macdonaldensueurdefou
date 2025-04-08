const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pokemon = sequelize.define('Pokemon', {
    nom: { type: DataTypes.STRING, allowNull: false },
    surnom: { type: DataTypes.STRING, allowNull: true },
    niveau: { type: DataTypes.INTEGER, defaultValue: 100 },
    talent: { type: DataTypes.STRING },
    objet: { type: DataTypes.STRING },
    attaques: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('attaques');
        return raw ? JSON.parse(raw) : [];
      },
      set(val) {
        this.setDataValue('attaques', JSON.stringify(val));
      }
    },
    shiny: { type: DataTypes.BOOLEAN, defaultValue: false },
    sexe: { type: DataTypes.STRING },
    forme: { type: DataTypes.STRING },
    equipe: { type: DataTypes.BOOLEAN, defaultValue: false },
    teraType: { type: DataTypes.STRING }
  }, {
    tableName: 'Pokemons'
  });

  Pokemon.associate = (models) => {
    Pokemon.belongsTo(models.Profil, {
      foreignKey: 'profilId',
      as: 'proprietaire'
    });
  };

  return Pokemon;
};
