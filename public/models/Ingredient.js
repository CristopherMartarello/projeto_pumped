const Sequelize = require('sequelize');
const db = require('./database');

/**
 * Modelo para interação com a tabela de ingredientes da dieta.
 * @const {DietIngredientModel}
 */
const { DietIngredientModel } = require('./DietIngredient'); 

/**
 * Modelo para interação com a tabela de dietas.
 * @const {DietModel}
 */
const { DietModel } = require('./Diet');

/**
 * Classe que representa os ingredientes para as dietas. A partir dela os ingredientes sao criados e salvos.
 */
class Ingredient {

    /**
    * Encontra um ingrediente pelo nome no banco de dados.
    * @async
    * @param {string} nome - O nome do ingrediente a ser encontrado.
    * @returns {Promise<Object|null>} Uma Promise que resolve para o objeto do ingrediente encontrado ou null se não for encontrado.
    * @throws {Error} Lança um erro se houver algum problema ao encontrar o ingrediente.
    */
    static async findOne(nome) {
        try {
            const ingredient = await IngredientModel.findOne({ where: { nome } });
            return ingredient;
        } catch (error) {
            console.error('Erro ao encontrar o ingrediente:', error);
            throw error;
        }
    }

    /**
    * Encontra um ingrediente pelo ID do ingrediente no banco de dados.
    * @async
    * @param {int} id - O ID do ingrediente a ser encontrado.
    * @returns {Promise<Object|null>} Uma Promise que resolve para o objeto do ingrediente encontrado ou null se não for encontrado.
    * @throws {Error} Lança um erro se houver algum problema ao encontrar o ingrediente.
    */
    static async findOneById(id) {
        try {
            const ingredient = await IngredientModel.findOne({ where: { id } });
            return ingredient;
        } catch (error) {
            console.error('Erro ao encontrar o ingrediente:', error);
            throw error;
        }
    }

    /**
    * Cria um novo ingrediente no banco de dados.
    * @async
    * @param {Object} newIngredient - Objeto contendo os detalhes do novo ingrediente a ser criado.
    * @returns {Promise<Object>} Uma Promise que resolve para o objeto do ingrediente criado.
    * @throws {Error} Lança um erro se houver algum problema ao criar o ingrediente.
    */
    static async create(newIngredient) {
        const {name, calories, userId} = newIngredient;
        const nome = name;
        try {
            const newIngredient = await IngredientModel.create({ nome, calories, userId });
            console.log('Ingrediente criado no banco de dados:', newIngredient);
            return newIngredient;
        } catch (error) {
            console.error('Erro ao criar o ingrediente:', error);
            throw error;
        }
    }

    /**
    * Atualiza um ingrediente no banco de dados.
    * @async
    * @param {int} id - O ID do ingrediente a ser atualizado.
    * @param {Object} dataToUpdate - Objeto contendo os dados a serem atualizados no ingrediente.
    * @returns {Promise<void>} Uma Promise que resolve quando o ingrediente é atualizado com sucesso.
    * @throws {Error} Lança um erro se nenhum ingrediente for atualizado ou se houver algum problema ao atualizar o ingrediente.
    */
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

    /**
    * Busca todos os ingredientes no banco de dados.
    * @async
    * @returns {Promise<Array<Object>>} Uma Promise que resolve para um array de objetos contendo todos os ingredientes encontrados.
    * @throws {Error} Lança um erro se houver algum problema ao buscar os ingredientes.
    */
    static async findAll() {
        try {
            const ingredients = await IngredientModel.findAll();
            return ingredients;
        } catch (error) {
            console.error('Erro ao buscar todos os ingredientes:', error);
            throw error;
        }
    }
}

/**
 * Modelo de tabela para ingredientes.
 * @typedef {Object} IngredientModel
 * @property {int} id - Identificador único do ingrediente.
 * @property {string} nome - Nome do ingrediente.
 * @property {int} calories - Quantidade de calorias do ingrediente a cada 100g.
 */
const IngredientModel = db.define('Ingredient', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
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


