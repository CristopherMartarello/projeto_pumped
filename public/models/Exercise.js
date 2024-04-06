const Sequelize = require('sequelize');
const db = require('./database');

/**
 * Modelo para interação com a tabela de rotinas.
 * @const {RoutineModel}
 */
const { RoutineModel } = require('./Routine');

/**
 * Classe que representa os exercícios de um treino. A partir dela os exercícios sao criados e salvos.
 */
class Exercise {
    #name;
    #focus;
    #rep;
    #series;
    #rest;

    /**
    * Construtor dos exercícios.
    * @constructor
    * @param {string} name - O nome do exercício.
    * @param {string} focus - O grupo muscular atingido pelo exercício.
    * @param {int} rep - O número de repetições do exercício.
    * @param {int} series - O número de séries do exercício.
    * @param {int} rest - O tempo de descanso entre as séries do exercício, em segundos.
    */
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

    /**
    * Cria um novo exercício no banco de dados.
    * @async
    * @param {Object} newExercise - Objeto contendo os detalhes do novo exercício a ser criado.
    * @returns {Promise<Object>} Uma Promise que resolve para o objeto do exercício criado.
    * @throws {Error} Lança um erro se houver algum problema ao inserir o exercício.
    */
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

    /**
    * Busca todos os exercícios com o foco especificado no banco de dados.
    * @async
    * @param {string} routineFocus - O grupo muscular atingido pelos exercícios a serem buscados.
    * @returns {Promise<Array<Object>>} Uma Promise que resolve para um array de objetos contendo todos os exercícios encontrados com o foco especificado.
    * @throws {Error} Lança um erro se houver algum problema ao buscar os exercícios.
    */
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

    /**
    * Conta o número total de exercícios no banco de dados.
    * @async
    * @returns {Promise<number>} Uma Promise que resolve para o número total de exercícios encontrados.
    * @throws {Error} Lança um erro se houver algum problema ao contar os exercícios.
    */
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

/**
 * Modelo de tabela para exercícios.
 * @typedef {Object} ExerciseModel
 * @property {int} id - Identificador único do exercício.
 * @property {string} name - Nome do exercício.
 * @property {string} focus - Foco do exercício.
 * @property {int} rep - Número de repetições do exercício.
 * @property {int} series - Número de séries do exercício.
 * @property {int} rest - Tempo de descanso entre as séries do exercício, em segundos.
 * @property {int|null} routineId - ID da rotina à qual o exercício está associado, se houver.
 */
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
