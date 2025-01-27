import { DataTypes } from 'sequelize';
export default (sequelize) => {
  const User = sequelize.define('User', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions:{
      type:DataTypes.STRING,
      allowNull:false
    }
    ,isDelete: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    image:{
      type:DataTypes.TEXT,
      allowNull:false,
    }
  }, {
    timestamps: false,
    tableName: 'user',
  });
  User.associate = (models) => {
    User.hasOne(models.Personal, {
      foreignKey: 'id_user',
      as: 'personalDetails',
    });
    User.hasMany(models.Session, {
      foreignKey: 'id_user',
      as: 'sessions',
    });
  };
  return User;
};

