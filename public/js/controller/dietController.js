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
                    title: 'Carregando...',
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
                contadorDiv.textContent = `Total de calorias`;

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
                    iconHtml: `${
                        data.focus === 'Emagrecer' ? '🥗' : '🍗'
                    }`,
                    width: 800,
                    html: modalContent,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: `
                      <i class="fa fa-thumbs-up"></i> Finalizar Dieta
                    `,
                    confirmButtonAriaLabel: "Dieta finalizada com sucesso!",
                    cancelButtonText: `
                      <i class="fa fa-thumbs-down"></i> Cancelar
                    `,
                    cancelButtonAriaLabel: "Cancelar",
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
                            title: 'Carregando...',
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
            title: "Cadastrar uma nova dieta",
            html: `
              <label for="swal-input-1">Nome da Dieta</label>
              <input id="swal-input1" name="swal-input1" class="swal2-input">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return document.getElementById("swal-input1").value;
            }
        });

        if (formValue !== '') {
            const { value: focus } = await Swal.fire({
                title: "Qual o foco da sua dieta?",
                input: "select",
                inputOptions: {
                    Focos: {
                        Hipertrofia: "Hipertrofia",
                        Definição: "Definição",
                        Emagrecer: "Emagrecer",
                    }
                },
                inputPlaceholder: "Qual o foco da sua dieta?",
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
                    title: "Deseja criar a sua dieta?",
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
                        createDiet(formValue, 0, focus);
                    } else if (result.isDenied) {
                        Swal.fire("Dieta cancelada!", "", "info");
                    }
                });
            }
        } else {
            Swal.fire({
                title: "Ocorreu um erro",
                text: "Você precisa escolher um nome para a sua dieta para prosseguir...",
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
        Swal.fire("Dieta criada!", "", "success").then(function() {
            location.reload();
            window.location.href = 'home#Diet';
        });
    })
    .catch(error => {
        Swal.fire("Erro ao criar dieta!", "", "error");
    });
}

/**
 * Envia uma requisição para excluir uma dieta existente do usuário.
 * @param {int} dietId - O ID da dieta a ser excluída.
 */
const removeDiet = async function(dietId) {
    const userId = user.id;
    Swal.fire({
        title: "Você tem certeza?",
        text: "Não será possível acessar novamente esta Dieta!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: 'Cancelar'
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
                        title: "Excluído!",
                        text: "A sua dieta foi excluída com sucesso.",
                        icon: "success"
                    });
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
const updateDiet = async function(diet, loadingSwal) {
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
            Swal.fire('Dieta atualizada com sucesso!', '', 'success').then(function() {
                document.getElementById(`diet-calories-${diet.name}`).textContent = `${diet.calories}kcal`;
                location.reload();
                window.location.href = 'home#Diet';
            });
        } else {
            Swal.fire('Erro ao atualizar o dieta!', '', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar o dieta:', error);
        Swal.fire('Erro ao atualizar o dieta!', '', 'error');
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
        const response = await fetch(`/api/dietas/${dietaId}/ingredientes`);
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

function init () {
    window.addOrEnterDiet = addOrEnterDiet;
    window.removeDiet = removeDiet;
    window.updateDiet = updateDiet;
}

init();