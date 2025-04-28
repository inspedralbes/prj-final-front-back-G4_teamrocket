export async function postRegister(username, email, password) {
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

export async function postLogin(email, password) {
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

export async function getMods() {
    try {
        const response = await fetch('http://localhost:3002/api/mods');

        return response;
    } catch (err) {
        console.error('Error cargando mods:', err);
    }
}

export async function postMod(formData) {
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

export async function loadUserData(email) {
    console.log(email);
    try {
        const response = await fetch('http://localhost:3002/api/users/user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        return response;
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
    }
}