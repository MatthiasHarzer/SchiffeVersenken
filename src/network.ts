// tmep
const server_ip = "ws:\\127.0.0.1:4269";

const random_string = () => {
    return (Math.random() + 1).toString(36).substring(7);
};


class Network {
    private ws: WebSocket;
    private mid_cb: Map<string, (state: string) => void> = new Map<string, (state: string) => void>();
    private callbacks: Map<string, Array<any>> = new Map<string, Array<any>>();

    constructor() {
        this.ws = new WebSocket(server_ip);
        this.ws.onmessage = this.wsReceive;
        this.ws.onopen = this.wsConnected;
    }

    private wsReceive = (event: any) => {
        const data = JSON.parse(event.data);
        // console.log("RECEIVED: ", data, data?.mid, this.mid_cb, this.mid_cb.keys())
        // @ts-ignore
        data?.mid && this.mid_cb.get(data?.mid) && this.mid_cb.get(data?.mid)(data);

        this.dispatchEvent(data?.type, data);

    };
    private wsConnected = () => {
        this.dispatchEvent("SERVER_CONNECT");
    };
    private dispatchEvent = (eventName?: string, eventData?: any) => {
        if (eventName != null) {
            this.callbacks.get(eventName)?.forEach(cb => cb(eventData !== null ? eventData : {}));
        }
    };

    createGame = (): Promise<string> => new Promise((res, rej) => {
        const mid = random_string();
        const data = {
            type: "CREATE",
            mid: mid
        };
        this.mid_cb.set(mid, (data: any) => {
            // console.log("CALLED", state)
            res(data?.id);
        });
        this.sendData(data);
    });

    joinGame = (gameId: string): Promise<string> => new Promise((res, rej) => {
        const mid = random_string();
        const data = {
            type: "JOIN",
            id: gameId,
            mid: mid
        };

        this.mid_cb.set(mid, (data: any) => {
            // console.log("CALLED", data)
            res(data?.state);
        });

        this.sendData(data);
    });
    sendData = (data: {}) => {
        this.ws.send(JSON.stringify(data));
    };
    onReceive = (type_: string, callback: (data: any) => any) => {
        let cbs = this.callbacks.get(type_) || [];
        cbs.push(callback);
        this.callbacks.set(type_, cbs);


    };
}

export const network = new Network();
