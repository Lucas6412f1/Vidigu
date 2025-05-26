// js/api/auth.js
const API_BASE_URL = 'http://localhost:3000/api/auth'; // <--- BELANGRIJK: VERVANG DIT LATER DOOR JE RENDER BACKEND URL!

/**
 * Registreert een nieuwe gebruiker.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} De responsdata van de API.
 */
async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registratie mislukt');
        }
        return data;
    } catch (error) {
        console.error('Fout bij registreren:', error);
        throw error;
    }
}

/**
 * Logt een gebruiker in.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} De responsdata (inclusief token).
 */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login mislukt');
        }
        
        // Sla token op in localStorage en update appState
        localStorage.setItem('token', data.token);
        window.appState.token = data.token;
        window.updateAuthUI(); // Trigger UI update in main.js

        // Stuur een custom event om andere delen van de app te laten weten dat de auth status is veranderd
        window.dispatchEvent(new Event('authStatusChanged'));

        return data;
    } catch (error) {
        console.error('Fout bij inloggen:', error);
        throw error;
    }
}

// Maak API-functies globaal beschikbaar
window.authApi = {
    registerUser,
    loginUser
};