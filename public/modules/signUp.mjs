import { CreateUser } from '../modules/firebase.mjs';

addEventListener("load", () => {
    const signUpBtn = document.getElementById('signUpBtn');
    signUpBtn.addEventListener("click", signUp);
})

async function signUp (){
    // console.log("Hey Yah!")
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value
    const msg = await CreateUser(password, email, username).then (() => {
        console.log(msg);
        setTimeout(() => {
            window.location.href = '../index.html'
        }, 1000)
        
    });
    
  }
