const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Pegando os dados do Mock (exercicios)
const mock = require('./mock/mock');

//Estabelecendo conexões com o banco de dados
const { User } = require('./models/User'); //a tabela só é criada caso não exista
const { Routine } = require('./models/Routine'); //a tabela só é criada caso não exista
const { Exercise } = require('./models/Exercise'); //a tabela só é criada caso não exista

const app = express(); 

let initialPath = path.join(__dirname, "public"); //definindo a pasta public como o caminho inicial
app.use(bodyParser.json()); //definindo a maneira de como trocaremos os dados
app.use(express.static(initialPath)); //caminho inicial quando ligarmos o servidor

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(initialPath, "home.html"));
})

app.post('/register-user', async (req, res) => {
    console.log(req.body);
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.json({ erro: true, mensagem: 'Por favor, preencha todos os campos...' });
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

app.post('/update-user', async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, age, weight, height, birth, bio, id } = req.body;
    
    if (!name || !email || !age || !weight || !height || !birth || !bio) {
        return res.json({ erro: true, mensagem: 'Por favor, preencha todos os campos...' });
    }

    try {
        const newUser = new User(name, username, email, password, age, weight, height, birth, bio);
        //testar o get e set

        await User.update(newUser, id);

        return res.json({ erro: false, mensagem: 'Usuário atualizado com sucesso!!!' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({ erro: true, mensagem: 'Erro ao atualizar usuário...' });
    }
})

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

app.put('/update-routine', async (req, res) => {
    try {
        const newRoutine = req.body;
        let routine = new Routine();
        newRoutine.routine = await routine.incrementCompletedCount(newRoutine.routine);
        console.log('NOVA ROTINA', newRoutine.routine);
        await Routine.update(newRoutine);

        res.status(200).send('Rotina atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar a rotina:', error);
        res.status(500).send('Erro ao atualizar a rotina.');
    }
});

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

async function createExampleExercises() {
    const exampleExercises = mock;
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