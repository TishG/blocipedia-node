'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
  };
  User.prototype.isOwner = function() {
    return this.role === "owner";
  };
  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };
  User.prototype.isStandard = function() {
    return this.role === "standard";
  };
  User.prototype.isPremium = function() {
    return this.role === "premium";
  };
  return User;
};