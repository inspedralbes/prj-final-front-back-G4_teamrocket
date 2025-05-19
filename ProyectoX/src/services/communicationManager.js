const urlBackend = "http://localhost:3002";

// Hecho
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

// Hecho
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

// Hecho
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

// Hecho
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
        const response = await fetch('http://localhost:3002/api/users');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
       const data = await response.json();
       return data.users;
    } catch (err) {
        console.error('Error cargando mods de administrador:', err);
        throw err; // Re-lanzar el error para manejo posterior
    }   
}

export const deleteUserAdmin = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3002/api/users/delete-user/${userId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    } catch (err) {
        console.error('Error cargando mods de administrador:', err);
        throw err; // Re-lanzar el error para manejo posterior
    }   
}

export const changeUserAdmin = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3002/api/users/toggle-admin/${userId}`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    } catch (err) {
        console.error('Error cargando mods de administrador:', err);
        throw err; // Re-lanzar el error para manejo posterior
    }
}

// Hecho
export const getAllMods = async () => {
    try {
        return await fetch(urlBackend + '/api/mods', {
            method: 'GET',
        });
    } catch (err) {
        return null;
    }
}

export const getModsAdmin = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/mods/admin-mods');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data.mods
    } catch (err) {
        console.error('Error cargando mods de administrador:', err);
        throw err; // Re-lanzar el error para manejo posterior
    }   
}

// Hecho
export const getMod = async (id) => {
    try {
        return await fetch(urlBackend + `/api/mods/${id}`, {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

// Hecho
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

//Hecho
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

// Hecho
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

// Hecho
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

// Hecho
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

// Hecho
export const getAllComments = async () => {
    try {
        return await fetch(urlBackend + '/api/comments', {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

// Hecho
export const getCommentsById = async (modId) => {
    try {
        return await fetch(urlBackend + `/api/comments/${modId}`, {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

// Hecho
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

// Hecho
export const putComment = async (commentId, newContent) => {
    try {
        return await fetch('http://localhost:3002/api/comments/update-comment', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commentId, newContent })
        })
    } catch {
        return null;
    }
}

// Hecho
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

// Hecho
export const getAllLikes = async () => {
    try {
        return await fetch(urlBackend + '/api/likes', {
            method: 'GET'
        });
    } catch {
        return null;
    }
}

// Hecho
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

// Hecho
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

export const getModStats = async (modId) => {
    try {
        const response = await fetch(`http://localhost:3002/api/mods/stats/${modId}`);
        return response;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
}