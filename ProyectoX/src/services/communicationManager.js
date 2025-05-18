const urlBackend = "http://localhost:3002";

export const postRegister = async (username, email, password) => {
    const userData = { username: username.value, email: email.value, password: password.value }

    try {
        const response = await fetch(urlBackend + "/api/users/register-web", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Establece que el cuerpo de la solicitud será en formato JSON
            body: JSON.stringify(userData), // Convierte los datos del usuario a JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtenir les dades');
        }

        alert("Success");

    } catch (err) {
        console.log(err);
    }
}

export const postLogin = async (email, password) => {
    const userData = { email: email.value, password: password.value };

    try {
        return await fetch("http://localhost:3002/api/users/login-web", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Establece que el cuerpo de la solicitud será en formato JSON
            body: JSON.stringify(userData), // Convierte los datos del usuario a JSON
        });
    } catch (err) {
        console.log(err);
    }
}

export async function loadUserData(email) {
    try {
        return await fetch(urlBackend + '/api/users/user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
}

export const putUserProfile = async (formData) => {
    return await fetch('http://localhost:3002/api/users/update-perfil', {
        method: 'PUT',
        body: formData
    });
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

export const getMod = async (id) => {
    return await fetch(`http://localhost:3002/api/mods/${id}`);
}

// Hecho
export const postMod = async (formData) => {
    try {
        return await fetch(urlBackend + '/api/mods/new-mod', {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        return null;
    }
}

// Hecho
export const changeVisible = async (modId) => {
    try {
        return await fetch(`http://localhost:3002/api/mods/change-visible/${modId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return null;
    }
}

export const changeSecurity = async (modId) => {
    try {
        return await fetch(urlBackend + `/api/mods/security/${modId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return null;
    }
}

export const getAllComments = async () => {
    return await fetch(`http://localhost:3002/api/comments`);
}

export const getCommentsById = async (modId) => {
    return await fetch(`http://localhost:3002/api/comments/${modId}`);
}

export const postComment = async (newComment) => {
    return await fetch('http://localhost:3002/api/comments/new-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment.value)
    });
}

export const putComment = async (commentId, newContent) => {
    return await fetch('http://localhost:3002/api/comments/update-comment', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ commentId: commentId, newContent: newContent })
    })
}

export const deleteCommentMongodb = async (commentId) => {
    return await fetch('http://localhost:3002/api/comments/delete-comment', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ commentId: commentId })
    });
}

export const getAllLikes = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/likes');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export const postLike = async (modId, email) => {
    try {
        const response = await fetch('http://localhost:3002/api/likes/new-like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modId, email })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export const deleteLike = async (modId, email) => {
    try {
        const response = await fetch('http://localhost:3002/api/likes/delete-like', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modId, email })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.log(err);
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