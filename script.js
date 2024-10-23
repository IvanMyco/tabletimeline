const imageCount = 8;
const exclusionZoneWidth = 200;  // Larghezza della zona di esclusione attorno al mouse
const exclusionZoneHeight = 200; // Altezza della zona di esclusione attorno al mouse

document.querySelectorAll('tr').forEach(row => {
    let intervalId; // Variabile per tenere traccia dell'intervallo corrente

    row.addEventListener('mouseenter', (event) => {
        const year = row.querySelector('td').textContent.trim(); // Estrai l'anno dalla prima cella
        const container = document.querySelector('.image-container');

        // Cancella immagini e intervalli precedenti quando il mouse entra in una nuova riga
        clearInterval(intervalId);
        container.innerHTML = '';

        let zIndexCounter = 100; // Inizia con un valore z-index basso
        const delayIncrement = 1000; // Delay incrementale per l'entrata in millisecondi
        let currentDelay = 0;

        // Funzione per generare immagini in modo ciclico
        const startImageCycle = () => {
            for (let i = 0; i < imageCount; i++) {
                const img = document.createElement('img');
                img.src = `images/${year}/${i + 1}.jpg`;  // Percorso relativo senza slash iniziale
                img.classList.add('random-image');
                img.style.opacity = '0'; // Nascondi inizialmente l'immagine

                // Funzione per generare larghezza casuale tra 200 e 500px
                const randomizeSize = () => {
                    const randomWidth = Math.floor(Math.random() * 700) + 200;
                    img.style.width = `${randomWidth}px`;
                };

                // Gestione degli errori per immagini mancanti
                img.onerror = function() {
                    img.remove();  // Rimuovi l'immagine se non viene trovata
                };

                // Posizionamento casuale delle immagini
                const placeImageRandomly = () => {
                    const randomWidth = parseInt(img.style.width);
                    const maxTop = window.innerHeight - randomWidth - 20;
                    const maxLeft = window.innerWidth - randomWidth - 20;
                    let randomTop, randomLeft;

                    // Ottieni la posizione del cursore
                    const mouseX = event.clientX;
                    const mouseY = event.clientY;

                    // Genera una posizione casuale al di fuori della zona di esclusione attorno al mouse
                    do {
                        randomTop = Math.floor(Math.random() * maxTop);
                        randomLeft = Math.floor(Math.random() * maxLeft);
                    } while (
                        randomTop > mouseY - exclusionZoneHeight && randomTop < mouseY + exclusionZoneHeight &&
                        randomLeft > mouseX - exclusionZoneWidth && randomLeft < mouseX + exclusionZoneWidth
                    );

                    img.style.top = `${randomTop}px`;
                    img.style.left = `${randomLeft}px`;
                };

                // Posiziona casualmente l'immagine la prima volta e ogni volta che riappare
                randomizeSize(); // Imposta una dimensione casuale
                placeImageRandomly(); // Posiziona casualmente l'immagine
                container.appendChild(img);

                // Mostra l'immagine con un delay incrementale con effetto fade-in
                setTimeout(() => {
                    img.style.opacity = '1'; // Mostra l'immagine con dissolvenza
                }, currentDelay);

                // Aumenta il delay per l'immagine successiva
                currentDelay += delayIncrement;

                // Scomparsa delle immagini in ordine dopo un tempo specificato
                setTimeout(() => {
                    img.style.opacity = '0'; // Nascondi l'immagine con transizione
                    // Riposiziona l'immagine senza movimento visibile e cambia dimensione
                    randomizeSize(); // Cambia dimensione casuale ad ogni nuova entrata
                    placeImageRandomly(); // Riposiziona l'immagine
                }, currentDelay + (delayIncrement * 2)); // Aggiungi il doppio del delay per la scomparsa

                // Avvia il ciclo infinito per ogni immagine
                intervalId = setInterval(() => {
                    randomizeSize(); // Cambia dimensione casuale ad ogni nuova entrata
                    placeImageRandomly(); // Riposiziona l'immagine
                    img.style.opacity = '1'; // Riappare l'immagine con dissolvenza
                    setTimeout(() => {
                        img.style.opacity = '0'; // Scomparsa dell'immagine
                    }, delayIncrement * 2); // Tempo di visibilità prima della scomparsa
                }, (currentDelay + delayIncrement * 3)); // Ripeti ogni ciclo
            }
        };

        // Avvia il ciclo per la prima volta
        startImageCycle();
    });

    // Cancella immagini e intervalli quando il mouse lascia la riga
    row.addEventListener('mouseleave', () => {
        clearInterval(intervalId); // Cancella l'intervallo corrente
        const container = document.querySelector('.image-container');
        container.innerHTML = ''; // Rimuovi tutte le immagini
    });
});
