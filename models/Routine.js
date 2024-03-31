const Sequelize = require('sequelize');
const db = require('./database');
const { UserModel } = require('./User');

class Routine {
    #name;
    #focus;
    #exercises;
    #feedback = 0;
    #userId;

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

    async getExercises() {
        return this.sequelizeModel.getExercises();
    }

    async setExercises(exercises) {
        return this.sequelizeModel.setExercises(exercises);
    }

    static async create(newRoutine) {
        console.log('newRoutine', newRoutine);
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

    static async update(routine) {
        console.log('ROTINA ID', routine.routine.id);
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

