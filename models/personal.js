import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Personal = sequelize.define('Personal', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    f_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mother_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blood_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:`unknown`
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user', // Matches User table name
        key: 'id',
      },
    },
  }, {
    timestamps: false,
    tableName: 'personal',
  });

  Personal.associate = (models) => {
    Personal.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'user',
    });
    Personal.hasMany(models.Session, {
      foreignKey: 'id_personal',
      as: 'sessions',
    });
  };

  return Personal;
};
