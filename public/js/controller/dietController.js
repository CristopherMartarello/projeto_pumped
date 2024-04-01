const userString = localStorage.getItem('user');
const user = JSON.parse(userString);

export const addOrEnterDiet = async function (boolean, dietId) {
    // if (boolean) {
    //     try {
    //         const userId = user.id;
    //         let data = null;

    //         if (dietId) {
    //             const loadingSwal = Swal.fire({
    //                 title: 'Carregando...',
    //                 allowOutsideClick: false, 
    //                 showConfirmButton: false, 
    //                 didOpen: () => {
    //                     Swal.showLoading(); 
    //                 }
    //             });
    //             const response = await fetch(`/user-routine/${userId}/${dietId}`);

    //             if (response.ok) {
    //                 data = await response.json();
    //                 loadingSwal.close();
    //             } else {
    //                 console.error('Erro ao buscar rotina:', response.status);
    //                 return;
    //             }
    //         } else {
    //             const response = await fetch(`/user-routine/${userId}`);
    //             if (response.ok) {
    //                 data = await response.json();
    //             } else {
    //                 console.error('Erro ao buscar rotina:', response.status);
    //                 return;
    //             }
    //         }

    //         if (data) {
    //             Swal.showLoading();
    //             Swal.fire({
    //                 title: `<strong>${data.routine.name} - ${data.routine.focus}</strong>`,
    //                 iconHtml: `${
    //                     data.routine.focus === 'Pernas' ? '🦵' : '💪'
    //                 }`,
    //                 width: 800,
    //                 html: `
    //                 <div class="exercise-container">
    //                     <div class="exercise">1 - ${data.exercises[0].name}</div>
    //                     <div class="info">Rep: ${data.exercises[0].rep}</div>
    //                     <div class="info">Rest: ${data.exercises[0].rest}</div>
    //                     <div class="info">Series: ${data.exercises[0].series}</div>
    //                     <input type="checkbox" id="exercise1" class="exercise-checkbox">
    //                 </div>
    //                 <div class="exercise-container">
    //                     <div class="exercise">2 - ${data.exercises[1].name}</div>
    //                     <div class="info">Rep: ${data.exercises[1].rep}</div>
    //                     <div class="info">Rest: ${data.exercises[1].rest}</div>
    //                     <div class="info">Series: ${data.exercises[1].series}</div>
    //                     <input type="checkbox" id="exercise2" class="exercise-checkbox">
    //                 </div>
    //                 <div class="exercise-container">
    //                     <div class="exercise">3 - ${data.exercises[2].name}</div>
    //                     <div class="info">Rep: ${data.exercises[2].rep}</div>
    //                     <div class="info">Rest: ${data.exercises[2].rest}</div>
    //                     <div class="info">Series: ${data.exercises[2].series}</div>
    //                     <input type="checkbox" id="exercise3" class="exercise-checkbox">
    //                 </div>
    //                 <div class="exercise-container">
    //                     <div class="exercise">4 - ${data.exercises[3].name}</div>
    //                     <div class="info">Rep: ${data.exercises[3].rep}</div>
    //                     <div class="info">Rest: ${data.exercises[3].rest}</div>
    //                     <div class="info">Series: ${data.exercises[3].series}</div>
    //                     <input type="checkbox" id="exercise4" class="exercise-checkbox">
    //                 </div>
    //                 <div class="exercise-container">
    //                     <div class="exercise">5 - ${data.exercises[4].name}</div>
    //                     <div class="info">Rep: ${data.exercises[4].rep}</div>
    //                     <div class="info">Rest: ${data.exercises[4].rest}</div>
    //                     <div class="info">Series: ${data.exercises[4].series}</div>
    //                     <input type="checkbox" id="exercise5" class="exercise-checkbox">
    //                 </div>
    //                 `,
    //                 showCloseButton: true,
    //                 showCancelButton: true,
    //                 focusConfirm: false,
    //                 confirmButtonText: `
    //                   <i class="fa fa-thumbs-up"></i> Finalizar treino
    //                 `,
    //                 confirmButtonAriaLabel: "Treino finalizado com sucesso!",
    //                 cancelButtonText: `
    //                   <i class="fa fa-thumbs-down"></i> Cancelar
    //                 `,
    //                 cancelButtonAriaLabel: "Cancelar",
    //                 didOpen: () => {
    //                     const checkboxes = document.querySelectorAll('.exercise-checkbox');
    //                     const confirmButton = document.querySelector('.swal2-confirm');
    //                     confirmButton.setAttribute('disabled', true);
    //                     checkboxes.forEach(checkbox => {
    //                         checkbox.addEventListener('click', () => {
    //                             checkbox.classList.toggle('checked'); 
    //                             verificarTodosMarcados(checkboxes); 
    //                         });
    //                     });
    //                 }
    //             }).then(result => {
    //                 if (result.isConfirmed) {
    //                     contabilizarTreino(data);
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Erro ao buscar rotina:', error);
    //     }
    // } else {
    //     const { value: formValue } = await Swal.fire({
    //         title: "Cadastrar um novo treino",
    //         html: `
    //           <label for="swal-input-1">Nome do Treino</label>
    //           <input id="swal-input1" name="swal-input1" class="swal2-input">
    //         `,
    //         focusConfirm: false,
    //         preConfirm: () => {
    //             return document.getElementById("swal-input1").value;
    //         }
    //     });

    //     if (formValue !== '') {
    //         const { value: focus } = await Swal.fire({
    //             title: "Qual o foco do seu treino?",
    //             input: "select",
    //             inputOptions: {
    //                 Superiores: {
    //                     Peito: "Peito",
    //                     Costas: "Costas",
    //                     Ombros: "Ombros",
    //                     Biceps: "Biceps",
    //                     Tríceps: "Tríceps"
    //                 },
    //                 Inferiores: {
    //                     Pernas: "Pernas"
    //                 },
    //                 Abdomen: {
    //                     Abdomen: "Abdomen"
    //                 }
    //             },
    //             inputPlaceholder: "Qual o foco do seu treino?",
    //             showCancelButton: true,
    //             inputValidator: (value) => {
    //                 return new Promise((resolve) => {
    //                     if (value !== '') {
    //                         resolve();
    //                     } else {
    //                         resolve("Você precisa selecionar um foco!");
    //                     }
    //                 });
    //             }
    //         });
    //         if (focus) {
    //             Swal.fire({
    //                 title: "Deseja criar o seu treino?",
    //                 html: `
    //                   ${formValue} - ${focus}
    //                 `,
    //                 showDenyButton: true,
    //                 showCancelButton: true,
    //                 confirmButtonText: "Salvar",
    //                 denyButtonText: 'Descartar',
    //                 cancelButtonText: 'Cancelar'
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     createRoutine(formValue, focus);
    //                 } else if (result.isDenied) {
    //                     Swal.fire("Treino cancelado!", "", "info");
    //                 }
    //             });
    //         }
    //     } else {
    //         Swal.fire({
    //             title: "Ocorreu um erro",
    //             text: "Você precisa escolher um nome para o seu treino para prosseguir...",
    //             icon: "error"
    //         });
    //     }
    // }
    createDiet('teste1', 300, 'emagrecimento');
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

function init () {
    window.addOrEnterDiet = addOrEnterDiet;
}

init();