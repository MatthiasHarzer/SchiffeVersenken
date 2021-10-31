
class Network{

    createGame = (): string =>{
        return "id"
    }
    joinGame = (gameId: string): string =>{
        return  "status"
    }
    sendData = (data: Map<any, any>) =>{
        //->
    }
    onReceive = (type_: string, callback: ()=>Map<string, any> ) => {

    }
}

export const network =  new Network();
