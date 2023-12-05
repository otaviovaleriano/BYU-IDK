import { GetPostInfo, newPost, likePost, addComment, LikeComment } from "./firebase01.mjs";
import { setUsername, AddHeader} from "../modules/header01.mjs";
import { AddFooter } from "../modules/footer.mjs";

let Category = "All";
let Type = "Date";
let SearchTerm = ""

function setPostContent(PostData) {
    document.getElementById('formContent').innerHTML = "";
    for (let i = 0; i < PostData.length; i++) {
        const Comments = CommentContent(PostData[i]);
        const postContent = `
        <div class="questionBox shadow">
                <div class="postHeader">
                    <text class="PostUserName">${PostData[i].UserNamePost}</text>
                    <text class="PostCategory">${PostData[i].Category}</text>
                    <text class="PostDate">${PostData[i].DateString}</text>
                    
                        <div class="Icons">
                        <div class="IconBox">
                            <img src="../images/CommentWhite.png" class="iconImg">
                            <text class="iconNum">${PostData[i].Comments.length - 1}</text>
                        </div>
                        <div class="IconBox">
                            <img id="${PostData[i].docId}" src="../images/ThumbsUpWhite.png" class="iconImg likeButton">
                            <text id="likeNum_${PostData[i].docId}" class="iconNum">${PostData[i].UsersLiked.length - 1}</text>
                        </div>
                    </div>
                </div>
                <text class="PostContent">${PostData[i].PostContent}</text>
                <div class="replies">
                ${Comments}
                </div>
                <div class="CommentBox">
                    <textarea class="inputBoxMain commentBox"type="text" id="commentBox_${PostData[i].docId}" placeholder="Comment"></textarea>
                    <button id="${PostData[i].docId}" class="btn postBtn commentBtn">Post</button>
                </div>
            </div>
        `
        document.getElementById('formContent').insertAdjacentHTML("afterbegin", postContent)
        // console.log(PostData[i])
    }
}

function CommentContent(PostData) {
    let CommentsString = "";
    let Comments = PostData.Comments
    // console.log(Comments.length)
    for (let i = 1; i < Comments.length; i++) {
        const Comment = `
        <div class="reply shadow">
            <div class="replyHeader">
                <text class="PostUserName">${Comments[i].CommentUserName}</text>
                <div class="IconBox">
                    <img commentId="${i}" id="${PostData.docId}" src="../images/ThumbsUp.png" class="iconImg LikeCommentButton">
                    <text id="CommentlikeNum_${PostData.docId}${i}" class="CommenticonNum">${Comments[i].CommentUsersLiked.length - 1}</text>
                </div>
            </div>
            <text class="replyContent">${Comments[i].CommentContent}</text>
        </div>
        `
        CommentsString = CommentsString + Comment;
    }
    return CommentsString;
}


async function commentOnPost(postId){
    const username = localStorage.getItem('userId')
    if (username) {
        const commentElement = document.getElementById("commentBox_" + postId);
        const commentContent = commentElement.value;
        await addComment(postId, commentContent)
        commentElement.value = ""
        setTimeout(()=>{
            reloadContent()
        },1000)
    }
    else {
        //replace this with a better pop-up
        alert("Please, Login first.")
    }
}

async function likePostEvent(postId) {
    const username = localStorage.getItem('userId')
    if (username) {
        await likePost(postId)
        reloadContent()
    }
    else {
        //replace this with a better pop-up
        alert("Please, Login first.")
    }
}

async function likeCommentEvent(postId, commentId) {
    const username = localStorage.getItem('userId')
    if (username) {
        await LikeComment(postId, commentId)
        reloadContent()
        
    }
    else {
        //replace this with a better pop-up
        alert("Please, Login first.")
    }
}

async function reloadContent() {
    let PostData = await GetPostInfo(20, Category, Type, SearchTerm)
    await setPostContent(PostData);
    await setUsername();
}

// async function reloadCategoryContent()

async function makePost() {
    let category = document.getElementById('CategoryInput');
    let categoryValue = category.value;
    let textContent = document.getElementById('PostContentInput')
    let textContentValue = textContent.value;
    await newPost(categoryValue, textContentValue)

    textContent.value = ""
    reloadContent();
}

async function INIT() {
    AddHeader()
    AddFooter()
    let expandButton = document.getElementById("PostArrow")
    let postMenu = true;

    const submitBtn = document.getElementById('SubmitButton');
    submitBtn.addEventListener("click", () => {
        makePost();
    })

    const formBox = document.getElementById('formBox');

    const SearchCateogry = document.getElementById('SearchCategoryInput');
    const SearchButton = document.getElementById('SearchButton');
    const SearchInput = document.getElementById('searchInputBox');

    SearchCateogry.addEventListener("change", () => {
        Category = SearchCateogry.value;
        reloadContent()
    })

    SearchButton.addEventListener("click", () => {
        SearchTerm = SearchInput.value;
        if (SearchTerm != "")
        {
            reloadContent()
        }
    })

    SearchInput.addEventListener("change", () => {
        SearchTerm = SearchInput.value;
        if (SearchTerm === "")
        {
            reloadContent()
        }
    })

    expandButton.addEventListener("click", () => {
        if (postMenu == false) {
            const content = `
                <textarea placeholder="Ask A Question!" id="PostContentInput"></textarea>
                <!-- Category Drop Down -->
                <select name="cars" id="CategoryInput">
                    <option value="Housing">Housing</option>
                    <option value="Classes">Classes</option>
                    <option value="Professors">Professors</option>
                    <option value="Events">Events</option>
                    <option value="Other">Other</option>
                </select>
                <button class="btn SearchBtn" id="SubmitButton">Submit</button>
            `
            document.getElementById("PostContent").insertAdjacentHTML("afterbegin", content)
            expandButton.src = "./images/UpArrow.png"
            postMenu = true;
        }
        else {
            document.getElementById("CategoryInput").remove();
            document.getElementById("SubmitButton").remove();
            document.getElementById("PostContentInput").remove();
            expandButton.src = "./images/DownArrow.png"
            postMenu = false;
        }

    });

    formBox.addEventListener('click', (event) => {

        if (event.target.classList.contains('likeButton')) {
            const postId = event.target.id;
            console.log(postId)
            likePostEvent(postId);
        }

        if (event.target.classList.contains('commentBtn')) {
            const postId = event.target.id;
            commentOnPost(postId);
        }

        if (event.target.classList.contains('LikeCommentButton')) {
            const postId = event.target.id;
            let commentId = event.target.getAttribute("commentId")
            console.log(postId)
            likeCommentEvent(postId, commentId);
        }

    });

    reloadContent()
}

INIT();
