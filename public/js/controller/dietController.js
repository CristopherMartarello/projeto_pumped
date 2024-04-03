const userString = localStorage.getItem('user');
const user = JSON.parse(userString);
var ingredientesSelecionados = [];
var mockDiets;
var totalCalorias = 0;

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
                console.log('DATA', data);

                getIngredients(data.id).then(async function (response) {
                    const ingredientDetails = [];
                    
                    for (const ingredient of response) {
                        try {
                            const foundedIngredient = await getIngredientDetails(ingredient.ingredientId);
                            ingredientDetails.push(foundedIngredient);
                        } catch (error) {
                            console.error('Erro ao encontrar detalhes do ingrediente:', error);
                        }
                    }
                
                    ingredientDetails.forEach(function (ingredient) {
                        const checkbox = document.querySelector(`input[type="checkbox"][data-nome="${ingredient.name}"]`);
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

                const recommendedCalories = document.createElement('div');
                recommendedCalories.classList.add('info-diet');
                recommendedCalories.textContent = `Desejadas`;

                const amountRecommended = document.createElement('div');
                amountRecommended.classList.add('info-diet');
                amountRecommended.textContent = `0kcal`;

                const contadorDiv = document.createElement('div');
                contadorDiv.classList.add('info-diet');
                contadorDiv.textContent = `Total de calorias`;

                const amountDiv = document.createElement('div');
                amountDiv.classList.add('info-diet');
                amountDiv.setAttribute('id', 'total-calories'); 

                if (data.calories > 0) {
                    console.log('CALORIES', data.calories);
                    totalCalorias = data.calories;
                    amountDiv.textContent = `${data.calories}kcal`;
                } else {
                    amountDiv.textContent = `0kcal`;
                }

                ingredientContainer.appendChild(recommendedCalories);
                ingredientContainer.appendChild(amountRecommended);
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
                        data.focus === 'Emagrecimento' ? '🥗' : '🍗'
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
                        const checkboxes = document.querySelectorAll('.ingredient-checkbox');
                        checkboxes.forEach(checkbox => {
                            checkbox.addEventListener('click', () => {
                                const ingrediente = checkbox.getAttribute('data-nome');
                                handleCheckboxClick(checkbox, ingrediente);
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
                        updateDiet(diet);
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
                        Emagrecimento: "Emagrecimento",
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
        Swal.fire("Dieta criada!", "", "success");
    })
    .catch(error => {
        Swal.fire("Erro ao criar dieta!", "", "error");
    });
}

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
                        text: "A sua dieta foi excluído com sucesso.",
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

const updateDiet = async function(diet) {
    try {
        const response = await fetch('/update-diet', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diet)
        });

        if (response.ok) {
            Swal.fire('Dieta atualizada com sucesso!', '', 'success');
        } else {
            Swal.fire('Erro ao atualizar o dieta!', '', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar o dieta:', error);
        Swal.fire('Erro ao atualizar o dieta!', '', 'error');
    }
}

// Função para obter os ingredientes da dieta
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

// Função para obter o objeto dos ingredientes com os ids vindos da tabela relação
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

// Função para adicionar um ingrediente à lista de ingredientes selecionados
function adicionarIngrediente(ingrediente) {
    const ingredienteAchado = mockDiets.find(item => item.nome === ingrediente);

    if (ingredienteAchado) {
        console.log(ingredienteAchado);
        ingredientesSelecionados.push(ingrediente);
        totalCalorias += ingredienteAchado.calorias;
        const amountDiv = document.getElementById('total-calories');
        amountDiv.textContent = `${totalCalorias} kcal`;
    }
}

// Função para remover um ingrediente da lista de ingredientes selecionados
function removerIngrediente(ingrediente) {
    const ingredienteAchado = mockDiets.find(item => item.nome === ingrediente);

    if (ingredienteAchado !== -1) {
        ingredientesSelecionados.splice(ingredienteAchado, 1);
        console.log('CALORIES', ingredienteAchado.calorias);
        totalCalorias -= ingredienteAchado.calorias;

        const amountDiv = document.getElementById('total-calories');
        amountDiv.textContent = `${totalCalorias} kcal`;
    }
}

// Função para lidar com o clique em uma checkbox de ingrediente
function handleCheckboxClick(checkbox, ingrediente) {
    if (checkbox.checked) {
        adicionarIngrediente(ingrediente);
    } else {
        console.log(ingrediente);
        removerIngrediente(ingrediente);
    }
}

function init () {
    window.addOrEnterDiet = addOrEnterDiet;
    window.removeDiet = removeDiet;
    window.updateDiet = updateDiet;
}

init();