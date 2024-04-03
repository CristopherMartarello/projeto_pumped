const Sequelize = require('sequelize');

const connection = new Sequelize ("railway", "root", "CiDrFbNtBRDVUqWjRVpdEqtOAmCGDjjo", {
    host: 'roundhouse.proxy.rlwy.net',
    port: '40875',
    dialect: 'mysql'
});

connection.authenticate().then(function(){
    console.log('Conectado com sucesso ao DB');
}).catch(function() {
    console.log('Algum erro ocorreu na conexão...');
})


module.exports = connection;