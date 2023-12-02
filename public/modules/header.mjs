import { GetUserName } from "../modules/firebase.mjs";


export async function setUsername() {

    const username = document.getElementById('usernameHeader');
    const newUserName = await GetUserName();
    username.textContent = newUserName;
    // console.log(newUserName)

};

addEventListener("load", () => {
    setUsername()
})


