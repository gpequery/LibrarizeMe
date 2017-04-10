'use strict';

module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define('Product', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        libelle: {
            type: DataTypes.STRING,
            unique: true
        },
        description: {
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
    return Product;
};
