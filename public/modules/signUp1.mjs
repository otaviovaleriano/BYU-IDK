import { CreateUser } from './firebase01.mjs';
import { setUsername, AddHeader} from "../modules/header01.mjs";
import { AddFooter } from "../modules/footer.mjs";

addEventListener("load", () => {
    AddHeader()
    AddFooter()
    setUsername() 
    const signUpBtn = document.getElementById('signUpBtn');
    signUpBtn.addEventListener("click", signUp);
})

async function signUp (){
    // console.log("Hey Yah!")
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value
    await CreateUser(password, email, username).then (() => {
        setTimeout(() => {
            window.location.href = '../index.html'
        }, 1000)
        
    });
    
  }
