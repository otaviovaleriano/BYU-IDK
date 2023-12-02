import { LoginUser } from '../modules/firebase.mjs';

addEventListener("load", () => {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener("click", login);
})

async function login (){
    // console.log("Hey Yah!")
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = await LoginUser(password, email);
    console.log(msg);
    window.location.href = '../main/index.html'
}


