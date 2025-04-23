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

import defineUser from './user.js';
import defineMod from './mod.js';
import defineFriendship from './friendship.js';

const models = {
  User: defineUser(sequelize),
  Mod: defineMod(sequelize),
  FriendShip: defineFriendship(sequelize)
};

// Definir asociaciones (si existen)
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize, models };
export default sequelize;