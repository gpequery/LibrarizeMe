'use strict';

module.exports = function(sequelize, DataTypes) {
    var Friends = sequelize.define('Friends', {
        accepted: {
            type: DataTypes.BOOLEAN,
            primaryKey: false,
            autoIncrement: false
        }
    }, {
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Friends.belongsTo(models.User, {
                    as: 'user'
                });
                Friends.belongsTo(models.User, {
                    as: 'friend'
                });
            }
        },
        instanceMethods: {
            getId: function() {
                return this.id;
            }
        }
    });
    return Friends;
};
