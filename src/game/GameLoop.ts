/**
 * Die GameLoop ist eine Schleife welche 40 mal die Sekunde aufgerufen wird.
 * Hier wird die Spiellogik verarbeitet und das Bild gezeichnet.
 */
class GameLoop {

    private interval: any;
    private callbacks: any[] = [];
    private ticks: number = 0;

    /**
     * Starte die GameLoop, falls möglich
     */
    start() {
        if (this.interval != null) {
            return;
        }

        this.interval = setInterval(() => {
            this.callbacks.forEach(e => e(this.ticks));
            this.ticks++;
        }, (1000 / 20));
    }

    /**
     * Stoppe die GameLoop, falls möglich
     */
    stop() {
        if (this.interval == null)
            return;

        clearTimeout(this.interval);

        this.interval = null;
    }

    injectCallback(callback: any) {
        this.callbacks.push(callback);
    }

    ejectCallbacks() {
        this.callbacks.splice(0, this.callbacks.length)
    }
}

export let gameLoop = new GameLoop();