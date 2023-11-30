import { GetPostInfo } from "./firebase.mjs";

let PostData;
let testmode = false;

if (testmode === true)
{
    PostData = await GetPostInfo(20)
}

function setPostContent(){
    for (let i = 0; i < PostData.length; i++) {
        const Comments = CommentContent(PostData[i].Comments);
        const postContent = `
        <div class="questionBox shadow">
                <div class="postHeader">
                    <text class="PostUserName">${PostData[i].UserNamePost}</text>
                    <text class="PostDate">${PostData[i].DateString}</text>
                        <div class="Icons">
                        <div class="IconBox">
                            <img src="../images/Comment-white.png" class="iconImg">
                            <text class="iconNum">${PostData[i].Comments.length}</text>
                        </div>
                        <div class="IconBox">
                            <img src="../images/ThumbsUp-white.png" class="iconImg">
                            <text class="iconNum">${PostData[i].UsersLiked.length-1}</text>
                        </div>
                    </div>
                </div>
                <text class="PostContent">${PostData[i].PostContent}</text>
                <div class="replies">
                ${Comments}
                </div>
                <div class="CommentBox">
                    <textarea class="inputBox commentBox"type="text" placeholder="Comment"></textarea>
                    <button class="btn postBtn ">Post</button>
                </div>
            </div>
        `
        document.getElementById('formContent').insertAdjacentHTML("afterbegin", postContent)
        console.log(PostData[i])
    } 
}

function CommentContent(Comments){
    let CommentsString = "";
    console.log(Comments.length)
    for (let i = 0; i < Comments.length; i++){
        const Comment = `
        <div class="reply shadow">
            <div class="replyHeader">
                <text class="PostUserName">${Comments[i].CommentUserName}</text>
                <div class="IconBox">
                    <img src="../images/ThumbsUp.png" class="iconImg">
                    <text class="CommenticonNum">${Comments[i].CommentUsersLiked.length-1}</text>
                </div>
            </div>
            <text class="replyContent">${Comments[i].CommentContent}</text>
        </div>
        `
        CommentsString = CommentsString + Comment;
    }
    return CommentsString;
}

function INIT(){
    let expandButton = document.getElementById("PostArrow")
    let postMenu = false;

    expandButton.addEventListener("click", () => {
        if (postMenu == false)
        {
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
            expandButton.src = "../images/UpArrow.png"
            postMenu = true;
        }
        else
        {
            document.getElementById("CategoryInput").remove();
            document.getElementById("SubmitButton").remove();
            document.getElementById("PostContentInput").remove();
            expandButton.src = "../images/DownArrow.png"
            postMenu = false;
        }

    });

    if (testmode === true)
    {
        setPostContent()
    }
}

INIT()