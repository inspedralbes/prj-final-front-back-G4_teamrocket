const urlBackend = "https://darknessunseen.dam.inspedralbes.cat";

export const postRegister = async (username, email, password) => {
    const userData = { username: username.value, email: email.value, password: password.value }

    try {
        return await fetch(urlBackend + "/api/users/register-web", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
    } catch {
        return null;
    }
}

export const postLogin = async (email, password) => {
    const userData = { email: email.value, password: password.value };

    try {
        return await fetch(urlBackend + "/api/users/login-web", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
    } catch {
        return null;
    }
}

export const loadUserData = async (email) => {
    try {
        return await fetch(urlBackend + '/api/users/user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
    } catch {
        return null;
    }
}

export const putUserProfile = async (formData, userId) => {
    try {
        return await fetch(urlBackend + `/api/users/update-perfil/${userId}`, {
            method: 'PUT',
            body: formData
        });
    } catch {
        return null;
    }
}

export const getUsersAdmin = async () => {
    try {
        return await fetch(urlBackend + '/api/users', {
            method: 'GET'
        });
    } catch {
        return null;
    }   
}

export const deleteUserAdmin = async (userId) => {
    try {
        return await fetch(urlBackend + `/api/users/delete-user/${userId}`, {
            method: 'DELETE',
        });
    } catch {
        return null;
    }   
}

export const changeUserAdmin = async (userId) => {
    try {
        return await fetch(urlBackend + `/api/users/toggle-admin/${userId}`, {
            method: 'PATCH',
        });
    } catch {
        return null;
    }
}

export const getAllMods = async () => {
    try {
        return await fetch(urlBackend + '/api/mods', {
            method: 'GET',
        });
    } catch {
        return null;
    }
}

export const getModsAdmin = async () => {
    try {
        return await fetch(urlBackend + '/api/mods/admin-mods', {
            method: 'GET'
        });
    } catch {
        return null;
    }   
}

export const getMod = async (id) => {
    try {
        return await fetch(urlBackend + `/api/mods/${id}`, {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

export const postMod = async (formData) => {
    try {
        return await fetch(urlBackend + '/api/mods/new-mod', {
            method: 'POST',
            body: formData,
        });
    } catch {
        return null;
    }
}

export const putMod = async (formData) => {
    try {
        return await fetch(urlBackend + '/api/mods/update-mod', {
            method: 'PUT',
            body: formData
        });
    } catch {
        return null;
    }
}

export const deleteModSequelize = async (modId) => {
    try {
        return await fetch(urlBackend + `/api/mods/delete-mod/${modId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return null
    }
}

export const patchDownloadMod = async (modId) => {
    try {
        return await fetch(urlBackend + `/api/mods/download/${modId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return null;
    }
}

export const changeVisible = async (modId) => {
    try {
        return await fetch(urlBackend + `/api/mods/change-visible/${modId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return null;
    }
}

export const changeSecurity = async (modId) => {
    try {
        return await fetch(urlBackend + `/api/mods/security/${modId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
    } catch {
        return null;
    }
}

export const getAllComments = async () => {
    try {
        return await fetch(urlBackend + '/api/comments', {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

export const getCommentsById = async (modId) => {
    try {
        return await fetch(urlBackend + `/api/comments/${modId}`, {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

export const postComment = async (newComment) => {
    try {
        return await fetch(urlBackend + '/api/comments/new-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment.value)
        });
    } catch {
        return null;
    }
}

export const putComment = async (commentId, newContent) => {
    try {
        return await fetch(urlBackend + '/api/comments/update-comment', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commentId, newContent })
        })
    } catch {
        return null;
    }
}

export const deleteCommentMongodb = async (commentId) => {
    try {
        return await fetch(urlBackend + `/api/comments/delete-comment/${commentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return null;
    }
}

export const getAllLikes = async () => {
    try {
        return await fetch(urlBackend + '/api/likes', {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

export const postLike = async (modId, email) => {
    try {
        return await fetch(urlBackend + '/api/likes/new-like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modId, email })
        });
    } catch {
        return null;
    }
}

export const deleteLike = async (modId, email) => {
    try {
        return await fetch(urlBackend + '/api/likes/delete-like', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modId, email })
        });
    } catch {
        return null;
    }
}

export const getStats = async () => {
    try {
        return await fetch(urlBackend + '/api/stats/stats-mods', {
            method: 'GET'
        });
    } catch {
        return null;
    }
}