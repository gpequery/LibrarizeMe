'use strict';
const fs = require('fs');

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
        },
        products: {
            type: DataTypes.STRING
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
                    isMale: this.isMale,
                    numberphone: this.numberphone,
                    products: this.products
                }
            },
            toJsonWithAvatar: function() {
                if (fs.existsSync('./public/images/userAvatar/avatar_' + this.id + '.png')) {
                    return {
                        id: this.id,
                        pseudo: this.pseudo,
                        password: this.password,
                        lastname: this.lastname,
                        firstname: this.firstname,
                        mail: this.mail,
                        isMale: this.isMale,
                        numberphone: this.numberphone,
                        haveAvatar: true
                    }
                } else {
                    return {
                        id: this.id,
                        pseudo: this.pseudo,
                        password: this.password,
                        lastname: this.lastname,
                        firstname: this.firstname,
                        mail: this.mail,
                        isMale: this.isMale,
                        numberphone: this.numberphone,
                        haveAvatar: false
                    }
                }
            }
        }
    });
    return User;
};
