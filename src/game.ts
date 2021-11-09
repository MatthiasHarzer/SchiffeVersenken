class Game{
    private callbacks: Array<(game: Game)=>void> = new Array<(game: Game) => void>();
    private change(){
        this.callbacks.forEach(callback => callback(this));
    }

    id?: string
    state?: string

    setID(id: string){
        this.id = id;
        this.change();
    }

    setState(state: string){
        this.state = state;
        this.change();
    }



    onChange(cb: (game: Game)=>void){
        this.callbacks.push(cb)
        cb(this);
    }
}
export const game = new Game();

