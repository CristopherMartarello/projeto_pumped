const userString = localStorage.getItem('user');
const user = JSON.parse(userString);

/**
 * Array que armazena os ingredientes selecionados pelo usuário.
 * @type {Array}
 */
var ingredientesSelecionados = [];

/**
 * Mock de dados para dietas.
 * Este array armazena dados da dieta.
 * @type {Array}
 */
var mockDiets;

/**
 * Armazena o total de calorias calculadas.
 * Esta variável é utilizada para armazenar o total de calorias calculadas de uma operação.
 * @type {float}
 */
var totalCalorias = 0;

/**
 * Declara a string que irá conter a linguagem do usuário.
 * @type {string}
 * @let
 */
let mainLanguage = '';

/**
 * Função para verificar quando o usuário entra em uma dieta.
 * Se a dieta ja estiver criada é exibido os ingredientes em um modal carregado do mock para que o usuário selecione e monte a dieta com as calorias desejadas.
 * Caso contrário, outro modal é aberto para o cadastro da dieta, pedindo ao usuário que insira o nome e o foco da dieta.
 * @method
 * @param {boolean} boolean 
 * @param {int} dietId 
 * @returns {object} Objeto modal swal (sweetalert) que retorna uma mensagem de sucesso, caso a dieta tenha sido criada com sucesso, ou de erro caso ocorra um problema na requisição.
 */
export const addOrEnterDiet = async function (boolean, dietId) {
    if (boolean) {
        try {
            const userId = user.id;
            let data = null;

            if (dietId) {
                const loadingSwal = Swal.fire({
                    title: `${mainLanguage === 'pt-BR' ? 'Carregando...' : mainLanguage === 'en' ? 'Loading...' : mainLanguage === 'en-US' ? 'Loading...' : mainLanguage === 'es' ? 'Cargando...' : 'Carregando...'}`,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const response = await fetch(`/user-diet/${userId}/${dietId}`);

                if (response.ok) {
                    data = await response.json();
                    loadingSwal.close();
                } else {
                    console.error('Erro ao buscar dieta:', response.status);
                    return;
                }
            } else {
                const response = await fetch(`/user-diet/${userId}`);
                if (response.ok) {
                    data = await response.json();
                } else {
                    console.error('Erro ao buscar dieta:', response.status);
                    return;
                }
            }

            if (data) {
                getIngredients(data.id).then(async function (response) {
                    ingredientesSelecionados = [];

                    for (const ingredient of response) {
                        try {
                            const foundedIngredient = await getIngredientDetails(ingredient.ingredientId);
                            ingredientesSelecionados.push(foundedIngredient);
                        } catch (error) {
                            console.error('Erro ao encontrar detalhes do ingrediente:', error);
                        }
                    }

                    ingredientesSelecionados.forEach(function (ingredient) {
                        const checkbox = document.querySelector(`input[type="checkbox"][data-nome="${ingredient.nome}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                });

                try {
                    mockDiets = await fetch('/get-mockDiets/')
                        .then(response => response.json())
                        .then(data => data)
                        .catch(error => {
                            console.error('Erro ao buscar os dados:', error);
                        }
                        );

                } catch (error) {
                    console.error('Erro ao buscar os dados:', error);
                }

                const modalContent = document.createElement('div');

                // Contador de Calorias
                const ingredientContainer = document.createElement('div');
                ingredientContainer.classList.add('ingredient-container');

                const contadorDiv = document.createElement('div');
                contadorDiv.classList.add('info-diet');
                contadorDiv.textContent = `${mainLanguage === 'pt-BR' ? 'Total de calorias' : mainLanguage === 'en' ? 'Total calories' : mainLanguage === 'en-US' ? 'Total Calories' : mainLanguage === 'es' ? 'Total de calorías' : 'Total de calorias'}`;


                const amountDiv = document.createElement('div');
                amountDiv.classList.add('info-diet');
                amountDiv.setAttribute('id', 'total-calories');

                if (data.calories > 0) {
                    totalCalorias = data.calories;
                    amountDiv.textContent = `${data.calories}kcal`;
                } else {
                    amountDiv.textContent = `0kcal`;
                }

                ingredientContainer.appendChild(contadorDiv);
                ingredientContainer.appendChild(amountDiv);

                modalContent.appendChild(ingredientContainer);

                if (mockDiets) {
                    mockDiets.forEach((ingredient, index) => {
                        // Container
                        const ingredientContainer = document.createElement('div');
                        ingredientContainer.classList.add('ingredient-container');

                        // Nome
                        const nameLabel = document.createElement('div');
                        nameLabel.classList.add('info-diet-name');
                        nameLabel.textContent = `${index + 1} - ${ingredient.nome}`;

                        // Calorias
                        const caloriesDiv = document.createElement('div');
                        caloriesDiv.classList.add('info-diet');
                        caloriesDiv.textContent = `Calorias: ${ingredient.calorias}`;

                        // Gramas
                        const gramasDiv = document.createElement('div');
                        gramasDiv.classList.add('info-diet');
                        gramasDiv.textContent = `Gramas: ${ingredient.gramas}`;

                        // Checkbox
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = `ingredient-${ingredient.nome}`;
                        checkbox.classList.add('ingredient-checkbox');
                        checkbox.dataset.nome = ingredient.nome;

                        // Adicionando os elementos criados à div do ingrediente
                        ingredientContainer.appendChild(nameLabel);
                        ingredientContainer.appendChild(caloriesDiv);
                        ingredientContainer.appendChild(gramasDiv);
                        ingredientContainer.appendChild(checkbox);

                        // Adicionando a div do ingrediente ao conteúdo do modal
                        modalContent.appendChild(ingredientContainer);
                    });
                }

                Swal.showLoading();
                Swal.fire({
                    title: `<strong>${data.name} - ${data.focus}</strong>`,
                    iconHtml: `${data.focus === 'Emagrecer' ? '🥗' : '🍗'
                        }`,
                    width: 800,
                    html: modalContent,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: `${mainLanguage === 'pt-BR' ? '<i class="fa fa-thumbs-up"></i> Finalizar Dieta' : mainLanguage === 'en' ? '<i class="fa fa-thumbs-up"></i> Finish Diet' : mainLanguage === 'en-US' ? '<i class="fa fa-thumbs-up"></i> Finish Diet' : mainLanguage === 'es' ? '<i class="fa fa-thumbs-up"></i> Finalizar Dieta' : '<i class="fa fa-thumbs-up"></i> Finalizar Dieta'}`,
                    confirmButtonText: `${mainLanguage === 'pt-BR' ? '<i class="fa fa-thumbs-up"></i> Finalizar Dieta' : mainLanguage === 'en' ? '<i class="fa fa-thumbs-up"></i> Finish Diet' : mainLanguage === 'en-US' ? '<i class="fa fa-thumbs-up"></i> Finish Diet' : mainLanguage === 'es' ? '<i class="fa fa-thumbs-up"></i> Finalizar Dieta' : '<i class="fa fa-thumbs-up"></i> Finalizar Dieta'}`,
                    cancelButtonText: `${mainLanguage === 'pt-BR' ? '<i class="fa fa-thumbs-down"></i> Cancelar' : mainLanguage === 'en' ? '<i class="fa fa-thumbs-down"></i> Cancel' :  mainLanguage === 'en-US' ? '<i class="fa fa-thumbs-down"></i> Cancel' : mainLanguage === 'es' ? '<i class="fa fa-thumbs-down"></i> Cancelar' : '<i class="fa fa-thumbs-down"></i> Cancelar'}`,
                    cancelButtonAriaLabel: `${mainLanguage === 'pt-BR' ? 'Cancelar' : mainLanguage === 'en' ? 'Cancel' : mainLanguage === 'en-US' ? 'Cancel' : mainLanguage === 'es' ? 'Cancelar' : 'Cancelar'}`,
                    didOpen: () => {
                        const dietId = data.id;
                        const checkboxes = document.querySelectorAll('.ingredient-checkbox');

                        checkboxes.forEach(checkbox => {
                            checkbox.addEventListener('click', () => {
                                const ingrediente = checkbox.getAttribute('data-nome');
                                handleCheckboxClick(checkbox, ingrediente, dietId);
                                console.log('Ingredientes selecionados:', ingredientesSelecionados);
                            });
                        });
                    }
                }).then(result => {
                    if (result.isConfirmed) {
                        var diet = {
                            'id': data.id,
                            'userId': user.id,
                            'name': data.name,
                            'calories': totalCalorias,
                            'focus': data.focus,
                            'ingredientesSelecionados': ingredientesSelecionados
                        }
                        const loadingSwal = Swal.fire({
                            title: `${mainLanguage === 'pt-BR' ? 'Carregando...' : mainLanguage === 'en' ? 'Loading...' : mainLanguage === 'en-US' ? 'Loading...' : mainLanguage === 'es' ? 'Cargando...' : 'Carregando...'}`,
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        updateDiet(diet, loadingSwal);
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao buscar dieta:', error);
        }
    } else {
        const { value: formValue } = await Swal.fire({
            title: `${mainLanguage === 'pt-BR' ? 'Cadastrar uma nova dieta' : mainLanguage === 'en' ? 'Register a new diet' : mainLanguage === 'en-US' ? 'Register a new diet' : mainLanguage === 'es' ? 'Registrar una nueva dieta' : 'Cadastrar uma nova dieta'}`,
            html: `
                <label for="swal-input-1">${mainLanguage === 'pt-BR' ? 'Nome da Dieta' : mainLanguage === 'en' ? 'Diet Name' : mainLanguage === 'en-US' ? 'Diet Name' : mainLanguage === 'es' ? 'Nombre de la Dieta' : 'Nome da Dieta'}</label>
                <input id="swal-input1" name="swal-input1" class="swal2-input">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return document.getElementById("swal-input1").value;
            }
        });

        if (formValue !== '') {
            const { value: focus } = await Swal.fire({
                title: `${mainLanguage === 'pt-BR' ? 'Qual o foco da sua dieta?' : mainLanguage === 'en' ? 'What is the focus of your diet?' : mainLanguage === 'en-US' ? 'What is the focus of your diet?' : mainLanguage === 'es' ? '¿Cuál es el enfoque de tu dieta?' : 'Qual o foco da sua dieta?'}`,
                input: "select",
                inputOptions: {
                    Focos: {
                        Hipertrofia: `${mainLanguage === 'pt-BR' ? 'Hipertrofia' : mainLanguage === 'en' ? 'Hypertrophy' : mainLanguage === 'en-US' ? 'Hypertrophy' : mainLanguage === 'es' ? 'Hipertrofia' : 'Hipertrofia'}`,
                        Definição: `${mainLanguage === 'pt-BR' ? 'Definição' : mainLanguage === 'en' ? 'Definition' : mainLanguage === 'en-US' ? 'Definition' : mainLanguage === 'es' ? 'Definición' : 'Definição'}`,
                        Emagrecer: `${mainLanguage === 'pt-BR' ? 'Emagrecer' : mainLanguage === 'en' ? 'Weight Loss' : mainLanguage === 'en-US' ? 'Weight Loss' : mainLanguage === 'es' ? 'Perder Peso' : 'Emagrecer'}`,
                    }
                },
                inputPlaceholder: `${mainLanguage === 'pt-BR' ? 'Qual o foco da sua dieta?' : mainLanguage === 'en' ? 'What is the focus of your diet?' : mainLanguage === 'en-US' ? 'What is the focus of your diet?' : mainLanguage === 'es' ? '¿Cuál es el enfoque de tu dieta?' : 'Qual o foco da sua dieta?'}`,
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value !== '') {
                            resolve();
                        } else {
                            resolve(`${mainLanguage === 'pt-BR' ? 'Você precisa selecionar um foco!' : mainLanguage === 'en' ? 'You need to select a focus!' : mainLanguage === 'en-US' ? 'You need to select a focus!' : mainLanguage === 'es' ? '¡Necesitas seleccionar un enfoque!' : 'Você precisa selecionar um foco!'}`);
                        }
                    });
                }
            });

            if (focus) {
                Swal.fire({
                    title: `${mainLanguage === 'pt-BR' ? 'Deseja criar a sua dieta?' : mainLanguage === 'en' ? 'Do you want to create your diet?' : mainLanguage === 'en-US' ? 'Do you want to create your diet?' : mainLanguage === 'es' ? '¿Quieres crear tu dieta?' : 'Deseja criar a sua dieta?'}`,
                    html: `
                        ${formValue} - ${focus}
                    `,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: `${mainLanguage === 'pt-BR' ? 'Salvar' : mainLanguage === 'en' ? 'Save' : mainLanguage === 'en-US' ? 'Save' : mainLanguage === 'es' ? 'Guardar' : 'Salvar'}`,
                    denyButtonText: `${mainLanguage === 'pt-BR' ? 'Descartar' : mainLanguage === 'en' ? 'Discard' : mainLanguage === 'en-US' ? 'Discard' : mainLanguage === 'es' ? 'Descartar' : 'Descartar'}`,
                    cancelButtonText: `${mainLanguage === 'pt-BR' ? 'Cancelar' : mainLanguage === 'en' ? 'Cancel' : mainLanguage === 'en-US' ? 'Cancel' : mainLanguage === 'es' ? 'Cancelar' : 'Cancelar'}`
                }).then((result) => {
                    if (result.isConfirmed) {
                        createDiet(formValue, 0, focus);
                    } else if (result.isDenied) {
                        Swal.fire(`${mainLanguage === 'pt-BR' ? 'Dieta cancelada!' : mainLanguage === 'en' ? 'Diet canceled!' : mainLanguage === 'en-US' ? 'Diet canceled!' : mainLanguage === 'es' ? 'Dieta cancelada!' : 'Dieta cancelada!'}`, "", "info");
                    }
                });
            }
        } else {
            Swal.fire({
                title: `${mainLanguage === 'pt-BR' ? 'Ocorreu um erro' : mainLanguage === 'en' ? 'An error occurred' : mainLanguage === 'en-US' ? 'An error occurred' : mainLanguage === 'es' ? 'Se ha producido un error' : 'Ocorreu um erro'}`,
                text: `${mainLanguage === 'pt-BR' ? 'Você precisa escolher um nome para a sua dieta para prosseguir...' : mainLanguage === 'en' ? 'You need to choose a name for your diet to proceed...' : mainLanguage === 'en-US' ? 'You need to choose a name for your diet to proceed...' : mainLanguage === 'es' ? 'Debes elegir un nombre para tu dieta para continuar...' : 'Você precisa escolher um nome para a sua dieta para prosseguir...'}`,
                icon: "error"
            });
        }
    }
}

/**
 * Envia uma requisição para criar uma nova dieta no servidor.
 * @param {string} name - O nome da dieta a ser criada.
 * @param {float} calories - O número total de calorias da dieta.
 * @param {string} focus - O foco da dieta (por exemplo, 'perda de peso', etc.).
 * @throws {Error} Se ocorrer um erro durante a criação da dieta no servidor.
 */
const createDiet = function (name, calories, focus) {
    fetch('/create-diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            calories: calories,
            focus: focus,
            userId: user.id
        })
    })
        .then(res => res.json())
        .then(data => {
            const currentLanguage = new URLSearchParams(window.location.search).get('lang');
            const redirectUrl = `http://localhost:3000/home?lang=${currentLanguage || mainLanguage}#userDiet`;

            Swal.fire(`${mainLanguage === 'pt-BR' ? 'Dieta criada!' : mainLanguage === 'en' ? 'Diet created!' : mainLanguage === 'en-US' ? 'Diet created!' : mainLanguage === 'es' ? 'Dieta creada!' : 'Dieta criada!'}`, "", "success").then(function () {
                location.reload();
                location.href = redirectUrl;
            });
        })
        .catch(error => {
            Swal.fire(`${mainLanguage === 'pt-BR' ? 'Erro ao criar dieta!' : mainLanguage === 'en' ? 'Error creating diet!' : mainLanguage === 'en-US' ? 'Error creating diet!' : mainLanguage === 'es' ? 'Error al crear dieta!' : 'Erro ao criar dieta!'}`, "", "error");
        });
}

/**
 * Envia uma requisição para excluir uma dieta existente do usuário.
 * @param {int} dietId - O ID da dieta a ser excluída.
 */
const removeDiet = async function (dietId) {
    const userId = user.id;
    Swal.fire({
        title: `${mainLanguage === 'pt-BR' ? 'Você tem certeza?' : mainLanguage === 'en' ? 'Are you sure?' : mainLanguage === 'en-US' ? 'Are you sure?' : mainLanguage === 'es' ? '¿Estás seguro?' : 'Você tem certeza?'}`,
        text: `${mainLanguage === 'pt-BR' ? 'Não será possível acessar novamente esta Dieta!' : mainLanguage === 'en' ? 'You will not be able to access this Diet again!' : mainLanguage === 'en-US' ? 'You will not be able to access this Diet again!' : mainLanguage === 'es' ? '¡No podrás acceder a esta Dieta nuevamente!' : 'Não será possível acessar novamente esta Dieta!'}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `${mainLanguage === 'pt-BR' ? 'Sim, excluir!' : mainLanguage === 'en' ? 'Yes, delete!' : mainLanguage === 'en-US' ? 'Yes, delete!' : mainLanguage === 'es' ? '¡Sí, eliminar!' : 'Sim, excluir!'}`,
        cancelButtonText: `${mainLanguage === 'pt-BR' ? 'Cancelar' : mainLanguage === 'en' ? 'Cancel' : mainLanguage === 'en-US' ? 'Cancel' : mainLanguage === 'es' ? 'Cancelar' : 'Cancelar'}`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/user-diet/${userId}/${dietId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const dietDiv = document.querySelector(`.diets[data-diet-id="${dietId}"]`);
                    if (dietDiv) {
                        dietDiv.remove();
                    }
                    const data = await response.json();
                    Swal.fire({
                        title: `${mainLanguage === 'pt-BR' ? 'Excluído!' : mainLanguage === 'en' ? 'Deleted!' : mainLanguage === 'en-US' ? 'Deleted!' : mainLanguage === 'es' ? '¡Eliminado!' : 'Excluído!'}`,
                        text: `${mainLanguage === 'pt-BR' ? 'A sua dieta foi excluída com sucesso.' : mainLanguage === 'en' ? 'Your diet has been successfully deleted.' : mainLanguage === 'en-US' ? 'Your diet has been successfully deleted.' : mainLanguage === 'es' ? 'Tu dieta ha sido eliminada con éxito.' : 'A sua dieta foi excluída com sucesso.'}`,
                        icon: "success"
                    })
                    console.log(data.message);
                } else {
                    console.error('Erro ao excluir dieta:', response.status);
                }
            } catch (error) {
                console.error('Erro ao excluir dieta:', error);
            }
        }
    });
}

/**
 * Envia uma requisição para atualizar uma dieta existente.
 * @param {object} diet - O objeto contendo os detalhes da dieta a ser atualizada.
 * @param {object} loadingSwal - O objeto Swal usado para exibir um indicador de carregamento durante a atualização da dieta.
 */
const updateDiet = async function (diet, loadingSwal) {
    try {
        const response = await fetch('/update-diet', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diet)
        });

        if (response.ok) {
            loadingSwal.close();
            Swal.fire(`${mainLanguage === 'pt-BR' ? 'Dieta atualizada com sucesso!' : mainLanguage === 'en' ? 'Diet updated successfully!' : mainLanguage === 'en-US' ? 'Diet updated successfully!' : mainLanguage === 'es' ? '¡Dieta actualizada con éxito!' : 'Dieta atualizada com sucesso!'}`, '', 'success').then(function () {
                document.getElementById(`diet-calories-${diet.name}`).textContent = `${diet.calories}kcal`;
                location.reload();
                window.location.href = 'home#Diet';
            });
        } else {
            Swal.fire(`${mainLanguage === 'pt-BR' ? 'Erro ao atualizar a dieta!' : mainLanguage === 'en' ? 'Error updating diet!' : mainLanguage === 'en-US' ? 'Error updating diet!' : mainLanguage === 'es' ? 'Error al actualizar la dieta!' : 'Erro ao atualizar a dieta!'}`, '', 'error');
        }
    } catch (error) {
        Swal.fire(`${mainLanguage === 'pt-BR' ? 'Erro ao atualizar a dieta!' : mainLanguage === 'en' ? 'Error updating diet!' : mainLanguage === 'en-US' ? 'Error updating diet!' : mainLanguage === 'es' ? 'Error al actualizar la dieta!' : 'Erro ao atualizar a dieta!'}`, '', 'error');
    }
}

/**
 * Obtém os ingredientes selecionados de uma dieta específica.
 * @param {int} dietaId - O ID da dieta da qual os ingredientes serão obtidos.
 * @returns {Promise<Array>} - Uma Promise que resolve para um array contendo os ingredientes selecionados da dieta.
 * @throws {Error} - Lança um erro se houver um problema ao obter os ingredientes selecionados da dieta.
 */
async function getIngredients(dietaId) {
    try {
        const response = await fetch(`/api/user-diet/${dietaId}/ingredientes`);
        if (!response.ok) {
            throw new Error('Erro ao obter os ingredientes selecionados da dieta');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

/**
 * Obtém os detalhes de um ingrediente com base em seu ID vindo da tabela relação.
 * @param {int} ingredientId - O ID do ingrediente do qual os detalhes serão obtidos.
 * @returns {Promise<Object>} - Uma Promise que resolve para um objeto contendo os detalhes do ingrediente.
 * @throws {Error} - Lança um erro se houver um problema ao obter os detalhes do ingrediente.
 */
async function getIngredientDetails(ingredientId) {
    try {
        const response = await fetch(`/api/get-ingredient-details/${ingredientId}`);
        if (!response.ok) {
            throw new Error('Erro ao obter os detalhes do ingrediente');
        }
        const ingredient = await response.json();
        return ingredient;
    } catch (error) {
        console.error('Erro ao obter os detalhes do ingrediente:', error);
        throw error;
    }
}

/**
 * Adiciona um ingrediente à lista de ingredientes selecionados e atualiza o total de calorias.
 * @param {string} ingrediente - O nome do ingrediente a ser adicionado.
 * @param {int} dietId - O ID da dieta à qual o ingrediente será adicionado.
 */
function adicionarIngrediente(ingrediente, dietId) {
    const ingredienteAchado = mockDiets.find(item => item.nome === ingrediente);

    if (ingredienteAchado) {
        ingredientesSelecionados.push(ingredienteAchado);
        totalCalorias += ingredienteAchado.calorias;
        const amountDiv = document.getElementById('total-calories');
        amountDiv.textContent = `${totalCalorias} kcal`;
    }
}

/**
 * Remove um ingrediente da lista de ingredientes selecionados.
 * @param {string} ingrediente - O nome do ingrediente a ser removido.
 * @param {int} dietId - O ID da dieta à qual o ingrediente está associado.
 */
function removerIngrediente(ingrediente, dietId) {
    const ingredienteAchado = mockDiets.find(item => item.nome === ingrediente);
    if (ingredienteAchado !== undefined) {
        const indice = ingredientesSelecionados.findIndex(item => item.nome === ingredienteAchado.nome);
        console.log(indice);

        if (indice !== -1) {
            ingredientesSelecionados.splice(indice, 1);
            totalCalorias -= ingredienteAchado.calorias;
            console.log(ingredienteAchado);

            fetch(`/dietIngredient/${dietId}/${ingredienteAchado.nome}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao remover a relação de ingrediente.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data.message);
                })
                .catch(error => {
                    console.error('Erro ao remover a relação de ingrediente:', error);
                });

            const amountDiv = document.getElementById('total-calories');
            amountDiv.textContent = `${totalCalorias} kcal`;
        }
    }
}

/**
 * Função para lidar com o clique em uma checkbox de ingrediente.
 * Se a checkbox estiver marcada, adiciona o ingrediente à lista de ingredientes selecionados.
 * Se a checkbox estiver desmarcada, remove o ingrediente da lista de ingredientes selecionados.
 * @param {HTMLInputElement} checkbox - A checkbox do ingrediente.
 * @param {string} ingrediente - O nome do ingrediente associado à checkbox.
 * @param {int} dietId - O ID da dieta à qual o ingrediente está associado.
 */
function handleCheckboxClick(checkbox, ingrediente, dietId) {
    if (checkbox.checked) {
        adicionarIngrediente(ingrediente, dietId);
    } else {
        removerIngrediente(ingrediente, dietId);
    }
}

function init() {
    window.addOrEnterDiet = addOrEnterDiet;
    window.removeDiet = removeDiet;
    window.updateDiet = updateDiet;
    mainLanguage = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language;
}

init();