// router.js
const routes = {
    '/': 'home',
    '/login': 'login',
    '/register': 'register',
    '/channel/:username': 'channel', // Voorbeeld: /channel/janedoe
    '/profile/:username': 'profile', // Optionele profielpagina
    '/dashboard': 'dashboard' // Streamer dashboard
};

/**
 * Laadt de content voor een specifieke route.
 * @param {string} path De URL-path.
 * @param {object} params URL-parameters (bijv. { username: 'janedoe' }).
 */
function loadContent(path, params = {}) {
    const appContainer = document.getElementById('app');
    let pageHtml = ''; // Hier komt de HTML-string voor de pagina
    let pageScript;    // Hier komt de functie die de paginalogica uitvoert

    // Haal de juiste pagina-functie op
    switch (path) {
        case '/':
            // Zorg ervoor dat 'homePage' gedefinieerd is in pages/components/home.js
            pageHtml = homePage.getHtml(); 
            pageScript = homePage.run;
            break;
        case '/login':
            // Zorg ervoor dat 'loginPage' gedefinieerd is in pages/components/login.js
            pageHtml = loginPage.getHtml();
            pageScript = loginPage.run;
            break;
        case '/register':
            // Zorg ervoor dat 'registerPage' gedefinieerd is in pages/components/register.js
            pageHtml = registerPage.getHtml();
            pageScript = registerPage.run;
            break;
        case '/channel/:username':
            // Zorg ervoor dat 'channelPage' gedefinieerd is in pages/components/channel.js
            pageHtml = channelPage.getHtml();
            pageScript = channelPage.run;
            break;
        case '/dashboard':
            // Controleer of gebruiker streamer is voordat dashboard getoond wordt
            if (!window.appState || !window.appState.isAuthenticated || window.appState.user.role !== 'streamer') {
                router.navigate('/'); // Terug naar home als niet geautoriseerd
                return;
            }
            // Voor nu een simpele placeholder, later een echte dashboard pagina
            pageHtml = `<h2>Streamer Dashboard</h2><p>Hier komt de functionaliteit voor streamers.</p>`;
            pageScript = () => console.log('Dashboard loaded'); // Geen specifieke JS nu
            break;
        case '/profile/:username':
            pageHtml = `<h2>Profiel van ${params.username}</h2><p>Hier komt de profielinformatie.</p>`;
            pageScript = () => console.log(`Profile ${params.username} loaded`);
            break;
        default:
            pageHtml = `<h2>Pagina niet gevonden</h2><p>De pagina ${path} kon niet worden gevonden.</p>`;
            pageScript = () => console.log('404 Page loaded');
            break;
    }

    // Update de DOM en voer de paginalogica uit
    if (appContainer) { // Voeg een check toe voor appContainer
        appContainer.innerHTML = pageHtml;
        // Roep de 'run' functie van de pagina aan om event listeners te koppelen etc.
        if (pageScript) {
            pageScript(params); // Geef parameters door aan de paginalogica
        }
    } else {
        console.error("App container met ID 'app' niet gevonden.");
    }
}

/**
 * Navigeert naar een nieuwe URL en laadt de content.
 * @param {string} path De nieuwe URL path.
 */
function navigate(path) {
    history.pushState(null, '', path);
    handleLocation();
}

/**
 * Bepaalt welke content geladen moet worden op basis van de huidige URL.
 */
function handleLocation() {
    // De basis-URL van je GitHub Pages repository (de naam van je repository)
    const BASE_PATH = '/Vidigu'; 
    
    // Verwijder de basis-path van de URL
    let path = window.location.pathname;
    if (path.startsWith(BASE_PATH)) {
        path = path.substring(BASE_PATH.length);
    }
    
    // Zorg ervoor dat de path '/' is als deze leeg is na het verwijderen van de basis-path
    if (path === '') {
        path = '/';
    }

    let matched = false;

    for (const routePath in routes) {
        // Regex voor het matchen van routes met parameters
        // De regex moet de BASE_PATH niet meer bevatten, aangezien die al is verwijderd uit 'path'
        const regex = new RegExp(`^${routePath.replace(/:\w+/g, '([^/]+)')}$`);
        const match = path.match(regex);

        if (match) {
            const paramNames = (routePath.match(/:(\w+)/g) || []).map(p => p.substring(1));
            const params = {};
            paramNames.forEach((name, index) => {
                params[name] = match[index + 1];
            });

            loadContent(routePath, params);
            matched = true;
            break;
        }
    }

    if (!matched) {
        // Als geen enkele route matcht, laad dan de 404 pagina
        // We moeten hier '/404' doorgeven, omdat de 'default' case daarop gebaseerd is
        loadContent('/404'); 
    }
}

// Initialiseer de router bij het laden van de pagina
function initRouter() {
    window.addEventListener('popstate', handleLocation); // Voor browser back/forward knoppen
    handleLocation(); // Laad de initiële pagina
}

// Maak de router functies globaal beschikbaar
window.router = {
    init: initRouter,
    navigate: navigate
};