const Sequelize = require('sequelize');

/**
 * Conexão com o banco de dados utilizando Sequelize.
 * @type {Sequelize}
 * @typedef {Object} connection
 * @property {string} database - O nome do banco de dados (railway).
 * @property {string} username - O nome de usuário para acessar o banco de dados (root).
 * @property {string} password - A senha para acessar o banco de dados (xSFrOugsTfdurkVbZMNoxPAacHcFrMSD).
 * @property {Object} options - As opções de configuração para a conexão.
 * @property {string} options.host - O host do banco de dados (monorail.proxy.rlwy.net).
 * @property {string} options.port - A porta de conexão com o banco de dados (54941).
 * @property {string} options.dialect - O dialeto do banco de dados (mysql).
 */
const connection = new Sequelize ("railway", "root", "xSFrOugsTfdurkVbZMNoxPAacHcFrMSD", {
    host: 'monorail.proxy.rlwy.net',
    port: '54941',
    dialect: 'mysql'
});


/**
 * Autentica a conexão com o banco de dados.
 * @function authenticate
 * @memberof connection
 * @returns {Promise} Uma Promise que é resolvida se a autenticação for bem-sucedida e rejeitada se ocorrer um erro.
 */
connection.authenticate().then(function(){
    console.log('Conectado com sucesso ao DB');
}).catch(function() {
    console.log('Algum erro ocorreu na conexão...');
})


module.exports = connection;