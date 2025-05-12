import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST || 'mysql',
    dialect: 'mysql',
    logging: false,
  }
);

// Importar modelos
import defineUser from './user.js';
import defineMod from './mod.js';
import defineFriendship from './friendship.js';

const models = {
  User: defineUser(sequelize),
  Mod: defineMod(sequelize),
  FriendShip: defineFriendship(sequelize)
};

// Definir asociaciones
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// Crear o actualizar tablas según los modelos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Tablas sincronizadas correctamente.');
  })
  .catch((err) => {
    console.error('❌ Error al sincronizar tablas:', err);
  });

export { sequelize, models };
export default sequelize;
