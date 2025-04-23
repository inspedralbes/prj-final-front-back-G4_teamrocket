export async function postRegister(username, email, password) {
    const userData = { username, email, password }

    try {
        const response = await fetch("http://localhost:3002/api/users/register-web", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Establece que el cuerpo de la solicitud será en formato JSON
            body: JSON.stringify(userData), // Convierte los datos del usuario a JSON
        });
    } catch (err) {
        console.log(err);
    } finally {
        console.log(response);
    }
}