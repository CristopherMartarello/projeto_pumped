const Sequelize = require('sequelize');
const db = require('./database');
const { DietIngredientModel } = require('./DietIngredient'); 
const { DietModel } = require('./Diet');

class Ingredient {
    static async findOne(name) {
        try {
            const ingredient = await IngredientModel.findOne({ where: { name } });
            return ingredient;
        } catch (error) {
            console.error('Erro ao encontrar o ingrediente:', error);
            throw error;
        }
    }

    static async create(newIngredient) {
        const {name, calories, userId} = newIngredient;
        try {
            const newIngredient = await IngredientModel.create({ name, calories, userId });
            console.log('Ingrediente criado no banco de dados:', newIngredient);
            return newIngredient;
        } catch (error) {
            console.error('Erro ao criar o ingrediente:', error);
            throw error;
        }
    }

    static async update(id, dataToUpdate) {
        try {
            const [updatedRows] = await IngredientModel.update(dataToUpdate, { where: { id } });
            if (updatedRows === 0) {
                throw new Error('Nenhum ingrediente foi atualizado. Verifique o ID fornecido.');
            }
            console.log('Ingrediente atualizado com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar o ingrediente:', error);
            throw error;
        }
    }

    // static async findOrCreate(name, calories, userId) {
    //     try {
    //         let ingredient = await IngredientModel.findOne({ where: { name } });

    //         if (ingredient) {
    //             return ingredient;
    //         }
            
    //         ingredient = await IngredientModel.create({ name, calories, userId });

    //         return ingredient;
    //     } catch (error) {
    //         console.error('Erro ao encontrar ou criar o ingrediente:', error);
    //         throw error;
    //     }
    // }
}

const IngredientModel = db.define('Ingredient', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    calories: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

//Syncar a model caso não exista
IngredientModel.sync();
module.exports = { Ingredient, IngredientModel };

IngredientModel.belongsToMany(DietModel, { through: DietIngredientModel });


