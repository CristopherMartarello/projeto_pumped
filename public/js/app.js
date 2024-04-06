/**
 * Referência para o contêiner do formulário na página HTML.
 * @type {HTMLElement}
 * @constant
 */
const formContainer = document.querySelector('.form-container');

/**
 * Referência para o formulário de login na página HTML.
 * @type {HTMLFormElement}
 * @constant
 */
const loginForm = document.querySelector('#sign-in-form');

/**
 * Referência para o formulário de registro na página HTML.
 * @type {HTMLFormElement}
 * @constant
 */
const signUpForm = document.querySelector('#sign-up-form');

/**
 * Remove o item 'user' do armazenamento local (localStorage).
 * @function clearStorage
 */
const clearStorage = function() {
    localStorage.removeItem('user');
}

/**
 * Alterna entre os formulários de login e registro na página, ajustando suas posições.
 * @function switchForms
 * @param {string} form - Uma string que indica qual formulário exibir ('login' para login e 'register' para registro).
 */
const switchForms = function (form) {

    const inputs = document.querySelectorAll('input');
    inputs.forEach(function (value, key) {
        value.value = null;
    })

    if (form === 'register') {
        if (window.innerWidth > 800) {
            formContainer.style.left = '50%';
        }

        loginForm.style.marginLeft = '-150%';
        signUpForm.style.marginLeft = '-100%';
    } else {
        if (window.innerWidth > 800) {
            formContainer.style.left = '0%';
        }

        loginForm.style.marginLeft = '0%';
        signUpForm.style.marginLeft = '50%';
    }

}

/**
 * Manipula o envio do formulário de registro de usuário.
 * Obtém os valores dos campos do formulário e envia uma requisição POST para o servidor com os dados do usuário.
 * @function handleSubmit
 */
const handleSubmit = function () {
    let nome = document.querySelector('.name').value;
    let username = document.querySelector('.username').value;
    let email = document.querySelector('.email').value;
    let password = document.querySelector('.password').value;

    fetch('/register-user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: nome,
            username: username,
            email: email,
            password: password
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('DATA', data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

/**
 * Manipula o envio do formulário de login de usuário.
 * Obtém os valores dos campos do formulário e envia uma requisição POST para o servidor com as credenciais de login do usuário.
 * Se o login for bem-sucedido, redireciona o usuário para a página inicial ('/home') e armazena os dados do usuário no armazenamento local (localStorage).
 * @function handleLogin
 */
const handleLogin = function () {
    let username = document.querySelector('.usernameLogin').value;
    let password = document.querySelector('.passwordLogin').value;

    fetch('/login-user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(res => res.json())
        .then(data => {
            if(!data.erro) {
                console.log('DATA', data.data[0]);
                localStorage.setItem('user', JSON.stringify(data.data[0]));
                window.location.href = '/home';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

/**
 * Inicializa a aplicação, realizando as operações necessárias no início.
 * Neste caso, limpa o armazenamento local (localStorage).
 * @function init
 */
function init() {
    clearStorage();
}

init();



