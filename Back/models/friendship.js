import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Friendship = sequelize.define('Friendship', {
        user1_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user2_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING, // "pending", "active", "blocked"
            defaultValue: "pending",
        },
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  
    Friendship.associate = models => {
      Friendship.belongsTo(models.User, { foreignKey: 'user1_id' });
      Friendship.belongsTo(models.User, { foreignKey: 'user2_id' });
    };

    return Friendship;
}  