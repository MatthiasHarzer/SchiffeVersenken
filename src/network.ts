// tmep
import isDev, { crackWSAddress, random_string, validateIPTemplate } from "./util";

const OVERRIDE_IS_DEV = false;   // true = dont use isDev || false = use isDev

const DEFAULT_IP_ADDRESS_TEMPLATE = localStorage.getItem("server_ip") || "192.168.0";
const localDevServerIP = "127.0.0.1";
const PORT = 4269;




class Network {
    private ws: WebSocket | undefined;
    private mid_cb: Map<string, (state: string) => void> = new Map<string, (state: string) => void>();
    private callbacks: Map<string, Array<any>> = new Map<string, Array<any>>();


    constructor() {
        if(isDev() && !OVERRIDE_IS_DEV){
            this.connect(localDevServerIP);
        }else{
            this.connect(DEFAULT_IP_ADDRESS_TEMPLATE);
        }
    }

    private connect = async (ip: string) => {
        if(this.ws){
            this.ws.close();
            this.dispatchEvent("SERVER_DISCONNECT");
        }

        let wsAddress = ip.split(".").length >= 4 ? `ws:\\${ip}:${PORT}` : await crackWSAddress(ip, PORT);

        if(!wsAddress){
            return
        }
        this.ws = new WebSocket(wsAddress);
        this.ws.onopen = this.wsConnected
        this.ws.onmessage = this.wsReceive;
    };

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

    findServerByIP = (ip: string) =>{
        if(validateIPTemplate(ip)){
            localStorage.setItem("server_ip", ip);
            this.connect(ip);
        }else{
            alert("Invalid IP Address: " + ip);
        }
    }

    createGame = (): Promise<string> => new Promise((res) => {
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

    joinGame = (gameId: string): Promise<string> => new Promise((res) => {
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
        if (this.ws) {
            this.ws.send(JSON.stringify(data));
        }

    };
    onReceive = (type_: string, callback: (data: any) => any) => {
        let cbs = this.callbacks.get(type_) || [];
        cbs.push(callback);
        this.callbacks.set(type_, cbs);


    };
}

export const network = new Network();
