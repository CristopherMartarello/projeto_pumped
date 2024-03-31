import { addOrEnterRoutine } from './routineController.js';
const userString = localStorage.getItem('user');
const user = JSON.parse(userString);

console.log(user);

//Preenchendo os dados do usuário caso correspondam no DB
function fillUserData() {
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
    .catch(error => {
        console.error('Erro ao buscar treinos do usuário:', error);
    });
}

function getDataFromInputs() {
    var userData = {};
    var inputs = document.getElementsByTagName('input');
    var bio = document.getElementById('bio').value;

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
    return userData;
}

const saveData = function () {
    var userData = getDataFromInputs();
    const {name, username, email, password, age, weight, id, height, birth, bio} = userData;
    console.log('Dados dos inputs:', userData);
    
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
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('Novo usuário:', data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}



function init () {
    fillUserData();
    window.saveData = saveData;
    window.addOrEnterRoutine = addOrEnterRoutine;
    window.removeRoutine = removeRoutine;
}

init();