// Hoofd applicatielogica voor Vidigu

const app = document.getElementById('app');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');
const navDashboard = document.getElementById('nav-dashboard');
const navLogout = document.getElementById('nav-logout');

// Globale state (simpele variant voor dit project)
const appState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token') // Probeer token te laden bij opstarten
};

/**
 * Updates de navigatiebalk op basis van de authenticatiestatus.
 */
function updateAuthUI() {
    if (appState.token) {
        // Controleer of token nog geldig is (optioneel: roep backend API aan)
        appState.isAuthenticated = true;
        // Voor dit voorbeeld, decodeer token voor username (in echt project: valideer bij backend)
        try {
            const payload = JSON.parse(atob(appState.token.split('.')[1])); // Decode JWT payload
            appState.user = { username: payload.username, role: payload.role };
        } catch (e) {
            console.error("Ongeldige token:", e);
            appState.token = null;
            appState.isAuthenticated = false;
            appState.user = null;
            localStorage.removeItem('token');
        }
    } else {
        appState.isAuthenticated = false;
        appState.user = null;
    }

    if (appState.isAuthenticated) {
        navLogin.style.display = 'none';
        navRegister.style.display = 'none';
        navDashboard.style.display = 'inline'; // Of 'block' afhankelijk van CSS
        navLogout.style.display = 'inline'; // Of 'block'
        navDashboard.textContent = `Welkom, ${appState.user.username}`; // Optioneel
        navDashboard.href = `/profile/${appState.user.username}`; // Link naar profiel
    } else {
        navLogin.style.display = 'inline';
        navRegister.style.display = 'inline';
        navDashboard.style.display = 'none';
        navLogout.style.display = 'none';
    }
}

/**
 * Handelt uitloggen af.
 */
navLogout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    appState.token = null;
    updateAuthUI();
    router.navigate('/'); // Navigeer naar homepagina na uitloggen
});

// Initialiseer de UI en router wanneer de DOM volledig is geladen
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI(); // Update UI direct bij laden
    router.init(); // Start de router
});

// Zorg ervoor dat de UI wordt geüpdatet na een login/registratie
window.addEventListener('authStatusChanged', updateAuthUI);

// Event listener voor navigatielinks (voor SPA-gedrag)
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-nav-link]');
    if (target && target.tagName === 'A') {
        e.preventDefault();
        router.navigate(target.getAttribute('href'));
    }
});

// Maak appState en updateAuthUI globaal beschikbaar
window.appState = appState;
window.updateAuthUI = updateAuthUI;