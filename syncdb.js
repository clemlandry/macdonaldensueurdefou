const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.sync({ force: true }); // ou { alter: true }
    console.log('✅ Tables créées avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de la création des tables :', err);
  } finally {
    await sequelize.close();
  }
})();
