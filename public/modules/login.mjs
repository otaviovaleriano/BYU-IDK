import { LoginUser } from './firebase01.mjs';

addEventListener("load", () => {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener("click", login);
})

async function login (){
    // console.log("Hey Yah!")
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = await LoginUser(password, email).then ( () => {
        setTimeout(() => {
            window.location.href = '../index.html'
        }, 1000)
        
    });
    console.log(msg);
    // 
}


