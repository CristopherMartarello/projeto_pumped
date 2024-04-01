const Sequelize = require('sequelize');
const db = require('./database');
const { UserModel } = require('./User');

class Diet {
    #name;
    #calories;
    #focus;
    #ingredients = [];

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

    addIngredient(ingredient) {
        this.#ingredients.push(ingredient);
    }

    calculateTotalCalories() {
        let totalCalories = this.#calories;

        for (const ingredient of this.#ingredients) {
            totalCalories += ingredient.calories;
        }

        return totalCalories;
    }

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

    static async findAll() {
        try {
            const diets = await db.models.Diet.findAll();
            return diets;
        } catch (error) {
            console.error('Erro ao buscar refeições:', error);
            throw error;
        }
    }

    static async count() {
        try {
            const count = await db.models.Diet.count();
            return count;
        } catch (error) {
            console.error('Erro ao contar refeições:', error);
            throw error;
        }
    }

    //função para adicionar ingredients

    //função para calcular total de calorias com os ingredientes adicionados
}

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

// Syncar a model caso não exista
DietModel.sync();
DietModel.belongsTo(UserModel, { foreignKey: 'userId' });


module.exports = { Diet, DietModel };
