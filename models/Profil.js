const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Profil', {
    userId: { type: DataTypes.STRING, allowNull: false, unique: true },
    prenom: { type: DataTypes.STRING, allowNull: false },
    nom: { type: DataTypes.STRING, allowNull: false },
    argent: { type: DataTypes.INTEGER, defaultValue: 1000 }
  }, {
    tableName: 'Profils'
  });
};
