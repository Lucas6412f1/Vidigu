// js/pages/home.js
const homePage = {
    getHtml: () => {
        return `
            <section class="hero">
                <h1>Welkom bij Vidigu!</h1>
                <p>Jouw plek voor live educatieve streams over technologie en meer.</p>
                <button onclick="window.router.navigate('/register')">Begin Nu!</button>
            </section>
            <section class="stream-overview">
                <h2>Actieve Streams</h2>
                <div class="stream-grid" id="active-streams-grid">
                    <p>Laden van streams...</p>
                </div>
            </section>
        `;
    },
    run: async () => {
        console.log('Home pagina geladen.');
        const streamGrid = document.getElementById('active-streams-grid');
        // Simuleer laden van streams (later via API)
        const dummyStreams = [
            { id: 'dev-stream-1', title: 'Live Code Sessie: Frontend Basics', streamer: 'CoderGuy', viewers: 125, thumbnailUrl: 'https://via.placeholder.com/300x180?text=Code+Stream+1' },
            { id: 'data-science-2', title: 'Data Visualisatie met Python', streamer: 'DataNerd', viewers: 88, thumbnailUrl: 'https://via.placeholder.com/300x180?text=Data+Stream+2' },
            { id: 'cyber-security-3', title: 'Introductie tot Cyber Security', streamer: 'SecureMind', viewers: 200, thumbnailUrl: 'https://via.placeholder.com/300x180?text=Security+Stream+3' }
        ];

        streamGrid.innerHTML = dummyStreams.map(stream => `
            <div class="stream-card">
                <a href="/channel/${stream.streamer}" data-nav-link="/channel/${stream.streamer}">
                    <img src="${stream.thumbnailUrl}" alt="${stream.title}">
                    <div class="stream-card-info">
                        <h3>${stream.title}</h3>
                        <p>Streamer: ${stream.streamer}</p>
                        <p>Kijkers: ${stream.viewers}</p>
                    </div>
                </a>
            </div>
        `).join('');

        // Later: Echte API-aanroep om streams te laden
        // const streams = await fetchStreamsApi();
        // updateStreamGrid(streams);
    }
};

// <-- AANGEPASTD: Deze regel is verwijderd (was: window.homePage = homePage;)