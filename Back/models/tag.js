import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }
  });

  Tag.associate = models => {
    Tag.belongsToMany(models.Mod, {
      through: 'ModTag',
      foreignKey: 'tagId',
      otherKey: 'modId'
    });
  };

  return Tag;
};
