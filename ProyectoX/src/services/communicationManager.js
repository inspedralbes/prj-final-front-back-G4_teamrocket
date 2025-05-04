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