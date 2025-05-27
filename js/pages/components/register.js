// js/pages/register.js
import { registerUser } from '../js/api/auth.js'; // <-- AANGEPASTD: Correcte import van registerUser

const registerPage = {
    getHtml: () => {
        return `
            <div class="form-container">
                <h2>Registreer bij Vidigu</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label for="register-username">Gebruikersnaam:</label>
                        <input type="text" id="register-username" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">E-mailadres:</label>
                        <input type="email" id="register-email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Wachtwoord:</label>
                        <input type="password" id="register-password" required>
                    </div>
                    <button type="submit">Registreren</button>
                    <p class="error-message" id="register-error-message" style="color: red; margin-top: 10px;"></p>
                </form>
                <p>Heb je al een account? <a href="/login" data-nav-link="/login">Log hier in</a>.</p>
            </div>
        `;
    },
    run: () => {
        console.log('Registratie pagina geladen.');
        const form = document.getElementById('register-form');
        const usernameInput = document.getElementById('register-username');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        const errorMessage = document.getElementById('register-error-message');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = ''; // Wis vorige foutmeldingen

            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const response = await registerUser(username, email, password); // <-- AANGEPASTD: Directe aanroep
                console.log('Registratie succesvol:', response);
                alert('Registratie succesvol! Je kunt nu inloggen.');
                window.router.navigate('/login');
            } catch (error) {
                errorMessage.textContent = error.message || 'Onbekende registratiefout.';
            }
        });
    }
};

// <-- AANGEPASTD: Deze regel is verwijderd (was: window.registerPage = registerPage;)