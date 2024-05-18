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
 * Declara a string que irá conter a linguagem do usuário.
 * @type {string}
 * @let
 */
let mainLanguage = '';

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

    const loadingSwal = Swal.fire({
        title: `${mainLanguage === 'pt-BR' ? 'Carregando...' : mainLanguage === 'en' ? 'Loading...' : mainLanguage === 'es' ? 'Cargando...' : 'Carregando...'}`,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

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
            loadingSwal.close();
            Swal.fire(
                `${mainLanguage === 'pt-BR' ? 'Usuário Cadastrado!' : mainLanguage === 'en' ? 'User Registered!' : mainLanguage === 'es' ? 'Usuario Registrado!' : 'Usuário Cadastrado!'}`,
                "",
                "success"
            );
        })
        .catch(error => {
            Swal.fire(
                `${mainLanguage === 'pt-BR' ? 'Erro ao cadastrar usuário!' : mainLanguage === 'en' ? 'Error registering user!' : mainLanguage === 'es' ? 'Error al registrar usuario!' : 'Erro ao cadastrar usuário!'}`,
                "",
                "error"
            );
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

    const loadingSwal = Swal.fire({
        title: `${mainLanguage === 'pt-BR' ? 'Carregando...' : mainLanguage === 'en' ? 'Loading...' : mainLanguage === 'es' ? 'Cargando...' : 'Carregando...'}`,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

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
                loadingSwal.close();
                localStorage.setItem('user', JSON.stringify(data.data[0]));

                const userLanguage = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language;
                window.location.href = `/home?lang=${userLanguage}`;
            } else {
                Swal.fire(
                    `${mainLanguage === 'pt-BR' ? 'Erro ao entrar na conta, verifique o usuário e/ou a senha!' : mainLanguage === 'en' ? 'Error logging into account, check the username and/or password!' : mainLanguage === 'es' ? 'Error al iniciar sesión, ¡verifica el nombre de usuario y/o la contraseña!' : 'Erro ao entrar na conta, verifique o usuário e/ou a senha!'}`,
                    "",
                    "error"
                );
            }
        })
        .catch(error => {
            Swal.fire(
                `${mainLanguage === 'pt-BR' ? 'Erro ao entrar na conta, verifique o usuário e a senha!' : mainLanguage === 'en' ? 'Error logging into account, check the username and password!' : mainLanguage === 'es' ? 'Error al iniciar sesión, ¡verifica el nombre de usuario y la contraseña!' : 'Erro ao entrar na conta, verifique o usuário e a senha!'}`,
                "",
                "error"
            );
        });
}

/**
 * Inicializa a aplicação, realizando as operações necessárias no início.
 * Neste caso, limpa o armazenamento local (localStorage) e inicializa as funções do objeto window.
 * @function init
 */
function init() {
    clearStorage();
    window.handleLogin = handleLogin;
    window.handleSubmit = handleSubmit;
    window.switchForms = switchForms;
    mainLanguage = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language;
}

init();



