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