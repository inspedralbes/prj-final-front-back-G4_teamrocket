export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        unique: true,
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
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    // User.associate = models => {
    //   User.hasMany(models.GameSession, { foreignKey: 'created_by' });
    //   User.hasMany(models.Mod, { foreignKey: 'uploaded_by' });
    //   User.hasMany(models.ModRating, { foreignKey: 'user_id' });
    // };
  
    return User;
};