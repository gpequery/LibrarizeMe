'use strict';

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        pseudo: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {

            }
        },
        instanceMethods: {
            getId: function() {
                return this.id;
            },
            toJson: function() {
                return {
                    id: this.id,
                    pseudo: this.pseudo,
                    password: this.password
                }
            }
        }
    });
    return User;
}
