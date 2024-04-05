const Sequelize = require('sequelize');
const db = require('./database');

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

    constructor(name, username, email, password, age, weight, height, birth, bio, gender, activity) {
        this.#name = name;
        this.#username = username;
        this.#email = email;
        this.#password = password;
        this.#age = age || 0;
        this.#weight = weight || 0.0;
        this.#height = height || 0.0;
        this.#birth = birth || null;
        this.#bio = bio || '';
        this.#gender = gender || '';
        this.#activity = activity || '';
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

    static async create(newUser) {
        try {
            const user = await db.models.User.create({
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                age: newUser.age ? newUser.age : 0,
                weight: newUser.weight ? newUser.weight : '0.0',
                height: newUser.weight ? newUser.height : '0.0',
                birth: newUser.birth ? newUser.birth : null,
                bio: newUser.bio ? newUser.bio : '',
                gender: newUser.gender ? newUser.gender : '',
                activity: newUser.activity ? newUser.activity : '',
            });
            console.log('Usuário inserido no banco de dados:', user.username);
            return user;
        } catch (error) {
            console.error('Erro ao inserir usuário no banco de dados:', error);
            throw error;
        }
    }

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