export const postRegister = async (username, email, password) => {
    const userData = { username: username.value, email: email.value, password: password.value }

    try {
        const response = await fetch("http://localhost:3002/api/users/register-web", {
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
        const response = await fetch("http://localhost:3002/api/users/login-web", {
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

export async function loadUserData(email) {
    try {
        return await fetch('http://localhost:3002/api/users/user-data', {
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

export const getMods = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/mods');

        return response;
    } catch (err) {
        console.error('Error cargando mods:', err);
    }
}

export const getMod = async (id) => {
    return await fetch(`http://localhost:3002/api/mods/${id}`);
}

export const postMod = async (formData) => {
    try {
        const response = await fetch('http://localhost:3002/api/mods/new-mod', {
        method: 'POST',
        body: formData,
        });

        return response;
    } catch (error) {
        console.error('Error al subir mod:', error);
    }
}

export const putMod = async (formData) => {
    try {
        return await fetch('http://localhost:3002/api/mods/update-mod', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formData
        });
    } catch (error) {
        console.error('Error al subir actulizar mod:', error);
    }
}

export const putVisible = async (modId, visible) => {
    try {
        return await fetch('http://localhost:3002/api/mods/update-visible', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: modId, visible })
        });
    } catch (error) {
        console.error('Error al actualizar la visibilidad del mod:', error);
    }
}

export const getAllComments = async () => {
    return await fetch(`http://localhost:3002/api/comments`);
}

export const getCommentsById = async (modId) => {
    return await fetch(`http://localhost:3002/api/comments/${modId}`);
}

export const postComment = async (newComment) => {
    await fetch('http://localhost:3002/api/comments/new-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment.value)
    });
}

export const postDownload = async (modId) => {
    await fetch(`http://localhost:3002/api/mods/download/${modId}`);
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

export const getModStats = async (modId) => {
    try {
        const response = await fetch(`http://localhost:3002/api/mods/stats/${modId}`);
        return response;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
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