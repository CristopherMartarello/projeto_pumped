// Tabela que expressa a relação entre Dieta e Ingrediente (Muitos para Muitos)

const Sequelize = require('sequelize');
const db = require('./database'); 
const { DietModel } = require('./Diet');
const { IngredientModel } = require('./Ingredient');

class DietIngredient {

    static async findOne(name) {
        try {
            const ingredient = await IngredientModel.findOne({ where: { name } });
            return ingredient;
        } catch (error) {
            console.error('Erro ao encontrar o ingrediente:', error);
            throw error;
        }
    }

    static async create(dietId, ingredientId) {
        try {
            const dietIngredient = await db.models.DietIngredient.create({
                dietId: dietId,
                ingredientId: ingredientId
            });

            console.log('Relação de Dieta e Ingrediente inserida no banco de dados:', dietIngredient);

            return dietIngredient;
        } catch (error) {
            console.error('Erro ao inserir relação de Dieta e Ingrediente no banco de dados:', error);
            throw error;
        }
    }

    static async findOrCreate(dietId, ingredientId) {
        try {
            const existingRelation = await DietIngredientModel.findOne({
                where: { dietId: dietId, ingredientId: ingredientId }
            });

            if (existingRelation) {
                return existingRelation;
            }

            const newRelation = await DietIngredient.create(dietId, ingredientId);
            return newRelation;
        } catch (error) {
            console.error('Erro ao encontrar ou criar a relação de Dieta e Ingrediente:', error);
            throw error;
        }
    }
}

const DietIngredientModel = db.define('DietIngredient', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dietId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'diets', 
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    ingredientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Ingredients',
            key: 'id'
        }
    }
});

//Syncar a model caso não exista
DietIngredientModel.sync();


module.exports = { DietIngredient, DietIngredientModel };
