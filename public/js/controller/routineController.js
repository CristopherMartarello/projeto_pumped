console.log('####RoutineController');

/**
 * Recupera a string do objeto de usuário armazenado localmente no navegador.
 * @type {string}
 * @constant
 */
const userString = localStorage.getItem('user');

/**
 * Converte a string do objeto de usuário em um objeto JavaScript.
 * @type {Object}
 * @constant
 */
const user = JSON.parse(userString);


/**
 * Verifica se todos os checkboxes estão marcados.
 * Se todos estiverem marcados, habilita o botão de confirmação; caso contrário, desabilita o botão.
 * @param {NodeList} checkboxes - Lista de checkboxes a serem verificados.
 */
function verificarTodosMarcados(checkboxes) {
    let todosMarcados = true;
    checkboxes.forEach(checkbox => {
        if (!checkbox.classList.contains('checked')) {
            todosMarcados = false;
        }
    });
    
    const confirmButton = document.querySelector('.swal2-confirm');
    if (todosMarcados) {
        confirmButton.removeAttribute('disabled');
    } else {
        confirmButton.setAttribute('disabled', true);
    }
}

/**
 * Função para verificar quando o usuário entra em uma rotina.
 * Se a rotina ja estiver criada é exibido os exercícios em um modal, caso contrário, outro modal é aberto para o cadastro da rotina com um foco específico.
 * @param {boolean} boolean Verifica se a rotina está ou não criada.
 * @param {int} treinoId ID do treino.
 * @returns {Object} Objeto modal swal (sweetalert) que retorna uma mensagem de sucesso, caso a rotina tenha sido criada ou finalizada com sucesso, ou de erro caso ocorra um problema na requisição.
 * @method
 */
export const addOrEnterRoutine = async function (boolean, treinoId) {
    if (boolean) {
        try {
            const userId = user.id;
            let data = null;

            if (treinoId) {
                const loadingSwal = Swal.fire({
                    title: 'Carregando...',
                    allowOutsideClick: false, 
                    showConfirmButton: false, 
                    didOpen: () => {
                        Swal.showLoading(); 
                    }
                });
                const response = await fetch(`/user-routine/${userId}/${treinoId}`);

                if (response.ok) {
                    data = await response.json();
                    loadingSwal.close();
                } else {
                    console.error('Erro ao buscar rotina:', response.status);
                    return;
                }
            } else {
                const response = await fetch(`/user-routine/${userId}`);
                if (response.ok) {
                    data = await response.json();
                } else {
                    console.error('Erro ao buscar rotina:', response.status);
                    return;
                }
            }

            if (data) {
                Swal.showLoading();
                Swal.fire({
                    title: `<strong>${data.routine.name} - ${data.routine.focus}</strong>`,
                    iconHtml: `${
                        data.routine.focus === 'Pernas' ? '🦵' : '💪'
                    }`,
                    width: 800,
                    html: `
                    <div class="exercise-container">
                        <div class="exercise">1 - ${data.exercises[0].name}</div>
                        <div class="info">Rep: ${data.exercises[0].rep}</div>
                        <div class="info">Rest: ${data.exercises[0].rest}</div>
                        <div class="info">Series: ${data.exercises[0].series}</div>
                        <input type="checkbox" id="exercise1" class="exercise-checkbox">
                    </div>
                    <div class="exercise-container">
                        <div class="exercise">2 - ${data.exercises[1].name}</div>
                        <div class="info">Rep: ${data.exercises[1].rep}</div>
                        <div class="info">Rest: ${data.exercises[1].rest}</div>
                        <div class="info">Series: ${data.exercises[1].series}</div>
                        <input type="checkbox" id="exercise2" class="exercise-checkbox">
                    </div>
                    <div class="exercise-container">
                        <div class="exercise">3 - ${data.exercises[2].name}</div>
                        <div class="info">Rep: ${data.exercises[2].rep}</div>
                        <div class="info">Rest: ${data.exercises[2].rest}</div>
                        <div class="info">Series: ${data.exercises[2].series}</div>
                        <input type="checkbox" id="exercise3" class="exercise-checkbox">
                    </div>
                    <div class="exercise-container">
                        <div class="exercise">4 - ${data.exercises[3].name}</div>
                        <div class="info">Rep: ${data.exercises[3].rep}</div>
                        <div class="info">Rest: ${data.exercises[3].rest}</div>
                        <div class="info">Series: ${data.exercises[3].series}</div>
                        <input type="checkbox" id="exercise4" class="exercise-checkbox">
                    </div>
                    <div class="exercise-container">
                        <div class="exercise">5 - ${data.exercises[4].name}</div>
                        <div class="info">Rep: ${data.exercises[4].rep}</div>
                        <div class="info">Rest: ${data.exercises[4].rest}</div>
                        <div class="info">Series: ${data.exercises[4].series}</div>
                        <input type="checkbox" id="exercise5" class="exercise-checkbox">
                    </div>
                    `,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: `
                      <i class="fa fa-thumbs-up"></i> Finalizar treino
                    `,
                    confirmButtonAriaLabel: "Treino finalizado com sucesso!",
                    cancelButtonText: `
                      <i class="fa fa-thumbs-down"></i> Cancelar
                    `,
                    cancelButtonAriaLabel: "Cancelar",
                    didOpen: () => {
                        const checkboxes = document.querySelectorAll('.exercise-checkbox');
                        const confirmButton = document.querySelector('.swal2-confirm');
                        confirmButton.setAttribute('disabled', true);
                        checkboxes.forEach(checkbox => {
                            checkbox.addEventListener('click', () => {
                                checkbox.classList.toggle('checked'); 
                                verificarTodosMarcados(checkboxes); 
                            });
                        });
                    }
                }).then(result => {
                    if (result.isConfirmed) {
                        contabilizarTreino(data);
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao buscar rotina:', error);
        }
    } else {
        const { value: formValue } = await Swal.fire({
            title: "Cadastrar um novo treino",
            html: `
              <label for="swal-input-1">Nome do Treino</label>
              <input id="swal-input1" name="swal-input1" class="swal2-input">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return document.getElementById("swal-input1").value;
            }
        });

        if (formValue !== '') {
            const { value: focus } = await Swal.fire({
                title: "Qual o foco do seu treino?",
                input: "select",
                inputOptions: {
                    Superiores: {
                        Peito: "Peito",
                        Costas: "Costas",
                        Ombros: "Ombros",
                        Biceps: "Biceps",
                        Tríceps: "Tríceps"
                    },
                    Inferiores: {
                        Pernas: "Pernas"
                    },
                    Abdomen: {
                        Abdomen: "Abdomen"
                    }
                },
                inputPlaceholder: "Qual o foco do seu treino?",
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value !== '') {
                            resolve();
                        } else {
                            resolve("Você precisa selecionar um foco!");
                        }
                    });
                }
            });
            if (focus) {
                Swal.fire({
                    title: "Deseja criar o seu treino?",
                    html: `
                      ${formValue} - ${focus}
                    `,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Salvar",
                    denyButtonText: 'Descartar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        createRoutine(formValue, focus);
                    } else if (result.isDenied) {
                        Swal.fire("Treino cancelado!", "", "info");
                    }
                });
            }
        } else {
            Swal.fire({
                title: "Ocorreu um erro",
                text: "Você precisa escolher um nome para o seu treino para prosseguir...",
                icon: "error"
            });
        }
    }
}

/**
 * Exclui uma rotina criada pelo usuário.
 * @param {int} routineId - O ID da rotina a ser removida.
 */
const removeRoutine = async function(routineId) {
    const userId = user.id;
    Swal.fire({
        title: "Você tem certeza?",
        text: "Não será possível acessar novamente este treino!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/user-routine/${userId}/${routineId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const routineDiv = document.querySelector(`.routines[data-treino-id="${routineId}"]`);
                    if (routineDiv) {
                        routineDiv.remove();
                    }
                    const data = await response.json();
                    Swal.fire({
                        title: "Excluído!",
                        text: "O seu treino foi excluído com sucesso.",
                        icon: "success"
                    });
                    console.log(data.message);
                } else {
                    console.error('Erro ao excluir treino:', response.status);
                }
            } catch (error) {
                console.error('Erro ao excluir treino:', error);
            }
        }
    });
}

/**
 * Cria uma nova rotina para o usuário.
 * @param {string} name - O nome da nova rotina.
 * @param {string} focus - O grupo muscular atingido pela nova rotina de treino.
 */
const createRoutine = function (name, focus) {
    fetch('/create-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            focus: focus,
            userId: user.id
        })
    })
    .then(res => res.json())
    .then(data => {
        Swal.fire("Treino criado!", "", "success").then(function() {
            location.reload();
            window.location.href = 'home#userRoutine';
        });
    })
    .catch(error => {
        Swal.fire("Erro ao criar treino!", "", "error");
    });
}

/**
 * Atualiza a contabilização de uma rotina no servidor.
 * @param {object} routine - Um objeto contendo as informações atualizadas da rotina.
 */
async function contabilizarTreino(routine) {
    try {
        const response = await fetch('/update-routine', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(routine)
        });

        if (response.ok) {
            Swal.fire({
                title: 'Treino atualizado com sucesso!',
                icon: 'success'
            }).then((result) => {
                location.reload();
                window.location.href = 'home#userRoutine';
            });
        } else {
            Swal.fire('Erro ao atualizar o treino!', '', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar o treino:', error);
        Swal.fire('Erro ao atualizar o treino!', '', 'error');
    }
}

/**
 * Inicializa a aplicação atribuindo as funções `addOrEnterRoutine` e `removeRoutine` ao objeto `window`.
 * Essas funções são utilizadas para adicionar ou entrar em uma rotina e remover uma rotina, respectivamente.
 */
function init () {
    window.addOrEnterRoutine = addOrEnterRoutine;
    window.removeRoutine = removeRoutine;
}

init();
