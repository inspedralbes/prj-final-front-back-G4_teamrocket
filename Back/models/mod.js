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
        Mod.belongsToMany(models.Tag, {
            as: 'tags',
            through: 'ModTag',
            foreignKey: 'modId',
            otherKey: 'tagId',
            onDelete: 'CASCADE'
        });
    };
  
    return Mod;
};