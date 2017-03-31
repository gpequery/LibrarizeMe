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
                    password: this.password,
                    lastname: this.lastname,
                    firstname: this.firstname,
                    mail: this.mail,
                    numberphone: this.numberphone
                }
            }
        }

        /*
         instanceMethods: {
         responsify: function() {
         let result = {};
         result.id = this.id;
         result.lastname = this.lastname;
         result.firstname = this.firstname;
         result.birthdate = this.birthdate;

         if (this.School) {
         result.school_id = this.School.responsify();
         }

         if (this.Project) {
         result.project = this.Project;
         }
         return result;
         }
         }
         */
    });
    return User;
};
