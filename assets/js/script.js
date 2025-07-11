const version = "0.8.0b";
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const postForm = document.getElementById('postForm');
const postTxtInput = document.getElementById('postinput');
const postBtn = document.getElementsByClassName('postbutton')[0];
const postsDiv = document.getElementById('postlist');
let currentUserId = null;

// Simple client-side password hashing (for demo purposes; prefer server-side hashing)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function openTab(tabName) {
    const tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
console.log(process.env)
}

// Register new user
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value;

    try {
        const hashedPassword = await hashPassword(password);
        const response = await fetch(`${baseURL}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ username, email, password: hashedPassword })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please log in.');
            openTab('Login');
        } else {
            console.error('Registration error:', data);
            alert(`Registration failed: ${data.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Registration fetch error:', error);
        alert('An error occurred during registration.');
    }
});

// Login user
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const hashedPassword = await hashPassword(password);
        const userResponse = await fetch(`${baseURL}users?select=id,username,email&username=eq.${encodeURIComponent(username)}&password=eq.${hashedPassword}`, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        const users = await userResponse.json();
        if (!userResponse.ok || users.length === 0) {
            console.error('User fetch error:', users);
            alert('Login failed: Invalid username or password');
            return;
        }

        const user = users[0];
        localStorage.setItem('loginToken', user.id); // Store user ID
        currentUserId = user.id;
        const loggedas = document.getElementById('currentuser');
        const profileBtn = document.getElementsByClassName('profileSideBtn')[0];
        const loginBtn = document.getElementsByClassName('loginSideBtn')[0];
        const registerBtn = document.getElementsByClassName('registerSideBtn')[0];
        loggedas.innerHTML = user.username;
        postTxtInput.placeholder = "Write your post...";
        postTxtInput.disabled = false;
        postBtn.disabled = false;
        profileBtn.style.display = "block";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        alert('Login successful!');
        loadPosts();
    } catch (error) {
        console.error('Login fetch error:', error);
        const profileBtn = document.getElementsByClassName('profileSideBtn')[0];
        postTxtInput.placeholder = "You must be signed in to write a post.";
        postTxtInput.disabled = true;
        postBtn.disabled = true;
        profileBtn.style.display = "none";
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        alert('Login failed: An error occurred.');
        loadPosts();
    }
});

// Prevent single and double quotes in post input
postTxtInput.addEventListener("input", () => {
    postTxtInput.value = postTxtInput.value.replaceAll("'", "").replaceAll('"', "");
});

// Create a new post
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const post = postTxtInput.value;
    const timestamp = new Date().toISOString();
    const token = localStorage.getItem('loginToken');

    if (!token || !currentUserId) {
        alert('You must be logged in to post.');
        return;
    }

    try {
        const postResponse = await fetch(`${baseURL}posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ user_id: currentUserId, post, timestamp })
        });

        if (postResponse.ok) {
            postTxtInput.value = '';
            loadPosts();
        } else {
            const errorData = await postResponse.json();
            console.error('Post error:', errorData);
            alert(`Failed to post: ${errorData.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Post fetch error:', error);
        alert('An error occurred while posting.');
    }
});

// Load posts
async function loadPosts() {
    const token = localStorage.getItem('loginToken');
    const postsDiv = document.getElementById('postlist');

    try {
        const response = await fetch(`${baseURL}posts?select=*,users(username,profile_pic,bio)&order=timestamp.desc`, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Fetch posts error:', errorData);
            throw new Error(`Failed to fetch posts: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        postsDiv.innerHTML = !data || data.length === 0
            ? `<div class="post"><p>No posts available.</p></div>`
            : data.map(post => {
                const date = new Date(post.timestamp);
                const readableDate = date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                return `
                <div class="post" id="post-${post.id}">
                    <p>
                        <div class="profileInfo">
                            <img class="profilePicture" src="${post.users?.profile_pic || "assets/img/defaultPfp.png"}" alt="${post.users?.username || 'Unknown'}'s profile picture" height="32" width="32">
                            <strong class="username" data-user-id="${post.user_id}">${post.users?.username || 'Unknown'}</strong><br>
                            <span class="bio" data-user-id="${post.user_id}">Bio: ${post.users?.bio || "No bio available"}</span><br>
                        </div>
                        <a class="postContent">${post.post}</a>
                        <br>
                        <small class="timestamp">${readableDate}</small>
                    </p>
                    ${post.user_id === currentUserId && token ? `
                        <div class="button-container">
                            <button class="editBtn" onclick="showEditForm('${post.id}', \`${post.post.replace(/'/g, "\\'")}\`)">Edit</button>
                            <button class="delBtn" onclick="deletePost('${post.user_id}', '${post.id}')">Delete</button>
                        </div>
                        <div class="edit-form" id="edit-form-${post.id}" style="display: none;">
                            <input type="text" class="editPostInpt" id="edit-input-${post.id}" value="${post.post.replace(/'/g, "\\'")}"><br>
                            <button class="updPostBtn" onclick="updatePost('${post.user_id}', '${post.id}')">Save</button>
                            <button class="cncledtBtn" onclick="cancelEdit('${post.id}')">Cancel</button>
                        </div>
                    ` : ''}
                </div>
                `;
            }).join('');
    } catch (error) {
        console.error('Load posts error:', error);
        postsDiv.innerHTML = `<div class="post"><p>Failed to load posts: ${error.message}</p></div>`;
    }
}

// Show edit form
function showEditForm(postId, currentPost) {
    const editForm = document.getElementById(`edit-form-${postId}`);
    if (editForm) editForm.style.display = 'block';
}

// Cancel edit
function cancelEdit(postId) {
    const editForm = document.getElementById(`edit-form-${postId}`);
    if (editForm) editForm.style.display = 'none';
}

// Update post
async function updatePost(userId, postId) {
    const editedPost = document.getElementById(`edit-input-${postId}`)?.value;
    const token = localStorage.getItem('loginToken');

    if (!token || !currentUserId) {
        alert('You must be logged in to edit posts.');
        return;
    }

    try {
        const response = await fetch(`${baseURL}posts?id=eq.${postId}&user_id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ post: editedPost })
        });

        if (response.ok) {
            alert('Post updated successfully!');
            loadPosts();
        } else {
            const errorData = await response.json();
            console.error('Update post error:', errorData);
            alert(`Failed to update post: ${errorData.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Update post fetch error:', error);
        alert('An error occurred while updating the post.');
    }
}

// Delete post
async function deletePost(userId, postId) {
    const token = localStorage.getItem('loginToken');

    if (!token || !currentUserId) {
        alert('You must be logged in to delete posts.');
        return;
    }

    try {
        const response = await fetch(`${baseURL}posts?id=eq.${postId}&user_id=eq.${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (response.ok) {
            alert('Post deleted successfully!');
            loadPosts();
        } else {
            const errorData = await response.json();
            console.error('Delete post error:', errorData);
            alert(`Failed to delete post: ${errorData.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Delete post fetch error:', error);
        alert('An error occurred while deleting the post.');
    }
}

// Update bio function
async function updateBio(userId, token, bio) {
    if (!token || !userId) {
        alert('You must be logged in to update your bio.');
        return false;
    }

    if (!bio.trim()) {
        return true; // Skip update if bio is empty
    }

    try {
        const response = await fetch(`${baseURL}users?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ bio })
        });

        if (response.ok) {
            alert('Bio updated successfully!');
            loadPosts();
            return true;
        } else {
            const errorData = await response.json();
            console.error('Update bio error:', errorData);
            alert(`Failed to update bio: ${errorData.error?.message || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.error('Update bio fetch error:', error);
        alert('An error occurred while updating the bio.');
        return false;
    }
}

// Update profile picture function
async function updateProfilePic(userId, token, profilePicInput) {
    if (!token || !userId) {
        alert('You must be logged in to update your profile picture.');
        return false;
    }

    if (!profilePicInput.files || profilePicInput.files.length === 0) {
        return true; // Skip update if no file is selected
    }

    const file = profilePicInput.files[0];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            const profilePicToUpdate = reader.result;
            try {
                const response = await fetch(`${baseURL}users?id=eq.${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({ profile_pic: profilePicToUpdate })
                });

                if (response.ok) {
                    alert('Profile picture updated successfully!');
                    loadPosts();
                    resolve(true);
                } else {
                    const errorData = await response.json();
                    console.error('Update profile picture error:', errorData);
                    alert(`Failed to update profile picture: ${errorData.error?.message || 'Unknown error'}`);
                    reject(false);
                }
            } catch (error) {
                console.error('Update profile picture fetch error:', error);
                alert('An error occurred while updating the profile picture.');
                reject(false);
            }
        };
        reader.readAsDataURL(file);
    });
}

// Form submission handler
document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bio = document.getElementById('bio').value;
    const profilePicInput = document.getElementById('profilePic');
    const userId = currentUserId;
    const token = localStorage.getItem('loginToken');

    let bioUpdated = false;
    let profilePicUpdated = false;

    // Update bio if provided
    if (bio.trim()) {
        bioUpdated = await updateBio(userId, token, bio);
    }

    // Update profile picture if a file is selected
    if (profilePicInput.files && profilePicInput.files.length > 0) {
        profilePicUpdated = await updateProfilePic(userId, token, profilePicInput);
    }

    // Provide feedback if no updates were made
    if (!bioUpdated && !profilePicUpdated && !bio.trim() && (!profilePicInput.files || profilePicInput.files.length === 0)) {
        alert('No changes to update. Please provide a bio or select a profile picture.');
    }
});

function signOut() {
    const loggedas = document.getElementById('currentuser');
    const profileBtn = document.getElementsByClassName('profileSideBtn')[0];
    const loginBtn = document.getElementsByClassName('loginSideBtn')[0];
    const registerBtn = document.getElementsByClassName('registerSideBtn')[0];
    postTxtInput.placeholder = "You must be signed in to write a post.";
    postTxtInput.disabled = true;
    postBtn.disabled = true;
    profileBtn.style.display = "none";
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    loggedas.innerText = "Guest";
    currentUserId = null;
    localStorage.setItem('loginToken', '');
    openTab('Home');
    alert('Log out successful');
    loadPosts();
}

// Custom alert
window.alert = (msg) => {
    $('.alertxt').text(msg);
    $('#alert').css('animation', 'fadeIn 0.3s linear').css('display', 'inline');
    setTimeout(() => $('#alert').css('animation', 'none'), 300);
};

$(() => {
    $('.confirmAlertButton').click(() => {
        $('#alert').css('animation', 'fadeOut 0.3s linear');
        setTimeout(() => $('#alert').css('animation', 'none').css('display', 'none'), 300);
    });
});

window.onload = () => {
    const profileBtn = document.getElementsByClassName('profileSideBtn')[0];
    postTxtInput.placeholder = "You must be signed in to write a post.";
    postTxtInput.disabled = true;
    postBtn.disabled = true;
    loadPosts();
    setInterval(loadPosts, 10000);
    document.getElementById('versionstring').innerHTML = `Version ${version} - Kit Studios 2025`;
};