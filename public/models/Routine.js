const Sequelize = require('sequelize');
const db = require('./database');

/**
 * Modelo de usuário para interação com a tabela de usuários.
 * @const {UserModel}
 */
const { UserModel } = require('./User');

/**
 * Classe que representa a rotina de treino. A partir dela as rotinas de treino sao criadas e salvas.
 */
class Routine {
    #name;
    #focus;
    #exercises;
    #feedback = 0;
    #userId;

    /**
     * Construtor das rotinas.
     * @constructor
     * @param {string} name Nome da rotina.
     * @param {string} focus Gropo muscular escolhido para a rotina.
     * @param {int} userId Id do usuário que criou a rotina.
     */
    constructor(name, focus, userId) {
        this.#name = name;
        this.#focus = focus;
        this.#userId = userId;
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

    get exercises() {
        return this.#exercises;
    }

    set exercises(value) {
        this.#exercises = value;
    }

    get feedback() {
        return this.#feedback;
    }

    set feedback(value) {
        this.#feedback = value;
    }

    get userId() {
        return this.#userId;
    }

    set userId(value) {
        this.#userId = value;
    }

    /**
    * Obtém os exercícios associados a este modelo.
    * @async
    * @returns {Promise<Array>} Uma Promise que resolve para um array de exercícios associados a este modelo.
    */
    async getExercises() {
        return this.sequelizeModel.getExercises();
    }

    /**
    * Define os exercícios associados a este modelo.
    * @async
    * @param {Array} exercises - Um array de exercícios a serem associados a este modelo.
    * @returns {Promise<void>} Uma Promise que resolve quando os exercícios são definidos com sucesso.
    */
    async setExercises(exercises) {
        return this.sequelizeModel.setExercises(exercises);
    }

    /**
    * Cria uma nova rotina de treino no banco de dados.
    * @async
    * @param {Object} newRoutine - Objeto contendo os detalhes da nova rotina de treino.
    * @returns {Promise<Object>} Uma Promise que resolve para a rotina de treino criada.
    * @throws {Error} Lança um erro se houver algum problema ao inserir a rotina no banco de dados.
    */
    static async create(newRoutine) {
        try {
            const routine = await db.models.Routine.create({
                name: newRoutine.name,
                focus: newRoutine.focus,
                userId: newRoutine.userId
            });
            console.log('Treino inserido no banco de dados:', routine.name);
            return routine;
        } catch (error) {
            console.error('Erro ao inserir treino no banco de dados:', error);
            throw error;
        }
    }

    /**
     * Função assíncrona para encontrar a rotina com base no id do usuário.
     * @async
     * @param {int} userId Id do usuário.
     * @returns Objeto da rotina.
     * @throws {Error} Lança um erro se houver algum problema ao buscar a rotina de treino.
     */
    static async findByUserId(userId) {
        try {
            const routines = await db.models.Routine.findAll({
                where: {
                    userId: userId
                }
            });

            return routines;
        } catch (error) {
            console.error('Erro ao buscar rotinas pelo ID do usuário:', error);
            throw error;
        }
    }

    /**
     * Função assíncrona para encontrar a rotina com base no id do usuário e no id da rotina.
     * @async
     * @param {int} userId Id do usuário.
     * @param {int} routineId Id da rotina.
     * @returns Objeto da rotina.
     * @throws {Error} Lança um erro se houver algum problema ao buscar a rotina de treino.
     */
    static async findByUserIdAndRoutineId(userId, routineId) {
        try {
            const routine = await db.models.Routine.findOne({
                where: {
                    userId: userId,
                    id: routineId
                }
            });

            return routine;
        } catch (error) {
            console.error('Erro ao buscar rotina pelo ID do usuário e ID da rotina:', error);
            throw error;
        }
    }

    /**
    * Exclui uma rotina de treino associada a um usuário.
    * @async
    * @param {int} userId - O ID do usuário proprietário da rotina de treino.
    * @param {int} routineId - O ID da rotina de treino a ser excluída.
    * @throws {Error} Lança um erro se houver algum problema ao excluir a rotina de treino.
    */
    static async deleteRoutine(userId, routineId) {
        try {
            const response = await fetch(`/user-routine/${userId}/${routineId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                console.error('Erro ao excluir treino:', response.status);
            }
        } catch (error) {
            console.error('Erro ao excluir treino:', error);
        }
    }

    /**
    * Atualiza uma rotina de treino no banco de dados.
    * @async
    * @param {Object} routine - Objeto contendo os detalhes da rotina de treino a ser atualizada.
    * @returns {Promise<number>} Uma Promise que resolve para o número de linhas atualizadas no banco de dados.
    * @throws {Error} Lança um erro se houver algum problema ao atualizar a rotina de treino.
    */
    static async update(routine) {
        try {
            const updatedRoutine = await db.models.Routine.update(routine.routine, {
                where: {
                    id: routine.routine.id
                }
            });
    
            console.log('Rotina atualizada no banco de dados:', updatedRoutine);
            return updatedRoutine;
        } catch (error) {
            console.error('Erro ao atualizar rotina no banco de dados:', error);
            throw error;
        }
    }
    
    /**
    * Incrementa o contador de vezes que a rotina foi realizada.
    * @async
    * @param {Object} routine - Objeto contendo os detalhes da rotina de treino.
    * @returns {Promise<Object>} Uma Promise que resolve para o objeto da rotina de treino atualizado com o contador incrementado.
    * @throws {Error} Lança um erro se houver algum problema ao incrementar o contador.
    */
    async incrementCompletedCount(routine) {
        try {
            routine.feedback = routine.feedback + 1;
            return routine;
        } catch (error) {
            console.error('Erro ao incrementar quantidade de treinos concluídos:', error);
            throw error;
        }
    }

}

/**
 * Modelo de tabela para rotinas de treino.
 * @typedef {Object} RoutineModel
 * @property {int} id - Identificador único da rotina de treino.
 * @property {string} name - Nome da rotina de treino.
 * @property {string} focus - Grupo muscular da rotina de treino.
 * @property {int|null} feedback - Contador de quantas vezes a rotina foi realizada.
 * @property {int} userId - ID do usuário ao qual a rotina de treino está associada.
 */
const RoutineModel = db.define('Routine', {
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
    feedback: {
        type: Sequelize.INTEGER,
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
    tableName: 'routines'
});

//Syncando a model com o banco de dados
RoutineModel.sync();
RoutineModel.belongsTo(UserModel, { foreignKey: 'userId' });
module.exports = { Routine, RoutineModel };

const { ExerciseModel } = require('./Exercise');
RoutineModel.hasMany(ExerciseModel, { foreignKey: 'routineId' });

