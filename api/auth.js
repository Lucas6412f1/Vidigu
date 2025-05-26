// frontend/api/auth.js

// Vervang 'https://vidigu-backend.onrender.com' met de werkelijke URL van jouw gedeployde Render backend
const API_BASE_URL = 'https://vidigu-backend.onrender.com/api';

async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registratie mislukt');
        }
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login mislukt');
        }
        return data;
    } catch (error) {
        console.error('Fout bij login:', error.message);
        throw error;
    }
}

// Exporteer de functies zodat ze in andere bestanden kunnen worden gebruikt
export { registerUser, loginUser };