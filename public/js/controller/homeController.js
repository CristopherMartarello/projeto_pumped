import { addOrEnterRoutine } from './routineController.js';
import { addOrEnterDiet } from './dietController.js';
const userString = localStorage.getItem('user');
const user = JSON.parse(userString);

console.log(user);

//Preenchendo os dados do usuário caso correspondam no DB
async function fillUserData() {
    for (var key in user) {
        if (user.hasOwnProperty(key)) {
            var inputElement = document.getElementById(key);
            if (inputElement) {
                inputElement.value = user[key];
            }
        }
    }
    var textAreaElement = document.getElementById('bio');
    textAreaElement.value = user.bio;

    //verificar se tem treino e criar os elementos
    fetch('/user-routines/' + user.id)
    .then(response => response.json())
    .then(treinos => {
        const panelUserWorkout = document.getElementById('userWorkout');
        if (treinos.length > 0) {
            treinos.forEach(treino => {
                // Criar a div do treino
                var divTreino = document.createElement('div');
                divTreino.classList.add('routines');
                divTreino.setAttribute('data-treino-id', treino.id);
                divTreino.addEventListener('click', () => addOrEnterRoutine(true, treino.id));

                //Adicionar o nome do treino
                var treinoName = document.createElement('span');
                treinoName.textContent = treino.name;
                divTreino.appendChild(treinoName);

                //Adicionando o focus do treino
                var treinoFocus = document.createElement('span');
                treinoFocus.textContent = treino.focus.toUpperCase();
                divTreino.appendChild(treinoFocus);

                // Adicionar o ícone de exclusão
                var icon = document.createElement('i');
                icon.classList.add('fas', 'fa-times', 'remove-icon');
                icon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    removeRoutine(treino.id);
                });

                //Adicionando o feedback do treino
                var treinoFeedback = document.createElement('span');
                treinoFeedback.classList.add('workout-feedback');
                treinoFeedback.textContent = treino.feedback ? treino.feedback + 'x' : '0x';
                divTreino.appendChild(treinoFeedback);

                divTreino.appendChild(icon);
                
                panelUserWorkout.appendChild(divTreino);
            });
        } else {
            console.log('Usuário não tem treinos associados.');
        }
        
    })

    // verificar se o usuário tem dietas associadas
    fetch('/user-diets/' + user.id)
    .then(response => response.json())
    .then(dietas => {
        const panelUserWorkout = document.getElementById('dietList');
        if (dietas.length > 0) {
            dietas.forEach(diet => {
                // Criar a div da dieta
                var divDiet = document.createElement('div');
                divDiet.classList.add('diets');
                divDiet.setAttribute('data-diet-id', diet.id);
                divDiet.addEventListener('click', () => addOrEnterDiet(true, diet.id));

                //Adicionar o nome da dieta
                var dietName = document.createElement('span');
                dietName.textContent = diet.name;
                divDiet.appendChild(dietName);

                //Adicionando o focus da dieta
                var dietFocus = document.createElement('span');
                dietFocus.textContent = diet.focus.toUpperCase();
                divDiet.appendChild(dietFocus);

                // Adicionar o ícone de exclusão
                var icon = document.createElement('i');
                icon.classList.add('fas', 'fa-times', 'remove-icon');
                icon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    removeDiet(diet.id);
                });

                //Adicionando o feedback do treino
                var dietCalories = document.createElement('span');
                dietCalories.classList.add('diet-calories');
                dietCalories.textContent = diet.calories > 0 ? diet.calories + 'kcal' : '0kcal';
                dietCalories.setAttribute('id', `diet-calories-${diet.name}`);
                divDiet.appendChild(dietCalories);

                divDiet.appendChild(icon);
                
                panelUserWorkout.appendChild(divDiet);
            });
        } else {
            console.log('Usuário não tem dietas associadas.');
        }
        
    })
    .catch(error => {
        console.error('Erro ao buscar dietas do usuário:', error);
    });

    await getUserById().then(function(foundedUser) {
        calculateAverageCalories(user.age, user.height, user.weight, foundedUser.activity);

        var genderSelect = document.getElementById('gender');
        genderSelect.value = foundedUser.gender;

        var activitySelect = document.getElementById('activity');
        activitySelect.value = foundedUser.activity;
    });
}

function getDataFromInputs() {
    var userData = {};
    var inputs = document.getElementsByTagName('input');
    var bio = document.getElementById('bio').value;
    var gender = document.getElementById('gender').value;
    var activity = document.getElementById('activity').value;

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var key = input.id; 

        
        if (key) {
            userData[key] = input.value;
        }
    }
    userData['bio'] = bio;
    userData['id'] = user.id;
    userData['username'] = user.username;
    userData['password'] = user.password;
    userData['gender'] = gender;
    userData['activity'] = activity;
    return userData;
}

const getUserById = async function() {
    try {
        const response = await fetch(`/get-user/${user.id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar usuário pelo ID');
        }
        const foundedUser = await response.json();
        return foundedUser;
    } catch (error) {
        console.error('Erro ao buscar usuário pelo ID:', error);
        throw error;
    }
}

const saveData = function () {
    var userData = getDataFromInputs();
    const {name, username, email, password, age, weight, id, height, birth, bio, gender, activity} = userData;
    const loadingSwal = Swal.fire({
        title: 'Carregando...',
        allowOutsideClick: false, 
        showConfirmButton: false, 
        didOpen: () => {
            Swal.showLoading(); 
        }
    });
    
    fetch('/update-user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            username: username,
            email: email, 
            password: password,
            age: age, 
            weight: weight,
            id: id, 
            height: height,
            birth: birth, 
            bio: bio,
            gender: gender,
            activity: activity
        })
    }).then(res => res.json())
        .then(data => {
            loadingSwal.close();
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(userData));
            Swal.fire("Dados atualizados!", "", "success").then(function() {
                location.reload();
                window.location.href = 'home#userData';
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

const fillAditionalInfo = function(data) {
    var imc = data[8].imc;
    var waterIntake = data[9].waterIntake;

    // Preenchendo informações adicionais do perfil
    var waterIntakeDiv = document.getElementById('water-intake-block');
    waterIntakeDiv.innerHTML = `
        <i class="fa fa-coffee" style="color: #000"></i> 
        <label style="color: #000">Água</label> 
        <span>${waterIntake.toFixed(0)}ml</span>`;

    var imcDiv = document.getElementById('imc-block');
    imcDiv.innerHTML = `
        <i class="fa fa-balance-scale" aria-hidden="true" style="color: #000"></i> 
        <label style="color: #000">IMC</label> 
        <span>${imc.toFixed(2)}</span>`;
}

const fillCaloriesParameters = function(data) {
    console.log(data);
    var TMBMale = data[0].TMBMale;
    var TMBFemale = data[1].TMBFemale;
    var weightLossMale = data[2].weightLossMale;
    var weightLossFemale = data[3].weightLossFemale;
    var massGainMale = data[4].massGainMale;
    var massGainFemale = data[5].massGainFemale;
    var maintanceMale = data[6].maintanceMale;
    var maintanceFemale = data[7].maintanceFemale;
    var imc = data[8].imc;
    var waterIntake = data[9].waterIntake;

    // Preenchendo informações calóricas do perfil da dieta
    var TMBMaleDiv = document.getElementById('tmb-male');
    TMBMaleDiv.innerHTML = `
        <i class="fa fa-mars" style="color: #000"></i> 
        <label style="color: #000">TMB</label> 
        <span>${TMBMale.toFixed(0)} kcal</span>`;

    var TMBFemaleDiv = document.getElementById('tmb-female');
    TMBFemaleDiv.innerHTML = `
        <i class="fa fa-venus" aria-hidden="true" style="color: #000"></i> 
        <label style="color: #000">TMB</label> 
        <span>${TMBFemale.toFixed(0)} kcal</span>`;

    var imcDiv = document.getElementById('calorie-for-imc');
    imcDiv.innerHTML = `
        <i class="fa fa-balance-scale" aria-hidden="true" style="color: #000"></i> 
        <label style="color: #000">IMC</label> 
        <span>${imc.toFixed(2)}</span>`;

    var imcDiv = document.getElementById('calorie-for-water');
    imcDiv.innerHTML = `
        <i class="fa fa-coffee" aria-hidden="true" style="color: #000"></i> 
        <label style="color: #000">Água</label> 
        <span>${waterIntake.toFixed(0)} ml</span>`;

    var WLMaleDiv = document.getElementById('calorie-for-weightloss-male');
    WLMaleDiv.innerHTML = `
        <i class="fa fa-mars" style="color: #000"></i> 
        <label style="color: #000">Emagrecimento</label> 
        <span>${weightLossMale.toFixed(0)} kcal</span>`;

    var WLFemaleDiv = document.getElementById('calorie-for-weightloss-female');
    WLFemaleDiv.innerHTML = `
        <i class="fa fa-venus" aria-hidden="true" style="color: #000"></i> 
        <label style="color: #000">Emagrecimento</label> 
        <span>${weightLossFemale.toFixed(0)} kcal</span>`;

    var MGMaleDiv = document.getElementById('calorie-for-massgain-male');
    MGMaleDiv.innerHTML = `
        <i class="fa fa-mars" style="color: #000"></i> 
        <label style="color: #000">Hipertrofia</label> 
        <span>${massGainMale.toFixed(0)} kcal</span>`;

    var MGFemaleDiv = document.getElementById('calorie-for-massgain-female');
    MGFemaleDiv.innerHTML = `
        <i class="fa fa-venus" aria-hidden="true" style="color: #000"></i> 
        <label style="color: #000">Hipertrofia</label> 
        <span>${massGainFemale.toFixed(0)} kcal</span>`;

    var MaintanceMaleDiv = document.getElementById('calorie-for-maintance-male');
    MaintanceMaleDiv.innerHTML = `
        <i class="fa fa-mars" style="color: #000"></i> 
        <label style="color: #000">Definição (manter)</label> 
        <span>${maintanceMale.toFixed(0)} kcal</span>`;

    var MaintanceFemaleDiv = document.getElementById('calorie-for-maintance-female');
    MaintanceFemaleDiv.innerHTML = `
        <i class="fa fa-venus" aria-hidden="true" style="color: #000"></i> 
        <label style="color: #000">Definição (manter)</label> 
        <span>${maintanceFemale.toFixed(0)} kcal</span>`;
}

const calculateAverageCalories = async function(age, height, weight, activity) {
    try {
        const response = await fetch('/calculate-calories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ age, height, weight, activity })
        });

        if (!response.ok) {
            throw new Error('Erro ao calcular calorias médias');
        }

        const data = await response.json();
        fillAditionalInfo(data);
        fillCaloriesParameters(data);
    } catch (error) {
        console.error('Erro ao calcular calorias médias:', error);
        throw error;
    }
}

function init () {
    fillUserData();
    window.saveData = saveData;
    window.addOrEnterRoutine = addOrEnterRoutine;
    window.calculateAverageCalories = calculateAverageCalories;
}

init();