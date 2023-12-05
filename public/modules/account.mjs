import {UpdateUsername, GetUserName} from "../modules/firebase01.mjs"
import { setUsername, AddHeader} from "../modules/header.mjs";

addEventListener("load", () => {
    AddHeader()
    setUsername()
    SetUserInfo()
    const loginBtn = document.getElementById('saveChangesButton');
    console.log(loginBtn)
    loginBtn.addEventListener("click", () => {
        setNewUserName()
    })
})

async function SetUserInfo() {
    const UserName = await GetUserName()
    console.log(UserName)
    document.getElementById("accountUserName").innerHTML = UserName;
    await setUsername()
}

async function setNewUserName() {
    let NewUserName = document.getElementById("username");
    if (NewUserName != "")
    {
        await UpdateUsername(NewUserName.value);
        await SetUserInfo()
        NewUserName.value = "";
    }
}