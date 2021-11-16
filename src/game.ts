class Game{
    private callbacks: Array<(game: Game)=>void> = new Array<(game: Game) => void>();
    private change(){
        this.callbacks.forEach(callback => callback(this));
    }

    id?: string
    state?: string
    players?: Array<string>
    playerNr?: number

    setID(id: string){
        this.id = id;
        this.change();
    }

    setState(state: string){
        this.state = state;
        this.change();
    }

    setPlayers(players: Array<string>){
        this.players = players;
        this.change();
    }
    setPlayerNr(playerNr: number){
        this.playerNr = playerNr;
        this.change();
    }



    onChange(cb: (game: Game)=>void){
        this.callbacks.push(cb)
        cb(this);
    }
}
export const game = new Game();

