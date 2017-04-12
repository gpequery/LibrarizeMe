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
        },
        lastname: {
            type: DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING
        },
        mail: {
            type: DataTypes.STRING
        },
        numberphone: {
            type: DataTypes.STRING
        },
        isMale: {
            type: DataTypes.BOOLEAN
        }
    }, {
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                // User.belongsToMany(models.User, {
                //     through: 'beFriend',
                //     as: 'friend'
                // });
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
                    password: this.password,
                    lastname: this.lastname,
                    firstname: this.firstname,
                    mail: this.mail,
                    numberphone: this.numberphone
                }
            }
        }
    });
    return User;
};
