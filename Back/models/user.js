import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar_path: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
  
  User.associate = models => {
    User.hasMany(models.Mod, { foreignKey: 'uploaded_by' });
  };

  return User;
};