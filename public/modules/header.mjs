import { GetUserName } from "./firebase01.mjs";


export async function setUsername() {

    const username = document.getElementById('usernameHeader');
    const newUserName = await GetUserName();
    username.textContent = newUserName;
    // console.log(newUserName)

};

export async function AddHeader(){
    document.getElementById("MainHeader").innerHTML = `
        <div id="title"><a href="/public/index.html"><h1>BYU-I Don't Know</h1></a>
        </div>
        <div class="userInfo" id="UserButton">
        <div id="usernameHeader"><h4></h4></div>
            <div id="icon">
                
                <img src="/public/images/icon-white.svg" alt="Login Icon - Access Acount"></a>
            </div>
        </div>
    `
}

addEventListener("load", () => {
    document.getElementById("UserButton").addEventListener("click", () => {
        const userId = localStorage.getItem("userId");
        if (userId)
        {
            window.location.href = "/public/Account/index.html"
        }
        else {
            window.location.href = "/public/Login/index.html"
        }
    })
})