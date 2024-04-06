const Sequelize = require('sequelize');
const db = require('./database');
const { UserModel } = require('./User');

/**
 * Classe que representa as Dietas. A partir dela as dietas sao criadas e salvas.
 */
class Diet {
    #name;
    #calories;
    #focus;
    #ingredients = [];


    /**
     * Cria uma nova instância de Dieta.
     * @param {string} name - O nome da dieta.
     * @param {int} calories - As calorias da dieta.
     * @param {string} focus - O foco da dieta (Ganhar, Manter ou Perder peso).
     */
    constructor(name, calories, focus) {
        this.#name = name;
        this.#calories = calories;
        this.#focus = focus;
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get calories() {
        return this.#calories;
    }

    set calories(value) {
        this.#calories = value;
    }

    get focus() {
        return this.#focus;
    }

    set focus(value) {
        this.#focus = value;
    }

    get ingredients() {
        return this.#ingredients;
    }

    /**
     * Adiciona um ingrediente à dieta.
    * @param {Object} ingredient - O ingrediente a ser adicionado à dieta.
    */
    addIngredient(ingredient) {
        this.#ingredients.push(ingredient);
    }

    /**
    * Calcula o total de calorias da dieta, somando as calorias de todos os ingredientes.
    * @returns {int} O total de calorias da dieta.
    */
    calculateTotalCalories() {
        let totalCalories = this.#calories;

        for (const ingredient of this.#ingredients) {
            totalCalories += ingredient.calories;
        }

        return totalCalories;
    }

    /**
    * Cria uma nova dieta no banco de dados.
    * @async
    * @param {Object} newDiet - Objeto contendo os detalhes da nova dieta a ser criada.
    * @param {int} userId - O ID do usuário proprietário da dieta.
    * @returns {Promise<Object>} Uma Promise que resolve para o objeto representando a dieta criada no banco de dados.
    * @throws {Error} Lança um erro se houver algum problema ao criar a dieta no banco de dados.
    */
    static async create(newDiet, userId) {
        try {
            const diet = await db.models.Diet.create({
                name: newDiet.name,
                calories: newDiet.calories,
                focus: newDiet.focus,
                userId: userId
            });
            console.log('Refeição inserida no banco de dados:', diet.name);
            return diet;
        } catch (error) {
            console.error('Erro ao inserir refeição no banco de dados:', error);
            throw error;
        }
    }

    /**
    * Busca todas as dietas pertencentes a um usuário pelo ID dele.
    * @async
    * @param {int} userId - O ID do usuário para o qual buscar as dietas.
    * @returns {Promise<Array<Object>>} Uma Promise que resolve para um array de objetos representando as dietas encontradas para o usuário especificado.
    * @throws {Error} Lança um erro se houver algum problema ao buscar as dietas pelo ID do usuário.
    */
    static async findByUserId(userId) {
        try {
            const diets = await db.models.Diet.findAll({
                where: {
                    userId: userId
                }
            });

            return diets;
        } catch (error) {
            console.error('Erro ao buscar dietas pelo ID do usuário:', error);
            throw error;
        }
    }

    /**
    * Busca uma dieta específica de um usuário pelo ID do dele e pelo ID da dieta.
    * @async
    * @param {int} userId - O ID do usuário para o qual buscar a dieta.
    * @param {int} dietId - O ID da dieta a ser buscada.
    * @returns {Promise<Object|null>} Uma Promise que resolve para o objeto representando a dieta encontrada ou null se não for encontrada.
    * @throws {Error} Lança um erro se houver algum problema ao buscar a dieta pelo ID do usuário e ID da dieta.
    */
    static async findByUserIdAndDietId(userId, dietId) {
        try {
            const diet = await db.models.Diet.findOne({
                where: {
                    userId: userId,
                    id: dietId
                }
            });

            return diet;
        } catch (error) {
            console.error('Erro ao buscar dieta pelo ID do usuário e ID da dieta:', error);
            throw error;
        }
    }


    /**
    * Atualiza uma dieta existente no banco de dados.
    * @async
    * @param {Object} newDiet - Objeto contendo os novos detalhes da dieta a serem atualizados.
    * @param {int} dietId - O ID da dieta a ser atualizada.
    * @returns {Promise<int[]>} Uma Promise que resolve para um array contendo o número de linhas afetadas pela atualização.
    * @throws {Error} Lança um erro se houver algum problema ao atualizar a dieta.
    */
    static async update(newDiet, dietId) {
        console.log(dietId);
        console.log(newDiet.name, newDiet.focus, newDiet.calories);
        try {
            const updatedDiet = await db.models.Diet.update(newDiet, {
                where: {
                    id: dietId
                }
            });
    
            return updatedDiet;
        } catch (error) {
            console.error('Erro ao atualizar a dieta:', error);
            throw error;
        }
    }

    /**
    * Exclui uma dieta associada a um usuário do banco de dados.
    * @async
    * @param {int} userId - O ID do usuário proprietário da dieta a ser excluída.
    * @param {int} dietId - O ID da dieta a ser excluída.
    * @throws {Error} Lança um erro se houver algum problema ao excluir a dieta.
    */
    static async deleteDiet(userId, dietId) {
        try {
            const response = await fetch(`/user-diet/${userId}/${dietId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                console.error('Erro ao excluir dieta:', response.status);
            }
        } catch (error) {
            console.error('Erro ao excluir dieta:', error);
        }
    }

    /**
    * Conta o número total de dietas no banco de dados.
    * @async
    * @returns {Promise<int>} Uma Promise que resolve para o número total de dietas no banco de dados.
    * @throws {Error} Lança um erro se houver algum problema ao contar as dietas.
    */
    static async count() {
        try {
            const count = await db.models.Diet.count();
            return count;
        } catch (error) {
            console.error('Erro ao contar refeições:', error);
            throw error;
        }
    }

}

/**
 * Modelo de tabela para dietas.
 * @typedef {Object} DietModel
 * @property {int} id - Identificador único da dieta.
 * @property {string} name - Nome da dieta.
 * @property {int} calories - Calorias da dieta.
 * @property {string|null} focus - Foco da dieta.
 * @property {int} userId - ID do usuário proprietário da dieta.
 */
const DietModel = db.define('Diet', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    calories: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    focus : {
        type: Sequelize.STRING,
        allowNull: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'diets'
});

module.exports = { Diet, DietModel };

// Syncar a model caso não exista
DietModel.sync();
DietModel.belongsTo(UserModel, { foreignKey: 'userId' });

const { IngredientModel } = require('./Ingredient');
const { DietIngredientModel } = require('./DietIngredient');
DietModel.belongsToMany(IngredientModel, { through: DietIngredientModel })