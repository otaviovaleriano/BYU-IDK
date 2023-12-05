// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js'

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser, signOut } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'

// Add Firebase products that you want to use
//import { getAuth } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import { getFirestore, where, collection, query, limit, orderBy, setDoc, updateDoc, getDoc, getDocs, doc, Timestamp, addDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'

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
export async function GetPostInfo(queryAmount, Category, Type, SearchTerm) {
    var postData = [];
    // Create a reference to the cities collection
    const Ref = collection(db, "Posts");
    let q;

    if (Category === "All") {
        // Create a query against the collection.
        q = query(Ref, orderBy(Type, "asc"), limit(queryAmount));
    }
    else {
        q = query(Ref, where("Category", "==", Category), orderBy(Type, "asc"), limit(queryAmount));
    }

    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let documentData = doc.data();
        documentData["docId"] = doc.id
        postData.push(documentData);
    });

    if (SearchTerm !== "") {
        const searchTermArray = SearchTerm.toLowerCase().split(" ");

        const searchedPostData = postData.filter(post => {
            return searchTermArray.some(word => post.PostContent.toLowerCase().includes(word));
        });

        return searchedPostData;
    } else {
        return postData;
    }
}

async function SetNewUser(userId, newUserName) {
    await setDoc(doc(db, "Users", userId), {
        UserName: newUserName
    });
}

export async function CreateUser(password, email, newUserName) {
    let errorMessage = "success"
    if (password.length > 0 && email.length > 0 && newUserName.length > 0) {
        if (newUserName.length > 10) {
            errorMessage = "UserName must be less than 11 characters";
        }
        else {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {

                    const user = userCredential.user;
                    localStorage.setItem("userId", user.uid)
                    SetNewUser(user.uid, newUserName);
                })
                .catch((error) => {
                    errorMessage = error.message;
                });
        }
    }
    else { errorMessage("Please fill Out all Fields") }
    return (errorMessage)
}

export async function LoginUser(password, email) {
    let errorMessage = "success"
    if (password.length > 0 && email.length > 0) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                localStorage.setItem("userId", user.uid)
                // ...

            })
            .catch((error) => {
                errorMessage = error.message;
            });
    }
    else { errorMessage = "Please fill Out all Fields" }
    return errorMessage;
}

export async function GetUserName() {
    const userId = localStorage.getItem("userId")
    let UserName = "Login"

    const docRef = doc(db, "Users", `${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const userData = docSnap.data();
        UserName = userData.UserName;
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
    // console.log(UserName)
    return UserName
}


function formattedString() {
    const now = new Date(Date.now());

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Use 12-hour clock format
    };

    const formattedDateString = new Intl.DateTimeFormat('en-US', options).format(now);

    return formattedDateString
}

export async function newPost(category, textContent) {
    const username = await GetUserName();
    const now = Timestamp.now();
    let newDate = formattedString();
    if (username !== "Login") {
        const PostCollection = collection(db, 'Posts')
        const NewPostContent = {
            Category: category,
            Comments: [""],
            Date: now,
            DateString: newDate,
            PostContent: textContent,
            PostLikes: 0,
            UserNamePost: username,
            UsersLiked: [""]
        };
        await addDoc(PostCollection, NewPostContent);
    }
}

export async function likePost(docId) {
    const username = await GetUserName();
    if (username !== "Login") {
        const docRef = doc(db, "Posts", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            let postLikesAmount = docData.PostLikes;
            let usersLikedArray = docData.UsersLiked;

            if (!usersLikedArray.includes(username)) {
                usersLikedArray.push(username)
                await updateDoc(docRef, {
                    PostLikes: postLikesAmount + 1,
                    UsersLiked: usersLikedArray
                });
            } else {
                console.log("User Allready Liked");
            }

        } else {
            console.log("No such document!");
        }
    }
}

export async function addComment(docId, commentContent) {
    const username = await GetUserName();

    if (username !== "Login" && commentContent !== "") {
        const docRef = doc(db, "Posts", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            let comments = docData.Comments;
            comments.push({
                CommentContent: commentContent,
                CommentUserName: username,
                CommentUsersLiked: [""]
            })

            await updateDoc(docRef, {
                Comments: comments
            });
        } else {
            console.log("No such document!");
        }
    }
}

export async function LikeComment(docId, commentId) {
    const username = await GetUserName();
    if (username !== "Login") {
        const docRef = doc(db, "Posts", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            let comments = docData.Comments;
            let currentComment = comments[commentId]
            let usersLikedArray = currentComment.CommentUsersLiked;
            if (!usersLikedArray.includes(username)) {
                usersLikedArray.push(username)
                currentComment.CommentUsersLiked = usersLikedArray
                comments[commentId] = currentComment;
                await updateDoc(docRef, {
                    Comments: comments
                });
            } else {
                console.log("User Allready Liked Comment");
            }

        } else {
            console.log("No such document!");
        }
    }
}

export async function UpdateUsername(NewUserName) {
    const username = await GetUserName();
    if (username !== "Login") {
        const userId = localStorage.getItem("userId")
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            await updateDoc(docRef, {
                UserName: NewUserName
            });
        } else {
            console.log("No such document!");
        }
    }
}

export async function DeleteUser() {
    const userId = localStorage.getItem("userId");

    try {
        await deleteUser(auth.currentUser);

        const userDocRef = doc(db, "Users", userId);
        await deleteDoc(userDocRef);

        localStorage.removeItem("userId");

        return "success";
    } catch (error) {
        console.error("Error deleting user:", error.message);
        return error.message;
    }
}

export function Logout() {

    // window.location.href = '../index.html'
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log("Sign-out successful.")
        console.log("logout firebase")
        const userId = localStorage.getItem("userId");
        localStorage.setItem(userId, " ")
        console.log(userId)
        // window.location.href = '../index.html'
    }).catch((error) => {
        console.log(error);
    });
}

