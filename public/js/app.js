const formContainer = document.querySelector('.form-container');
const loginForm = document.querySelector('#sign-in-form');
const signUpForm = document.querySelector('#sign-up-form');

const clearStorage = function() {
    localStorage.removeItem('user');
}

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


function init() {
    clearStorage();
}

init();



