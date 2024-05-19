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
 * Declara a string que irá conter a linguagem do usuário.
 * @type {string}
 * @let
 */
let mainLanguage = '';


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
                    title: mainLanguage === 'pt-BR' ? 'Carregando...' : mainLanguage === 'en' ? 'Loading...' : mainLanguage === 'en-US' ? 'Loading...' : mainLanguage === 'es' ? 'Cargando...' : 'Carregando...',
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
                    iconHtml: `${data.routine.focus === 'Pernas' ? '🦵' : '💪'
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
                    <i class="fa fa-thumbs-up"></i> ${mainLanguage === 'pt-BR' ? 'Finalizar treino' : mainLanguage === 'en' ? 'Finish Workout' : mainLanguage === 'en-US' ? 'Finish Workout' : mainLanguage === 'es' ? 'Terminar el entrenamiento' : 'Finalizar treino'}
                     `,
                    confirmButtonAriaLabel: mainLanguage === 'pt-BR' ? 'Treino finalizado com sucesso!' : mainLanguage === 'en' ? 'Workout finished successfully!' : mainLanguage === 'en-US' ? 'Workout finished successfully!' : mainLanguage === 'es' ? 'Entrenamiento terminado con éxito!' : 'Treino finalizado com sucesso!',
                    cancelButtonText: `
                     <i class="fa fa-thumbs-down"></i> ${mainLanguage === 'pt-BR' ? 'Cancelar' : mainLanguage === 'en' ? 'Cancel' : mainLanguage === 'en-US' ? 'Cancel' : mainLanguage === 'es' ? 'Cancelar' : 'Cancelar'}
                     `,
                    cancelButtonAriaLabel: mainLanguage === 'pt-BR' ? 'Cancelar' : mainLanguage === 'en' ? 'Cancel' : mainLanguage === 'en-US' ? 'Cancel' : mainLanguage === 'es' ? 'Cancelar' : 'Cancelar',
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
            title: `${mainLanguage === 'pt-BR' ? 'Cadastrar um novo treino' : mainLanguage === 'en' ? 'Register a new workout' : mainLanguage === 'en-US' ? 'Register a new workout' : mainLanguage === 'es' ? 'Registrar un nuevo entrenamiento' : 'Cadastrar um novo treino'}`,
            html: `
                ${mainLanguage === 'pt-BR' ? '<label for="swal-input1">Nome do Treino</label>' : mainLanguage === 'en' ? '<label for="swal-input1">Workout Name</label>' : mainLanguage === 'en-US' ? '<label for="swal-input1">Workout Name</label>' : mainLanguage === 'es' ? '<label for="swal-input1">Nombre del Entrenamiento</label>' : '<label for="swal-input1">Nome do Treino</label>'}
                <input id="swal-input1" name="swal-input1" class="swal2-input">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return document.getElementById("swal-input1").value;
            }
        });

        if (formValue !== '') {
            const { value: focus } = await Swal.fire({
                title: `${mainLanguage === 'pt-BR' ? 'Qual o foco do seu treino?' : mainLanguage === 'en' ? 'What is the focus of your workout?' : mainLanguage === 'en-US' ? 'What is the focus of your workout?' : mainLanguage === 'es' ? '¿Cuál es el foco de tu entrenamiento?' : 'Qual o foco do seu treino?'}`,
                input: "select",
                inputOptions: {
                    Superiores: {
                        Peito: `${mainLanguage === 'pt-BR' ? 'Peito' : mainLanguage === 'en' ? 'Chest' : mainLanguage === 'en-US' ? 'Chest' : mainLanguage === 'es' ? 'Pecho' : 'Peito'}`,
                        Costas: `${mainLanguage === 'pt-BR' ? 'Costas' : mainLanguage === 'en' ? 'Back' : mainLanguage === 'en-US' ? 'Back' : mainLanguage === 'es' ? 'Espalda' : 'Costas'}`,
                        Ombros: `${mainLanguage === 'pt-BR' ? 'Ombros' : mainLanguage === 'en' ? 'Shoulders' : mainLanguage === 'en-US' ? 'Shoulders' : mainLanguage === 'es' ? 'Hombros' : 'Ombros'}`,
                        Biceps: `${mainLanguage === 'pt-BR' ? 'Biceps' : mainLanguage === 'en' ? 'Biceps' : mainLanguage === 'en-US' ? 'Biceps' : mainLanguage === 'es' ? 'Bíceps' : 'Biceps'}`,
                        Tríceps: `${mainLanguage === 'pt-BR' ? 'Tríceps' : mainLanguage === 'en' ? 'Triceps' : mainLanguage === 'en-US' ? 'Triceps' : mainLanguage === 'es' ? 'Tríceps' : 'Tríceps'}`
                    },
                    Inferiores: {
                        Pernas: `${mainLanguage === 'pt-BR' ? 'Pernas' : mainLanguage === 'en' ? 'Legs' : mainLanguage === 'en-US' ? 'Legs' : mainLanguage === 'es' ? 'Piernas' : 'Pernas'}`
                    },
                    Abdomen: {
                        Abdomen: `${mainLanguage === 'pt-BR' ? 'Abdomen' : mainLanguage === 'en' ? 'Abs' : mainLanguage === 'en-US' ? 'Abs' : mainLanguage === 'es' ? 'Abdomen' : 'Abdomen'}`
                    }
                },
                inputPlaceholder: `${mainLanguage === 'pt-BR' ? 'Qual o foco do seu treino?' : mainLanguage === 'en' ? 'What is the focus of your workout?' : mainLanguage === 'en-US' ? 'What is the focus of your workout?' : mainLanguage === 'es' ? '¿Cuál es el foco de tu entrenamiento?' : 'Qual o foco do seu treino?'}`,
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value !== '') {
                            resolve();
                        } else {
                            resolve(`${mainLanguage === 'pt-BR' ? 'Você precisa selecionar um foco!' : mainLanguage === 'en' ? 'You need to select a focus!' : mainLanguage === 'en-US' ? 'You need to select a focus!' : mainLanguage === 'es' ? '¡Necesitas seleccionar un foco!' : 'Você precisa selecionar um foco!'}`);
                        }
                    });
                }
            });
            if (focus) {
                Swal.fire({
                    title: `${mainLanguage === 'pt-BR' ? 'Deseja criar o seu treino?' : mainLanguage === 'en' ? 'Do you want to create your workout?' : mainLanguage === 'en-US' ? 'Do you want to create your workout?' : mainLanguage === 'es' ? '¿Deseas crear tu entrenamiento?' : 'Deseja criar o seu treino?'}`,
                    html: `
                        ${formValue} - ${focus}
                    `,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: `${mainLanguage === 'pt-BR' ? 'Salvar' : mainLanguage === 'en' ? 'Save' : mainLanguage === 'en-US' ? 'Save' : mainLanguage === 'es' ? 'Guardar' : 'Salvar'}`,
                    denyButtonText: `${mainLanguage === 'pt-BR' ? 'Descartar' : mainLanguage === 'en' ? 'Discard' : mainLanguage === 'en-US' ? 'Discard' : mainLanguage === 'es' ? 'Descartar' : 'Descartar'}`,
                    cancelButtonText: `${mainLanguage === 'pt-BR' ? 'Cancelar' : mainLanguage === 'en' ? 'Cancel' : mainLanguage === 'en-US' ? 'Cancel': mainLanguage === 'es' ? 'Cancelar' : 'Cancelar'}`
                }).then((result) => {
                    if (result.isConfirmed) {
                        createRoutine(formValue, focus);
                    } else if (result.isDenied) {
                        Swal.fire(`${mainLanguage === 'pt-BR' ? 'Treino cancelado!' : mainLanguage === 'en' ? 'Workout cancelled!' : mainLanguage === 'en-US' ? 'Workout cancelled!' : mainLanguage === 'es' ? 'Entrenamiento cancelado!' : 'Treino cancelado!'}`, "", "info");
                    }
                });
            }
        } else {
            Swal.fire({
                title: `${mainLanguage === 'pt-BR' ? 'Ocorreu um erro' : mainLanguage === 'en' ? 'An error occurred' : mainLanguage === 'en-US' ? 'An error occurred' : mainLanguage === 'es' ? 'Ha ocurrido un error' : 'Ocorreu um erro'}`,
                text: `${mainLanguage === 'pt-BR' ? 'Você precisa escolher um nome para o seu treino para prosseguir...' : mainLanguage === 'en' ? 'You need to choose a name for your workout to proceed...' : mainLanguage === 'en-US' ? 'You need to choose a name for your workout to proceed...' : mainLanguage === 'es' ? 'Necesitas elegir un nombre para tu entrenamiento para continuar...' : 'Você precisa escolher um nome para o seu treino para prosseguir...'}`,
                icon: "error"
            });
        }
    }
}

/**
 * Exclui uma rotina criada pelo usuário.
 * @param {int} routineId - O ID da rotina a ser removida.
 */
const removeRoutine = async function (routineId) {
    const userId = user.id;
    Swal.fire({
        title: `${mainLanguage === 'pt-BR' ? 'Você tem certeza?' : mainLanguage === 'en' ? 'Are you sure?' : mainLanguage === 'en-US' ? 'Are you sure?' : mainLanguage === 'es' ? '¿Estás seguro?' : 'Você tem certeza?'}`,
        text: `${mainLanguage === 'pt-BR' ? 'Não será possível acessar novamente este treino!' : mainLanguage === 'en' ? 'You will not be able to access this workout again!' : mainLanguage === 'en-US' ? 'You will not be able to access this workout again!' : mainLanguage === 'es' ? '¡No podrás acceder a este entrenamiento nuevamente!' : 'Não será possível acessar novamente este treino!'}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `${mainLanguage === 'pt-BR' ? 'Sim, excluir!' : mainLanguage === 'en' ? 'Yes, delete it!' : mainLanguage === 'en-US' ? 'Yes, delete it!' : mainLanguage === 'es' ? '¡Sí, eliminar!' : 'Sim, excluir!'}`,
        cancelButtonText: `${mainLanguage === 'pt-BR' ? 'Cancelar' : mainLanguage === 'en' ? 'Cancel' : mainLanguage === 'en-US' ? 'Cancel' : mainLanguage === 'es' ? 'Cancelar' : 'Cancelar'}`
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
                        title: `${mainLanguage === 'pt-BR' ? 'Excluído!' : mainLanguage === 'en' ? 'Deleted!' : mainLanguage === 'en-US' ? 'Deleted!' : mainLanguage === 'es' ? '¡Eliminado!' : 'Excluído!'}`,
                        text: `${mainLanguage === 'pt-BR' ? 'O seu treino foi excluído com sucesso.' : mainLanguage === 'en' ? 'Your workout has been successfully deleted.' : mainLanguage === 'en-US' ? 'Your workout has been successfully deleted.' : mainLanguage === 'es' ? 'Tu entrenamiento ha sido eliminado con éxito.' : 'O seu treino foi excluído com sucesso.'}`,
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
            const currentLanguage = new URLSearchParams(window.location.search).get('lang');
            const redirectUrl = `http://localhost:3000/home?lang=${currentLanguage || mainLanguage}#userRoutine`;

            Swal.fire(`${mainLanguage === 'pt-BR' ? 'Treino criado!' : mainLanguage === 'en' ? 'Workout created!' : mainLanguage === 'en-US' ? 'Workout created!' : mainLanguage === 'es' ? 'Entrenamiento creado!' : 'Treino criado!'}`, "", "success").then(function () {
                location.reload();
                location.href = redirectUrl;
            });
        })
        .catch(error => {
            Swal.fire(
                `${mainLanguage === 'pt-BR' ? 'Erro ao criar treino!' : mainLanguage === 'en' ? 'Error creating workout!' : mainLanguage === 'en-US' ? 'Error creating workout!' : mainLanguage === 'es' ? '¡Error al crear el entrenamiento!' : 'Erro ao criar treino!'}`,
                "",
                "error"
            );
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
                title: `${mainLanguage === 'pt-BR' ? 'Treino atualizado com sucesso!' : mainLanguage === 'en' ? 'Workout updated successfully!' : mainLanguage === 'en-US' ? 'Workout updated successfully!' : mainLanguage === 'es' ? '¡Entrenamiento actualizado con éxito!' : 'Treino atualizado com sucesso!'}`,
                icon: 'success'
            }).then((result) => {
                location.reload();
                window.location.href = 'home#userRoutine';
            });
        } else {
            Swal.fire(
                `${mainLanguage === 'pt-BR' ? 'Erro ao atualizar o treino!' : mainLanguage === 'en' ? 'Error updating workout!' : mainLanguage === 'en-US' ? 'Error updating workout!' : mainLanguage === 'es' ? '¡Error al actualizar el entrenamiento!' : 'Erro ao atualizar o treino!'}`,
                '',
                'error'
            );
        }
    } catch (error) {
        console.error('Erro ao atualizar o treino:', error);
        Swal.fire(
            `${mainLanguage === 'pt-BR' ? 'Erro ao atualizar o treino!' : mainLanguage === 'en' ? 'Error updating workout!' : mainLanguage === 'en-US' ? 'Error updating workout!' : mainLanguage === 'es' ? '¡Error al actualizar el entrenamiento!' : 'Erro ao atualizar o treino!'}`,
            '',
            'error'
        );
    }
}

/**
 * Inicializa a aplicação atribuindo as funções `addOrEnterRoutine` e `removeRoutine` ao objeto `window`.
 * Essas funções são utilizadas para adicionar ou entrar em uma rotina e remover uma rotina, respectivamente.
 */
function init() {
    window.addOrEnterRoutine = addOrEnterRoutine;
    window.removeRoutine = removeRoutine;
    mainLanguage = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language;
}

init();
