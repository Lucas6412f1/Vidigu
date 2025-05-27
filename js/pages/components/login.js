// js/pages/login.js
import { loginUser } from '../js/api/auth.js'; // <-- AANGEPAST: Correcte import van loginUser

const loginPage = {
    getHtml: () => {
        return `
            <div class="form-container">
                <h2>Inloggen bij Vidigu</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-email">E-mailadres:</label>
                        <input type="email" id="login-email" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Wachtwoord:</label>
                        <input type="password" id="login-password" required>
                    </div>
                    <button type="submit">Inloggen</button>
                    <p class="error-message" id="login-error-message" style="color: red; margin-top: 10px;"></p>
                </form>
                <p>Nog geen account? <a href="/register" data-nav-link="/register">Registreer hier</a>.</p>
            </div>
        `;
    },
    run: () => {
        console.log('Login pagina geladen.');
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const errorMessage = document.getElementById('login-error-message');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = ''; // Wis vorige foutmeldingen

            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const response = await loginUser(email, password); // <-- AANGEPASTD: Directe aanroep
                console.log('Login succesvol:', response);
                window.router.navigate('/dashboard'); // Navigeer naar dashboard of home na login
            } catch (error) {
                errorMessage.textContent = error.message || 'Onbekende inlogfout.';
            }
        });
    }
};

// <-- AANGEPASTD: Deze regel is verwijderd (was: window.loginPage = loginPage;)