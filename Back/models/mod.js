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
        category: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        file_path: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislikes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        security: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        average_rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        downloads: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
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