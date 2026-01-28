const POST_API = "http://localhost:3000/posts";
const COMMENT_API = "http://localhost:3000/comments";

/* =======================
   POSTS
======================= */

async function LoadPosts() {
    const res = await fetch(POST_API);
    const posts = await res.json();

    const body = document.getElementById("body_table");
    body.innerHTML = "";

    posts.forEach(post => {
        const text = v => post.isDeleted ? `<del style="color:red">${v}</del>` : v;

        body.innerHTML += `
        <tr>
            <td>${text(post.id)}</td>
            <td>${text(post.title)}</td>
            <td>${text(post.views)}</td>
            <td>
                ${post.isDeleted
                    ? `<button onclick="RestorePost('${post.id}')">Restore</button>`
                    : `
                        <button onclick="EditPost('${post.id}')">Edit</button>
                        <button onclick="DeletePost('${post.id}')">Delete</button>
                      `
                }
            </td>
        </tr>`;
    });
}

async function SavePost() {
    const id = document.getElementById("id_txt").value;
    const title = document.getElementById("title_txt").value;
    const views = document.getElementById("view_txt").value;

    if (!title || !views) {
        alert("Nhập đủ dữ liệu");
        return;
    }

    if (id) {
        await fetch(`${POST_API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, views })
        });
    } else {
        await fetch(POST_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
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
    const res = await fetch(`${POST_API}/${id}`);
    const post = await res.json();

    document.getElementById("id_txt").value = post.id;
    document.getElementById("title_txt").value = post.title;
    document.getElementById("view_txt").value = post.views;
}

async function DeletePost(id) {
    if (!confirm("Xóa mềm post này?")) return;

    await fetch(`${POST_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });

    LoadPosts();
}

async function RestorePost(id) {
    await fetch(`${POST_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });

    LoadPosts();
}

function ClearPostForm() {
    document.getElementById("id_txt").value = "";
    document.getElementById("title_txt").value = "";
    document.getElementById("view_txt").value = "";
}

/* =======================
   COMMENTS
======================= */

async function LoadComments() {
    const res = await fetch(COMMENT_API);
    const comments = await res.json();

    const body = document.getElementById("comment_table");
    body.innerHTML = "";

    comments.forEach(c => {
        const text = v => c.isDeleted ? `<del style="color:red">${v}</del>` : v;

        body.innerHTML += `
        <tr>
            <td>${text(c.id)}</td>
            <td>${text(c.postId)}</td>
            <td>${text(c.content)}</td>
            <td>
                ${c.isDeleted
                    ? `<button onclick="RestoreComment('${c.id}')">Restore</button>`
                    : `
                        <button onclick="EditComment('${c.id}')">Edit</button>
                        <button onclick="DeleteComment('${c.id}')">Delete</button>
                      `
                }
            </td>
        </tr>`;
    });
}

async function SaveComment() {
    const id = document.getElementById("c_id").value;
    const postId = document.getElementById("c_postId").value;
    const content = document.getElementById("c_content").value;

    if (!postId || !content) {
        alert("Nhập đủ dữ liệu");
        return;
    }

    if (id) {
        await fetch(`${COMMENT_API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, content })
        });
    } else {
        await fetch(COMMENT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
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
    const res = await fetch(`${COMMENT_API}/${id}`);
    const c = await res.json();

    document.getElementById("c_id").value = c.id;
    document.getElementById("c_postId").value = c.postId;
    document.getElementById("c_content").value = c.content;
}

async function DeleteComment(id) {
    if (!confirm("Xóa mềm comment này?")) return;

    await fetch(`${COMMENT_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });

    LoadComments();
}

async function RestoreComment(id) {
    await fetch(`${COMMENT_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });

    LoadComments();
}

function ClearCommentForm() {
    document.getElementById("c_id").value = "";
    document.getElementById("c_postId").value = "";
    document.getElementById("c_content").value = "";
}

/* =======================
   INIT
======================= */

LoadPosts();
LoadComments();
