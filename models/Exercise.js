const Sequelize = require('sequelize');
const db = require('./database');
const { RoutineModel } = require('./Routine');

class Exercise {
    #name;
    #focus;
    #rep;
    #series;
    #rest;

    constructor(name, focus, rep, series, rest) {
        this.#name = name;
        this.#focus = focus;
        this.#rep = rep;
        this.#series = series;
        this.#rest = rest;
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get focus() {
        return this.#focus;
    }

    set focus(value) {
        this.#focus = value;
    }

    get rep() {
        return this.#rep;
    }

    set rep(value) {
        this.#rep = value;
    }

    get series() {
        return this.#series;
    }

    set series(value) {
        this.#series = value;
    }

    get rest() {
        return this.#rest;
    }

    set rest(value) {
        this.#rest = value;
    }

    static async create(newExercise) {
        try {
            const exercise = await db.models.Exercise.create({
                name: newExercise.name,
                focus: newExercise.focus,
                rep: newExercise.rep,
                series: newExercise.series,
                rest: newExercise.rest
            });
            console.log('Exercício inserido no banco de dados:', exercise.name);
            return exercise;
        } catch (error) {
            console.error('Erro ao inserir exercício no banco de dados:', error);
            throw error;
        }
    }

    static async findAll(routineFocus) {
        try {
            const exercises = await db.models.Exercise.findAll({
                where: {
                    focus: routineFocus
                }
            });
            return exercises;
        } catch (error) {
            console.error('Erro ao buscar exercícios:', error);
            throw error;
        }
    }

    static async count() {
        try {
            const count = await db.models.Exercise.count();
            return count;
        } catch (error) {
            console.error('Erro ao contar exercícios:', error);
            throw error;
        }
    }
}

const ExerciseModel = db.define('Exercise', {
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
    focus: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rep: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    series: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    rest: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    routineId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: RoutineModel,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'exercises'
});

ExerciseModel.belongsTo(RoutineModel, { foreignKey: 'routineId' });

// Syncar a model caso não exista
ExerciseModel.sync();

module.exports = { Exercise, ExerciseModel };
