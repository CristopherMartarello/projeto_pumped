// Tabela que expressa a relação entre Dieta e Ingrediente (Muitos para Muitos)

const Sequelize = require('sequelize');
const db = require('./database'); 

/**
 * Modelo para interação com a tabela de dietas.
 * @const {DietModel}
 */
const { DietModel } = require('./Diet');

/**
 * Modelo para interação com a tabela de ingredientes.
 * @const {IngredientModel}
 */
const { IngredientModel } = require('./Ingredient');

/**
 * Classe que representa a relação entre a tabela Diet e Ingredient.
 */
class DietIngredient {

    /**
    * Encontra um ingrediente pelo nome no banco de dados.
    * @async
    * @param {string} name - O nome do ingrediente a ser encontrado.
    * @returns {Promise<Object|null>} Uma Promise que resolve para o objeto do ingrediente encontrado ou null se não for encontrado.
    * @throws {Error} Lança um erro se houver algum problema ao encontrar o ingrediente.
    */
    static async findOne(name) {
        try {
            const ingredient = await IngredientModel.findOne({ where: { name } });
            return ingredient;
        } catch (error) {
            console.error('Erro ao encontrar o ingrediente:', error);
            throw error;
        }
    }

    /**
    * Cria uma nova relação entre uma dieta e um ingrediente no banco de dados.
    * @async
    * @param {int} dietId - O ID da dieta relacionada.
    * @param {int} ingredientId - O ID do ingrediente relacionado.
    * @returns {Promise<Object>} Uma Promise que resolve para o objeto representando a relação de dieta e ingrediente criada.
    * @throws {Error} Lança um erro se houver algum problema ao criar a relação de dieta e ingrediente.
    */
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

    /**
    * Encontra ou cria uma relação entre uma dieta e um ingrediente no banco de dados.
    * Se a relação já existir, retorna a relação existente. Caso contrário, cria uma nova relação e a retorna.
    * @async
    * @param {int} dietId - O ID da dieta relacionada.
    * @param {int} ingredientId - O ID do ingrediente relacionado.
    * @returns {Promise<Object>} Uma Promise que resolve para o objeto representando a relação de dieta e ingrediente encontrada ou criada.
    * @throws {Error} Lança um erro se houver algum problema ao encontrar ou criar a relação de dieta e ingrediente.
    */
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

    /**
    * Encontra as relações entre uma dieta e seus ingredientes pelo ID da dieta no banco de dados.
    * @async
    * @param {int} dietId - O ID da dieta para a qual buscar as relações de ingredientes.
    * @returns {Promise<Array<Object>>} Uma Promise que resolve para um array de objetos representando as relações de dieta e ingrediente encontradas para a dieta especificada.
    * @throws {Error} Lança um erro se houver algum problema ao encontrar as relações de dieta e ingrediente pelo ID da dieta.
    */
    static async findByDietId(dietId) {
        try {
            const dietIngredients = await DietIngredientModel.findAll({
                where: { dietId: dietId }
            });
            return dietIngredients;
        } catch (error) {
            console.error('Erro ao encontrar as relações de Dieta e Ingrediente pelo ID da Dieta:', error);
            throw error;
        }
    }
}

/**
 * Modelo de tabela para relações entre dietas e ingredientes.
 * @typedef {Object} DietIngredientModel
 * @property {int} id - Identificador único da relação entre dieta e ingrediente.
 * @property {int|null} dietId - ID da dieta associada à relação. Pode ser nulo se a relação for inválida.
 * @property {int|null} ingredientId - ID do ingrediente associado à relação. Pode ser nulo se a relação for inválida.
 */
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