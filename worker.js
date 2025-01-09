let intervalId = null;
let requestCount = 0;

// Lista di URL di file pesanti
const heavyFiles = [
    "http://ipv4.download.thinkbroadband.com/1GB.zip",   // 1 GB
    "http://ipv4.download.thinkbroadband.com/500MB.zip", // 500 MB
    "https://speed.hetzner.de/1GB.bin",                  // 1 GB
    "https://speed.hetzner.de/500MB.bin",                // 500 MB
    "https://via.placeholder.com/7680x4320"              // Immagine 8K
];

function startTest() {
    // Avvia il download dei file
    intervalId = setInterval(() => {
        for (let i = 0; i < 5; i++) { // Invia 5 richieste parallele
            const url = heavyFiles[Math.floor(Math.random() * heavyFiles.length)];

            // Aggiungi proxy CORS se necessario (per esempio se il server non supporta CORS)
            const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;

            fetch(proxyUrl, { cache: "no-store" }) // Disabilita la cache
                .then(() => {
                    requestCount++;
                    postMessage({ status: 'Attivo', count: requestCount });
                })
                .catch(err => {
                    console.error("Errore durante il fetch:", err);
                });
        }
    }, 100); // Ogni 100ms
}

function stopTest() {
    // Ferma l'intervallo
    clearInterval(intervalId);
    postMessage({ status: 'Inattivo', count: requestCount });
}

// Riceve messaggi dal thread principale
onmessage = function(e) {
    if (e.data === 'start') {
        startTest();
    } else if (e.data === 'stop') {
        stopTest();
    }
};
