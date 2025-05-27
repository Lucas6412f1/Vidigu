// js/pages/channel.js
const channelPage = {
    getHtml: () => {
        return `
            <div class="channel-container">
                <div class="video-player-container">
                    <video id="videoPlayer" controls autoplay muted></video>
                    <h2 id="stream-title"></h2>
                    <p id="streamer-info"></p>
                </div>
                <div class="chat-container">
                    <h3>Live Chat</h3>
                    <div class="chat-messages" id="chat-messages">
                        </div>
                    <div class="chat-input">
                        <input type="text" id="chat-message-input" placeholder="Stuur een bericht...">
                        <button id="send-chat-button">Verstuur</button>
                    </div>
                </div>
            </div>
        `;
    },
    run: async (params) => {
        const streamerUsername = params.username;
        console.log(`Kanaal pagina geladen voor: ${streamerUsername}`);

        const videoPlayer = document.getElementById('videoPlayer');
        const streamTitle = document.getElementById('stream-title');
        const streamerInfo = document.getElementById('streamer-info');
        const chatMessagesDiv = document.getElementById('chat-messages');
        const chatMessageInput = document.getElementById('chat-message-input');
        const sendChatButton = document.getElementById('send-chat-button');

        // Simuleer het laden van stream details (later via API)
        // In een echt scenario zou je hier een API-aanroep doen naar je backend
        // om de actieve stream van deze streamer op te halen, inclusief de HLS URL.
        const dummyStream = {
            title: `Live Coder Sessie: ${streamerUsername} - JavaScript Mastery`,
            streamer: streamerUsername,
            // LET OP: Deze HLS URL 'http://localhost:8000' is voor je streaming server (bijv. NGINX-RTMP).
            // Deze heeft NIETS te maken met je Node.js backend op Render.
            // Als je later een live stream wilt hosten, moet deze URL naar die live stream server wijzen.
            hlsUrl: `http://localhost:8000/live/${streamerUsername}/index.m3u8`
        };

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(dummyStream.hlsUrl);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                videoPlayer.play();
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                console.error("HLS.js fout:", data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error("Netwerkfout, opnieuw proberen...");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error("Mediafout, opnieuw proberen...");
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = dummyStream.hlsUrl;
            videoPlayer.addEventListener('loadedmetadata', function() {
                videoPlayer.play();
            });
        } else {
            console.error('HLS niet ondersteund in deze browser.');
            videoPlayer.controls = true;
            videoPlayer.src = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Fallback voorbeeld
        }

        streamTitle.textContent = dummyStream.title;
        streamerInfo.textContent = `Live van: ${dummyStream.streamer}`;

        // --- Realtime Chat Logica ---
        let socket;

        // Controleer of gebruiker ingelogd is
        if (!window.appState.isAuthenticated) {
            chatMessageInput.placeholder = "Log in om te chatten...";
            chatMessageInput.disabled = true;
            sendChatButton.disabled = true;
            return; // Stop chat init als niet ingelogd
        }

        try {
            // DEZE URL MOET NAAR JE LIVE SOCKET.IO BACKEND WIJZEN
            socket = io('https://vidigu-backend.onrender.com', { // <--- Dit is de correcte URL
                auth: {
                    token: window.appState.token // Stuur JWT-token mee voor authenticatie
                }
            });

            socket.on('connect', () => {
                console.log('Verbonden met chat server');
                // Word lid van de chatroom voor dit kanaal
                socket.emit('joinRoom', streamerUsername);
            });

            socket.on('message', (message) => {
                const messageElement = document.createElement('p');
                messageElement.textContent = `${message.username}: ${message.text}`;
                // Optioneel: voeg styling toe op basis van rol (moderator, vip, streamer)
                if (message.role === 'moderator') messageElement.style.color = 'aqua';
                if (message.role === 'streamer') messageElement.style.color = 'yellow';
                if (message.isVip) messageElement.style.fontWeight = 'bold'; // Als VIP info meegegeven wordt

                chatMessagesDiv.appendChild(messageElement);
                chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // Scroll naar beneden
            });

            socket.on('chatHistory', (messages) => {
                chatMessagesDiv.innerHTML = ''; // Wis bestaande berichten
                messages.forEach(message => {
                    const messageElement = document.createElement('p');
                    messageElement.textContent = `${message.username}: ${message.text}`;
                    chatMessagesDiv.appendChild(messageElement);
                });
                chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
            });

            socket.on('disconnect', () => {
                console.log('Verbinding met chat server verbroken');
            });

            socket.on('error', (error) => {
                console.error('Socket.IO fout:', error);
            });

            sendChatButton.addEventListener('click', () => {
                const messageText = chatMessageInput.value.trim();
                if (messageText) {
                    socket.emit('sendMessage', {
                        room: streamerUsername,
                        text: messageText,
                        // Je backend voegt username en rol toe op basis van token
                    });
                    chatMessageInput.value = '';
                }
            });

            chatMessageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendChatButton.click();
                }
            });

        } catch (error) {
            console.error('Fout bij het opzetten van de chat:', error);
            chatMessageInput.placeholder = "Chat is niet beschikbaar.";
            chatMessageInput.disabled = true;
            sendChatButton.disabled = true;
        }

        // Zorg ervoor dat de socket wordt gesloten wanneer de gebruiker de pagina verlaat
        // (Bij navigatie naar andere SPA-pagina's)
        window.addEventListener('beforeunload', () => {
            if (socket) socket.disconnect();
        });
    }
};

// <-- AANGEPASTD: Deze regel is verwijderd (was: window.channelPage = channelPage;)