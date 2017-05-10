'use strict';

module.exports = function(sequelize, DataTypes) {
    var Swap = sequelize.define('Swap', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        idUser: {
            type: DataTypes.BIGINT
        },
        asinProduct: {
            type: DataTypes.STRING
        },
        etat: {
            type: DataTypes.INTEGER
        },
        startDate: {
            type: DataTypes.DATE
        },
        enDate: {
            type: DataTypes.DATE
        },
        idUserTo: {
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
                    idUser: this.pseudo,
                    asinProduct: this.password,
                    etat: this.lastname,
                    startDate: this.firstname,
                    enDate: this.mail,
                    idUserTo: this.isMale
                }
            }
        }
    });
    return Swap;
};
