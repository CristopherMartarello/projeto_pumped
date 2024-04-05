const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Pegando os dados dos Mocks
const mockExercises = require('./mock/mockExercises');
const mockDiets = require('./mock/mockDiets');

//Estabelecendo conexões com o banco de dados
const { User } = require('./public/models/User'); //a tabela só é criada caso não exista
const { Routine } = require('./public/models/Routine'); //a tabela só é criada caso não exista
const { Exercise } = require('./public/models/Exercise'); //a tabela só é criada caso não exista
const { Diet } = require('./public/models/Diet'); //a tabela só é criada caso não exista
const { DietIngredient } = require('./public/models/DietIngredient'); //a tabela só é criada caso não exista
const { Ingredient } = require('./public/models/Ingredient');//a tabela só é criada caso não exista
const CalorieCalculator = require('./public/models/CalorieCalculator');
const WaterIntakeCalculator = require('./public/models/WaterIntakeCalculator');

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

//USUÁRIO
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

        await Routine.update(newRoutine);

        res.status(200).send('Rotina atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar a rotina:', error);
        res.status(500).send('Erro ao atualizar a rotina.');
    }
});


//DIETA
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

app.put('/update-diet', async (req, res) => {
    try {
        const { id, userId, name, calories, focus, ingredientesSelecionados } = req.body;

        const updatedDiet = await Diet.update({ name, calories, focus }, id);

        await Promise.all(ingredientesSelecionados.map(async ingrediente => {
            const ingredienteEncontrado = mockDiets.find(item => item.nome === ingrediente);

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


app.get('/get-mockDiets/', async (req, res) => {
    try {
        console.log(mockDiets);
        return res.json(mockDiets);
    } catch (error) {
        console.error('Erro ao buscar dietas do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar dietas do usuário' });
    }
});


// Pegar os ingredientes associados a essa dieta
app.get('/api/dietas/:dietaId/ingredientes', async (req, res) => {
    try {
        const dietaId = req.params.dietaId;
        const ingredientesSelecionados = await DietIngredient.findByDietId(dietaId);
        res.json(ingredientesSelecionados);
    } catch (error) {
        console.error('Erro ao obter os ingredientes selecionados da dieta:', error);
        res.status(500).json({ error: 'Erro ao obter os ingredientes selecionados da dieta.' });
    }
});


// Pegar o objeto dos ingredientes
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

// CALCULADORA DE CALORIAS
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


// OUTRAS FUNÇÕES
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