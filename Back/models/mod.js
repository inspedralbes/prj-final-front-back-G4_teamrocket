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
        categoria: DataTypes.STRING(255),
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
            allowNull: false
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false
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
            allowNull: false
        },
    }, {
      timestamps: true,
      createdAt: 'uploaded_at',
      updatedAt: false,
      indexes: [
        {
            fields: ['categoria']
        }
      ]
    });
  
    Mod.associate = models => {
      Mod.belongsTo(models.User, { foreignKey: 'uploaded_by' });
    };
  
    return Mod;
};