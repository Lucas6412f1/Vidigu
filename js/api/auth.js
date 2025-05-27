// frontend/api/auth.js

const API_BASE_URL = 'https://vidigu-backend.onrender.com/api';

async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registratie mislukt');
        return data;
    } catch (error) {
        console.error('Fout bij registreren:', error.message);
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login mislukt');

        // Token opslaan voor latere authenticatie
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Fout bij login:', error.message);
        throw error;
    }
}

export { registerUser, loginUser };
