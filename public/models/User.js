/**
 * Biblioteca Sequelize para interação com bancos de dados relacionais.
 * @const {Sequelize}
 */
const Sequelize = require('sequelize');

/**
 * Conexão com o banco de dados configurado.
 * @const {Sequelize} db
 */
const db = require('./database');

/**
 * Classe que representa o usuário. A partir dela que as informações do usuário são criadas e salvas.
 */
class User {
    #name;
    #username;
    #email;
    #password;
    #age;
    #weight;
    #height;
    #birth;
    #bio;
    #gender;
    #activity;

    /**
     * Construtor do User.
     * @constructor
     * @param {string} name Nome do usuario.
     * @param {string} username Username do usuário utilizado para o login.
     * @param {string} email Email do usuário utilizado no cadastro.
     * @param {string} password Senha do usuário utilizado para o login.
     * @param {int} age Idade do usuário.
     * @param {double} weight Peso atual do usuário.
     * @param {double} height Altura atual do usuário.
     * @param {dateonly} birth Data de nascimento do usuário.
     * @param {string} bio Biografia do usuário.
     * @param {string} gender Gênero do usuário.
     * @param {float} activity Nível de atividade física do usuário.
     */
    constructor(name, username, email, password, age, weight, height, birth, bio, gender, activity) {
        this.#name = name;
        this.#username = username;
        this.#email = email;
        this.#password = password;
        this.#age = age || 20;
        this.#weight = weight || 60;
        this.#height = height || 1.60;
        this.#birth = birth || null;
        this.#bio = bio || '';
        this.#gender = gender || '';
        this.#activity = activity || 1.1;
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }

    get password() {
        return this.#password;
    }

    set password(value) {
        this.#password = value;
    }

    get age() {
        return this.#age;
    }

    set age(value) {
        this.#age = value;
    }

    get weight() {
        return this.#weight;
    }

    set weight(value) {
        this.#weight = value;
    }

    get height() {
        return this.#height;
    }

    set height(value) {
        this.#height = value;
    }

    get birth() {
        return this.#birth;
    }

    set birth(value) {
        this.#birth = value;
    }

    get bio() {
        return this.#bio;
    }

    set bio(value) {
        this.#birth = value;
    }

    get gender() {
        return this.#gender;
    }

    set gender(value) {
        this.#gender = value;
    }

    get activity() {
        return this.#activity;
    }

    set activity(value) {
        this.#activity = value;
    }

    /**
     * Função assíncrona para criação de um novo usuário.
     * @async
     * @param {object} newUser Objeto instância do usuário.
     * @returns {object} Novo objeto do usuário cadastrado.
     * @throws {Error} Lança um erro se houver algum problema ao inserir o user no banco de dados.
     */
    static async create(newUser) {
        try {
            const user = await db.models.User.create({
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                age: newUser.age ? newUser.age : 20,
                weight: newUser.weight ? newUser.weight : '60',
                height: newUser.weight ? newUser.height : '1.60',
                birth: newUser.birth ? newUser.birth : null,
                bio: newUser.bio ? newUser.bio : '',
                gender: newUser.gender ? newUser.gender : '',
                activity: newUser.activity ? newUser.activity : 1.1,
            });
            console.log('Usuário inserido no banco de dados:', user.username);
            return user;
        } catch (error) {
            console.error('Erro ao inserir usuário no banco de dados:', error);
            throw error;
        }
    }

     /**
     * Função assíncrona para encontrar o Usuário que corresponda com os parâmetros.
     * @async
     * @param {string} username Username digitado pelo usuário.
     * @param {string} password Senha digitada pelo usuário.
     * @returns O user correspondente com os parâmetros.
     * @throws {Error} Lança um erro se houver algum problema em buscar o user.
     */
    static async findAll(username, password) {
        try {
            const users = await db.models.User.findAll({
                where: {
                    username: username,
                    password: password
                }
            });
            return users;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw error;
        }
    }

    /**
     * Função assíncrona para atualizar os dados do usuário.
     * @async
     * @param {object} newData Objeto com os dados do usuário.
     * @param {int} userId Id do user que terá os dados atualizados.
     * @returns Objeto do usuário atualizado
     * @throws {Error} Lança um erro se houver algum problema ao atualizar o user no banco de dados.
     */
    static async update(newData, userId) {
        const { name, username, email, password, age, weight, height, birth, bio, gender, activity } = newData;
        try {
            const updatedUser = await db.models.User.update({name: name, username: username, email: email, password: password, age: age,
            weight: weight, height: height, birth: birth, bio: bio, gender: gender, activity: activity }, {
                where: {
                    id: userId
                }
            });

            console.log('Usuário atualizado no banco de dados:', updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Erro ao atualizar usuário no banco de dados:', error);
            throw error;
        }
    }

    /**
     * Função assíncrona para encontrar o user com base no id do usuário.
     * @async
     * @param {int} userId Id do usuário.
     * @returns Objeto do usuário.
     * @throws {Error} Lança um erro se houver algum problema ao buscar o user no banco de dados.
     */
    static async findById(userId) {
        try {
            const user = await db.models.User.findOne({
                where: {
                    id: userId
                }
            });
    
            return user;
        } catch (error) {
            console.error('Erro ao buscar usuário pelo ID:', error);
            throw error;
        }
    }
}

/**
 * Modelo de criação para tabela User no banco de dados.
 * @typedef {Object} UserModel
 * @property {number} id - Identificador único do usuário.
 * @property {string} name - Nome do usuário.
 * @property {string} username - Nome de usuário exclusivo.
 * @property {string} email - Endereço de email do usuário.
 * @property {string} password - Senha do usuário.
 * @property {number|null} age - Idade do usuário.
 * @property {number|null} weight - Peso do usuário.
 * @property {number|null} height - Altura do usuário.
 * @property {string|null} birth - Data de nascimento do usuário (no formato "YYYY-MM-DD").
 * @property {string|null} bio - Biografia do usuário.
 * @property {string|null} gender - Gênero do usuário.
 * @property {number|null} activity - Atividade do usuário.
 * @property {number|null} imc - Índice de Massa Corporal (IMC) do usuário.
 * @property {number|null} waterIntake - Consumo de água recomendado para o usuário.
 */
const UserModel = db.define('User', {
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
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    weight: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    height: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    bio: {
        type: Sequelize.STRING,
        allowNull: true
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: true
    },
    activity: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    imc: {
        type: Sequelize.FLOAT,
        allowNull: true
    }, 
    waterIntake: {
        type: Sequelize.FLOAT,
        allowNull: true
    }
}, {
    tableName: 'users'
});

// Syncar a model caso não exista
UserModel.sync();

module.exports = { User, UserModel };

const { RoutineModel } = require('./Routine');
UserModel.hasMany(RoutineModel, { foreignKey: 'userId' });