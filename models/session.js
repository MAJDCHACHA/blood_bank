 import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Session = sequelize.define("Session", {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    id_personal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personal',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:`no thing`
    },
    date:{
      type:DataTypes.DATEONLY,
      allowNull:false
    }
  }, {
    tableName: "session",
    timestamps:false,
  });

  Session.associate = (models) => {
    Session.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'user',
    });
    Session.belongsTo(models.Personal, {
      foreignKey: 'id_personal',
      as: 'personal',
    });
  };

  return Session;
};
