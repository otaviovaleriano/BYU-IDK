// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'

// Add Firebase products that you want to use
//import { getAuth } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import { getFirestore, collection, query, limit, orderBy, getDoc, getDocs, doc} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'

// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
    apiKey: "AIzaSyBthga9Bal8vDhXnxlDK9FDIfHPmoWeKUI",
    authDomain: "byui-dont-know.firebaseapp.com",
    projectId: "byui-dont-know",
    storageBucket: "byui-dont-know.appspot.com",
    messagingSenderId: "406518643156",
    appId: "1:406518643156:web:39865d8f499914ac54be41",
    measurementId: "G-2JESMELLP9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();

// Query
export async function GetPostInfo(queryAmount) {
    var postData = [];
    // Create a reference to the cities collection
    const Ref = collection(db, "Posts");

    // Create a query against the collection.
    const q = query(Ref, orderBy("Date", "desc"), limit(queryAmount));

    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        postData.push(doc.data());
    });
    return postData
}

export async function SetPostInfo(){

}

export async function CreateUser(){

}

export async function LoginUser(password, email){
    let errorMessage = ""
    if (password.length > 0 && email.length > 0)
    {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            errorMessage = "successful"
            // ...
        })
        .catch((error) => {
            errorMessage = error.message;
        });
    }
    else {errorMessage = "Please fill Out all Fields"}
    return errorMessage;
}