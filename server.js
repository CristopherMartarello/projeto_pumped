const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Pegando os dados dos Mocks
const mockExercises = require('./mock/mockExercises');
const mockDiets = require('./mock/mockDiets');

//Importando a biblioeta do Swagger (necessária para documentar a api)
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

//Estabelecendo conexões com o banco de dados
const { User } = require('./public/models/User'); //a tabela só é criada caso não exista
const { Routine } = require('./public/models/Routine'); //a tabela só é criada caso não exista
const { Exercise } = require('./public/models/Exercise'); //a tabela só é criada caso não exista
const { Diet } = require('./public/models/Diet'); //a tabela só é criada caso não exista
const { DietIngredient } = require('./public/models/DietIngredient'); //a tabela só é criada caso não exista
const { Ingredient } = require('./public/models/Ingredient');//a tabela só é criada caso não exista
const CalorieCalculator = require('./public/models/CalorieCalculator');
const WaterIntakeCalculator = require('./public/models/WaterIntakeCalculator');

//Configurações iniciais do servidor
const app = express(); 
let initialPath = path.join(__dirname, "public"); //definindo a pasta public como o caminho inicial
app.use(bodyParser.json()); //definindo a maneira de como trocaremos os dados
app.use(express.static(initialPath)); //caminho inicial quando ligarmos o servidor

//Criando a configuração do swagger para funcionar com os endpoints
var swaggerDefinition = {
    info: {
        title: 'Pumped Swagger',
        version: '1.0.00',
        description: 'Documentação das APIs da aplicação Pumped'
    },
    components: {
        schemas: require('./schemas.json')
    }
}

var options = {
    swaggerDefinition: swaggerDefinition,
    apis : ['./server.js']
}

var swaggerSpec = swaggerJsDoc(options);
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(initialPath, "home.html"));
})

//USUÁRIO
/**
 * @swagger
 * /register-user:
 *   post:
 *     tags:
 *       - User
 *     description: Cria um novo usuário.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Dados do usuário a ser registrado.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro de validação. Campos ausentes ou inválidos.
 *       500:
 *         description: Erro ao processar a solicitação.
 */
app.post('/register-user', async (req, res) => {
    console.log(req.body);
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ erro: true, mensagem: 'Por favor, preencha todos os campos...' });
    }

    try {
        const newUser = new User(name, username, email, password);

        await User.create(newUser);

        return res.json({ erro: false, mensagem: 'Usuário cadastrado com sucesso!!!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ erro: true, mensagem: 'Erro ao cadastrar usuário...' });
    }
})

/**
 * @swagger
 * /login-user:
 *   post:
 *     tags:
 *       - User
 *     description: Realiza o login de um usuário.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: userCredentials
 *         description: Credenciais do usuário para login.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna os detalhes do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: boolean
 *                   description: Indica se houve erro durante o login.
 *                 mensagem:
 *                   type: string
 *                   description: Mensagem de sucesso ou erro.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro de validação. Campos ausentes ou inválidos.
 *       404:
 *         description: Usuário não encontrado com as credenciais fornecidas.
 *       500:
 *         description: Erro interno do servidor ao fazer login.
 */
app.post('/login-user', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username.length || !password.length) {
        res.json('Por favor, preencha todos os campos...');
    } else {
        try {
            const users = await User.findAll( username, password );

            console.log(users);

            if (users.length > 0) {
                return res.json({
                    erro: false,
                    mensagem: "Usuário encontrado com sucesso.",
                    data: users
                });
            } else {
                return res.status(404).json({
                    erro: true,
                    mensagem: "Usuário não encontrado com as credenciais fornecidas."
                });
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return res.status(500).json({
                erro: true,
                mensagem: "Erro interno do servidor ao fazer login."
            });
        }
    }
})

/**
 * @swagger
 * /update-user:
 *   post:
 *     tags:
 *       - User
 *     description: Atualiza as informações de um usuário existente.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Novos dados do usuário a serem atualizados.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro de validação. Campos ausentes ou inválidos.
 *       500:
 *         description: Erro interno do servidor ao atualizar o usuário.
 */
app.post('/update-user', async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, age, weight, height, birth, bio, id, gender, activity } = req.body;
    
    if (!name || !email || !age || !weight || !height || !birth || !bio) {
        return res.json({ erro: true, mensagem: 'Por favor, preencha todos os campos...' });
    }

    try {
        const newUser = new User(name, username, email, password, age, weight, height, birth, bio, gender, activity);

        await User.update(newUser, id);

        return res.json({ erro: false, mensagem: 'Usuário atualizado com sucesso!!!' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({ erro: true, mensagem: 'Erro ao atualizar usuário...' });
    }
})

/**
 * @swagger
 * /get-user/{:id}:
 *   get:
 *     tags:
 *       - User
 *     description: Retorna um usuário específico baseado em seu id.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Retorna o usuário específico com base em seu id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: Usuário não encontrado com base naquele id.
 *       '500':
 *         description: Erro ao buscar usuário no banco de dados, erro interno.
 */
app.get('/get-user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: true, message: 'Usuário não encontrado' });
        }

        return res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(500).json({ error: true, message: 'Erro ao buscar usuário' });
    }
});

//TREINO
/**
 * @swagger
 * /create-routine:
 *   post:
 *     tags:
 *       - Routine
 *     description: Cria uma nova rotina de treino.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: routine
 *         description: Dados da nova rotina de treino a serem criados.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Routine'
 *     responses:
 *       200:
 *         description: Rotina de treino criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       400:
 *         description: Erro de validação. Campos ausentes ou inválidos.
 *       500:
 *         description: Erro interno do servidor ao criar a rotina de treino.
 */
app.post('/create-routine', async (req, res) => {
    const { name, focus, userId } = req.body;

    if (!name || focus === "Selecione...") {
        return res.json({erro: true, mensagem: 'Por favor preencha todos os campos...'});
    }

    try {
        const newRoutine = new Routine(name, focus, userId);
        
        await Routine.create(newRoutine);

        return res.json({erro: false, mensagem: 'Treino cadastrado com sucesso!!!'});
    } catch (error) {
        console.error('Erro ao criar o treino:', error);
        return res.status(500).json({ erro: true, mensagem: 'Erro ao criar treino...' });
    }
})

/**
 * @swagger
 * /user-routines/{:userId}:
 *   get:
 *     tags:
 *       - Routine
 *     description: Retorna todas as rotinas atreladas aquele id de usuário fornecido.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Routine'
 *     responses:
 *       '200':
 *         description: Retorna as rotinas que são pertencentes aquele usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       '404':
 *         description: Rotinas não encontradas com base naquele id de usuário.
 *       '500':
 *         description: Erro ao buscar rotinas no banco de dados, erro interno.
 */
app.get('/user-routines/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const routines = await Routine.findByUserId(userId);
        res.json(routines);
    } catch (error) {
        console.error('Erro ao buscar rotinas do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar rotinas do usuário' });
    }
});

/**
 * @swagger
 * /user-routine/{:userId}/{:routineId}?:
 *   get:
 *     tags:
 *       - Routine
 *     description: Retorna a rotina específica daquele usuário específico, baseada no id da rotina e no id do usuário.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Routine'
 *     responses:
 *       '200':
 *         description: Retorna a rotina desejada com base no id do usuário e da rotina fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       '404':
 *         description: Rotina não encontrada com base naquele id de usuário e id de rotina.
 *       '500':
 *         description: Erro ao buscar rotina no banco de dados, erro interno.
 */
app.get('/user-routine/:userId/:routineId?', async (req, res) => {
    try {
        const userId = req.params.userId;
        const routineId = req.params.routineId;

        let routine;

        if (routineId) {
            routine = await Routine.findByUserIdAndRoutineId(userId, routineId);
        } else {
            routine = await Routine.findByUserId(userId);
        }

        if (!routine) {
            return res.status(404).json({ error: 'Rotina não encontrada' });
        }

        const associatedExercises = await routine.getExercises();

        if (associatedExercises.length > 0) {
            const data = {
                routine: routine,
                exercises: associatedExercises
            };
            return res.json(data);
        }

        const routineFocus = routine.focus;
        const exercisesWithSameFocus = await Exercise.findAll(routineFocus);

        if (exercisesWithSameFocus.length > 0) {
            await routine.setExercises(exercisesWithSameFocus);
            const data = {
                routine: routine,
                exercises: exercisesWithSameFocus
            };
            return res.json(data);
        } else {
            console.log(`Não foram encontrados exercícios com foco em ${routineFocus}.`);
            return res.status(404).json({ error: `Não foram encontrados exercícios com foco em ${routineFocus}.` });
        }
    } catch (error) {
        console.error('Erro ao buscar rotina do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar rotina do usuário' });
    }
});

/**
 * @swagger
 * /user-routine/{:userId}/{:routineId}:
 *   delete:
 *     tags:
 *       - Routine
 *     description: Exclui uma rotina de treino de um usuário.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: ID do usuário.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: routineId
 *         description: ID da rotina de treino.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rotina de treino excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       404:
 *         description: Rotina de treino não encontrada.
 *       500:
 *         description: Erro interno do servidor ao excluir a rotina de treino.
 */
app.delete('/user-routine/:userId/:routineId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const routineId = req.params.routineId;

        const routine = await Routine.findByUserIdAndRoutineId(userId, routineId);
        if (!routine) {
            return res.status(404).json({ error: 'Treino não encontrado' });
        }

        await routine.destroy();

        res.json({ message: 'Treino excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir treino:', error);
        res.status(500).json({ error: 'Erro ao excluir treino' });
    }
});

/**
 * @swagger
 * /update-routine:
 *   put:
 *     tags:
 *       - Routine
 *     description: Atualiza uma rotina de treino existente.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Dados da rotina de treino a serem atualizados.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Routine'
 *     responses:
 *       200:
 *         description: Rotina de treino atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Rotina atualizada com sucesso!
 *       500:
 *         description: Erro interno do servidor ao atualizar a rotina de treino.
 */
app.put('/update-routine', async (req, res) => {
    try {
        const newRoutine = req.body;
        let routine = new Routine();

        newRoutine.routine = await routine.incrementCompletedCount(newRoutine.routine);

        await Routine.update(newRoutine);

        res.status(200).send('Rotina atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar a rotina:', error);
        res.status(500).send('Erro ao atualizar a rotina.');
    }
});


//DIETA
/**
 * @swagger
 * /create-diet:
 *   post:
 *     tags:
 *       - Diet
 *     description: Cria uma nova dieta.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: diet
 *         description: Dados da nova dieta a serem criados.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Diet'
 *     responses:
 *       200:
 *         description: Dieta cadastrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       500:
 *         description: Erro interno do servidor ao criar a dieta.
 */
app.post('/create-diet', async (req, res) => {
    const { name, focus, calories, userId} = req.body;

    try {
        const newDiet = new Diet(name, calories, focus);
        
        await Diet.create(newDiet, userId);

        return res.json({erro: false, mensagem: 'Dieta cadastrado com sucesso!!!'});
    } catch (error) {
        console.error('Erro ao criar o Dieta:', error);
        return res.status(500).json({ erro: true, mensagem: 'Erro ao criar Dieta...' });
    }
})

/**
 * @swagger
 * /user-diets/{:userId}:
 *   get:
 *     tags:
 *       - Diet
 *     description: Retorna as dietas pertencentes aquele usuário específico, baseado no id do usuário fornecido.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Diet'
 *     responses:
 *       '200':
 *         description: Retorna as dietas do usuário com base no id do usuário fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       '404':
 *         description: Dietas não encontradas com base naquele id de usuário.
 *       '500':
 *         description: Erro ao buscar dietas no banco de dados, erro interno.
 */
app.get('/user-diets/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const diets = await Diet.findByUserId(userId);
        res.json(diets);
    } catch (error) {
        console.error('Erro ao buscar dietas do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar dietas do usuário' });
    }
});

/**
 * @swagger
 * /user-diet/{:userId}/{:dietId}?:
 *   get:
 *     tags:
 *       - Diet
 *     description: Retorna a dieta específica daquele usuário específico, baseado no id do usuário e a id da dieta fornecido.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Diet'
 *     responses:
 *       '200':
 *         description: Retorna a dieta desejada com base no id do usuário e da dieta fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       '404':
 *         description: Dieta não encontrada com base naquele id de usuário e id de dieta.
 *       '500':
 *         description: Erro ao buscar dieta no banco de dados, erro interno.
 */
app.get('/user-diet/:userId/:dietId?', async (req, res) => {
    try {
        const userId = req.params.userId;
        const dietId = req.params.dietId;

        let diet;

        if (dietId) {
            diet = await Diet.findByUserIdAndDietId(userId, dietId);
        } else {
            diet = await Diet.findByUserId(userId);
        }

        if (!diet) {
            return res.status(404).json({ error: 'Dieta não encontrada' });
        }

        return res.json(diet);

    } catch (error) {
        console.error('Erro ao buscar dieta do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar dieta do usuário' });
    }
});

/**
 * @swagger
 * /user-diet/{:userId}/{:dietId}:
 *   delete:
 *     tags:
 *       - Diet
 *     description: Exclui uma dieta de um usuário.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: ID do usuário.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: dietId
 *         description: ID da dieta.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dieta excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       404:
 *         description: Dieta não encontrada.
 *       500:
 *         description: Erro interno do servidor ao excluir a dieta.
 */
app.delete('/user-diet/:userId/:dietId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const dietId = req.params.dietId;

        const diet = await Diet.findByUserIdAndDietId(userId, dietId);
        if (!diet) {
            return res.status(404).json({ error: 'Dieta não encontrado' });
        }

        await diet.destroy();

        res.json({ message: 'Dieta excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir dieta:', error);
        res.status(500).json({ error: 'Erro ao excluir dieta' });
    }
});

/**
 * @swagger
 * /update-diet:
 *   put:
 *     tags:
 *       - Diet
 *     description: Atualiza uma dieta existente.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: diet
 *         description: Dados da dieta a serem atualizados.
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Diet'
 *     responses:
 *       200:
 *         description: Dieta atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       500:
 *         description: Erro interno do servidor ao atualizar a dieta.
 */
app.put('/update-diet', async (req, res) => {
    try {
        const { id, userId, name, calories, focus, ingredientesSelecionados } = req.body;

        const updatedDiet = await Diet.update({ name, calories, focus }, id);

        await Promise.all(ingredientesSelecionados.map(async ingrediente => {
            const ingredienteEncontrado = mockDiets.find(item => item.nome === ingrediente.nome);
            let ingredientModel;

            const existingIngredient = await Ingredient.findOne(ingredienteEncontrado.nome);

            if (existingIngredient) {
                await Ingredient.update(existingIngredient.id, { calories: ingredienteEncontrado.calorias });
                ingredientModel = existingIngredient;
            } else {
                ingredientModel = await Ingredient.create({
                    name: ingredienteEncontrado.nome,
                    calories: ingredienteEncontrado.calorias,
                    userId: userId
                });
            }
            
            try {
                await DietIngredient.findOrCreate(id, ingredientModel.id);
            } catch (error) {
                console.error('Erro ao criar ou atualizar a entrada DietIngredient:', error);
            }
        }));
        
        res.status(200).json(updatedDiet);
    } catch (error) {
        console.error('Erro ao atualizar a dieta:', error);
        res.status(500).json({ error: 'Erro ao atualizar a dieta.' });
    }
});

/**
 * @swagger
 * /get-mockDiets/:
 *   get:
 *     tags:
 *       - Diet
 *     description: Retorna um array de ingredientes mock existente no servidor.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Retorna um array de ingredientes mock existente no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       '404':
 *         description: Array de ingredientes mock não encontrado.
 *       '500':
 *         description: Erro ao buscar array de ingredientes mock no servidor, erro interno.
 */
app.get('/get-mockDiets/', async (req, res) => {
    try {
        console.log(mockDiets);
        return res.json(mockDiets);
    } catch (error) {
        console.error('Erro ao buscar dietas do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar dietas do usuário' });
    }
});


/**
 * @swagger
 * /api/user-diet/{:dietaId}/ingredientes:
 *   get:
 *     tags:
 *       - Diet
 *     description: Retorna os ingredientes associados aquela dieta específica..
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Retorna os ingredientes associados aquela dieta específica, com base no id fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       '404':
 *         description: Ingredientes não encontrados para aquela dieta.
 *       '500':
 *         description: Erro ao buscar ingredientes data dieta, erro interno.
 */
app.get('/api/user-diet/:dietaId/ingredientes', async (req, res) => {
    try {
        const dietaId = req.params.dietaId;
        const ingredientesSelecionados = await DietIngredient.findByDietId(dietaId);
        res.json(ingredientesSelecionados);
    } catch (error) {
        console.error('Erro ao obter os ingredientes selecionados da dieta:', error);
        res.status(500).json({ error: 'Erro ao obter os ingredientes selecionados da dieta.' });
    }
});


/**
 * @swagger
 * /api/get-ingredient-details/{:id}:
 *   get:
 *     tags:
 *       - Diet
 *     description: Retorna o objeto do ingrediente desejado, com base no id fornecido.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Retorna o objeto do ingrediente, com base no id fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diet'
 *       '404':
 *         description: Objeto do ingrediente não encontrado para aquela dieta.
 *       '500':
 *         description: Erro ao buscar objeto do ingrediente, erro interno.
 */
app.get('/api/get-ingredient-details/:id', async (req, res) => {
    const ingredientId = req.params.id;
    try {
        const ingredient = await Ingredient.findOneById(ingredientId);
        res.json(ingredient);
    } catch (error) {
        console.error('Erro ao encontrar detalhes do ingrediente:', error);
        res.status(500).json({ error: 'Erro ao encontrar detalhes do ingrediente' });
    }
});

/**
 * @swagger
 * /dietIngredient/{:dietId}/{:ingredientName}:
 *   delete:
 *     tags:
 *       - DietIngredient
 *     description: Remove a relação entre uma dieta e um ingrediente.
 *     parameters:
 *       - in: path
 *         name: dietId
 *         description: ID da dieta.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: ingredientName
 *         description: Nome do ingrediente.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relação de ingrediente removida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Relação de ingrediente removida com sucesso.
 *       404:
 *         description: Ingrediente não encontrado.
 *       500:
 *         description: Erro interno do servidor ao remover a relação de ingrediente.
 */
app.delete('/dietIngredient/:dietId/:ingredientName', async (req, res) => {
    try {
        const dietId = req.params.dietId;
        const ingredientName = req.params.ingredientName;

        const ingredient = await Ingredient.findOne(ingredientName);

        if (!ingredient) {
            return res.status(404).json({ error: 'Ingrediente não encontrado.' });
        }

        const ingredientId = ingredient.id;

        const relation = await DietIngredient.findOrCreate(dietId, ingredientId);
        await relation.destroy();

        res.status(200).json({ message: 'Relação de ingrediente removida com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover a relação de ingrediente:', error);
        res.status(500).json({ error: 'Erro ao remover a relação de ingrediente.' });
    }
});

// CALCULADORA DE CALORIAS
/**
 * @swagger
 * /calculate-calories:
 *   post:
 *     tags:
 *       - CalorieCalculator
 *     description: Calcula métricas relacionadas à ingestão de calorias e hidratação com base nas informações fornecidas.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Dados para calcular as métricas.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             age:
 *               type: number
 *               description: Idade do usuário.
 *             height:
 *               type: number
 *               description: Altura do usuário em metros.
 *             weight:
 *               type: number
 *               description: Peso do usuário em quilogramas.
 *             activity:
 *               type: number
 *               description: Nível de atividade física do usuário (valor entre 1 e 1.9).
 *     responses:
 *       200:
 *         description: Métricas calculadas com sucesso.
 *       400:
 *         description: Erro de validação. Campos ausentes ou inválidos.
 */
app.post('/calculate-calories', (req, res) => {
    const response = [];
    const { age, height, weight, activity } = req.body;
    const heightCm = height * 100;

    const metabolismoMale = CalorieCalculator.calculateTMBMale(weight, heightCm, age);
    response.push({TMBMale: metabolismoMale});

    const metabolismoFem = CalorieCalculator.calculateTMBFemale(weight, heightCm, age);
    response.push({TMBFemale: metabolismoFem});

    const caloriesEmagrecimentoMale = CalorieCalculator.caloriesForWeightLoss(metabolismoMale, activity, 500);
    response.push({weightLossMale: caloriesEmagrecimentoMale});

    const caloriesEmagrecimentoFemale = CalorieCalculator.caloriesForWeightLoss(metabolismoFem, activity, 500);
    response.push({weightLossFemale: caloriesEmagrecimentoFemale});

    const caloriesGanharMassaMale = CalorieCalculator.caloriesForMuscleGain(metabolismoMale, activity, 300);
    response.push({massGainMale: caloriesGanharMassaMale});

    const caloriesGanharMassaFemale = CalorieCalculator.caloriesForMuscleGain(metabolismoFem, activity, 300);
    response.push({massGainFemale: caloriesGanharMassaFemale});

    const caloriesManutencaoMale = CalorieCalculator.caloriesForMaintance(metabolismoMale, activity);
    response.push({maintanceMale: caloriesManutencaoMale});

    const caloriesManutencaoFemale = CalorieCalculator.caloriesForMaintance(metabolismoFem, activity);
    response.push({maintanceFemale: caloriesManutencaoFemale});

    const imc = CalorieCalculator.calculateIMC(weight, heightCm);
    response.push({imc: imc});

    const waterIntake = WaterIntakeCalculator.calculateWaterIntake(weight);
    response.push({waterIntake: waterIntake});

    res.json(response);
});



/**
 * Verifica se existem exercícios no banco de dados. Se não houver, cria exercícios de exemplo.
 */
async function checkAndCreateExampleExercises() {
    try {
        const exercisesCount = await Exercise.count();

        if (exercisesCount === 0) {
            console.log('Não há exercícios no banco de dados. Criando exercícios de exemplo...');
            await createExampleExercises();
            console.log('Exercícios de exemplo criados com sucesso.');
        } else {
            console.log('Exercícios já existem no banco de dados. Nenhuma ação necessária.');
        }
    } catch (error) {
        console.error('Erro ao verificar e criar exercícios de exemplo:', error);
    }
}

/**
 * Cria exercícios de exemplo no banco de dados com base nos dados fornecidos.
 */
async function createExampleExercises() {
    const exampleExercises = mockExercises;
    try {
        for (const exerciseData of exampleExercises) {
            const newExercise = new Exercise(exerciseData.name, exerciseData.focus, exerciseData.rep, exerciseData.series, exerciseData.rest);
            await Exercise.create(newExercise);
        }
        console.log('Exercícios de exemplo criados com sucesso.');
    } catch (error) {
        console.error('Erro ao criar exercícios de exemplo:', error);
    }
}

/**
 * Inicializa a aplicação, verificando e criando exercícios de exemplo e iniciando o servidor.
 */
async function initializeApp() {
    try {
        await checkAndCreateExampleExercises();
        
        app.listen(3000, () => {
            console.log('Servidor iniciado na porta 3000    localhost:3000/');
        });
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
    }
}

initializeApp();