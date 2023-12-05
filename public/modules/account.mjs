import { UpdateUsername, GetUserName, DeleteUser } from "../modules/firebase01.mjs"
import { setUsername, AddHeader } from "../modules/header.mjs";
import { AddFooter } from "../modules/footer.mjs";


addEventListener("load", () => {
    AddHeader()
    AddFooter()
    setUsername()
    SetUserInfo()
    const loginBtn = document.getElementById('saveChangesButton');
    console.log(loginBtn)
    loginBtn.addEventListener("click", () => {
        setNewUserName()
    })
    const deleteAccount = document.getElementById('deleteAccountButton');
    deleteAccount.addEventListener("click", () => {
        openModal()
    })
    const confirmDeleteAccount = document.getElementById('confirmDelete');
    confirmDeleteAccount.addEventListener("click", () => {
        confirmDelete();
    })
    const endModal = document.getElementById('closeModal');
    endModal.addEventListener("click", () => {
        closeModal();
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
    if (NewUserName != "") {
        await UpdateUsername(NewUserName.value);
        await SetUserInfo()
        NewUserName.value = "";
    }
}

function openModal() {
    const modal = document.getElementById("confirmModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("confirmModal");
    modal.style.display = "none";
}

function confirmDelete(){

    DeleteUser().then((result) => {
        if (result === "success") {
            alert("Account deleted!");
            closeModal();
            window.location.href = '../index.html'

        } else {
            alert("There was an error deleting your account: " + result)
        }
    })
}

