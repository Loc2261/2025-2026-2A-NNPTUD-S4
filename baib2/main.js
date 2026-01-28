const POST_API = "http://localhost:3000/posts";
const COMMENT_API = "http://localhost:3000/comments";

/* ================= POSTS ================= */

async function LoadPosts() {
    let res = await fetch(POST_API);
    let posts = await res.json();

    let body = document.getElementById("body_table");
    body.innerHTML = "";

    for (const post of posts) {
        let cls = post.isDeleted ? "deleted" : "";
        body.innerHTML += `
            <tr class="${cls}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>
                    <button onclick="EditPost('${post.id}')">Edit</button>
                    <button onclick="DeletePost('${post.id}')">Delete</button>
                </td>
            </tr>
        `;
    }
}

async function GetNextPostId() {
    let res = await fetch(POST_API);
    let posts = await res.json();
    let maxId = posts.length ? Math.max(...posts.map(p => Number(p.id))) : 0;
    return String(maxId + 1);
}

async function SavePost() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    if (id) {
        // UPDATE
        await fetch(`${POST_API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, views })
        });
    } else {
        // CREATE
        let newId = await GetNextPostId();
        await fetch(POST_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                title,
                views,
                isDeleted: false
            })
        });
    }

    ClearPostForm();
    LoadPosts();
}

async function EditPost(id) {
    let res = await fetch(`${POST_API}/${id}`);
    let post = await res.json();

    document.getElementById("id_txt").value = post.id;
    document.getElementById("title_txt").value = post.title;
    document.getElementById("view_txt").value = post.views;
}

async function DeletePost(id) {
    await fetch(`${POST_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    LoadPosts();
}

function ClearPostForm() {
    document.getElementById("id_txt").value = "";
    document.getElementById("title_txt").value = "";
    document.getElementById("view_txt").value = "";
}

/* ================= COMMENTS ================= */

async function LoadComments() {
    let res = await fetch(COMMENT_API);
    let comments = await res.json();

    let body = document.getElementById("comment_table");
    body.innerHTML = "";

    for (const c of comments) {
        let cls = c.isDeleted ? "deleted" : "";
        body.innerHTML += `
            <tr class="${cls}">
                <td>${c.id}</td>
                <td>${c.postId}</td>
                <td>${c.content}</td>
                <td>
                    <button onclick="EditComment('${c.id}')">Edit</button>
                    <button onclick="DeleteComment('${c.id}')">Delete</button>
                </td>
            </tr>
        `;
    }
}

async function GetNextCommentId() {
    let res = await fetch(COMMENT_API);
    let comments = await res.json();
    let maxId = comments.length ? Math.max(...comments.map(c => Number(c.id))) : 0;
    return String(maxId + 1);
}

async function SaveComment() {
    let id = document.getElementById("c_id").value;
    let postId = document.getElementById("c_postId").value;
    let content = document.getElementById("c_content").value;

    if (id) {
        await fetch(`${COMMENT_API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, content })
        });
    } else {
        let newId = await GetNextCommentId();
        await fetch(COMMENT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                postId,
                content,
                isDeleted: false
            })
        });
    }

    ClearCommentForm();
    LoadComments();
}

async function EditComment(id) {
    let res = await fetch(`${COMMENT_API}/${id}`);
    let c = await res.json();

    document.getElementById("c_id").value = c.id;
    document.getElementById("c_postId").value = c.postId;
    document.getElementById("c_content").value = c.content;
}

async function DeleteComment(id) {
    await fetch(`${COMMENT_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    LoadComments();
}

function ClearCommentForm() {
    document.getElementById("c_id").value = "";
    document.getElementById("c_postId").value = "";
    document.getElementById("c_content").value = "";
}

/* INIT */
LoadPosts();
LoadComments();
