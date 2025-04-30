import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Mod = sequelize.define('Mod', {
        id: {
            type: DataTypes.INTEGER, 
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        file_path: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        downloads: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
      timestamps: true,
      createdAt: 'uploaded_at',
      updatedAt: false
    });
  
    Mod.associate = models => {
      Mod.belongsTo(models.User, { foreignKey: 'uploaded_by' });
    };
  
    return Mod;
};