import React from "react";

export const copyToClipboard = (content: string | undefined) => {
    if (!content) return;
    const el = document.createElement("textarea");
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
};
export const random_string = () => {
    return (Math.random() + 1).toString(36).substring(7);
};


export default function isDev(): boolean {
    return "_self" in React.createElement("div");
}

export const validateIPTemplate = (ip_template: string) => {
    if (![2, 3, 4].includes(ip_template.split(".").length)) return false;
    const splits = ip_template.split(".").map(x => Number(x));
    if (splits.includes(NaN)) return false;
    return !splits.map(ip => (Number(ip) >= 0 && Number(ip) <= 255) && (ip + "").length > 1 ? (ip + "")[0] !== "0" : true).includes(false);

};

const MAX_SERVER_FIND_PARALLEL_RUNS = 150;
const MAX_SERVER_FIND_TIMEOUT = 3000;
export const crackWSAddress = (ip_template: string, port: number): Promise<string | undefined> => {
    return new Promise<string | undefined>(resolve => {
        const ip_splits = ip_template.split(".");

        if (ip_splits.length < 2 || !validateIPTemplate(ip_template)) {
            resolve(undefined);
            return;
        } else if (ip_splits.length >= 4) {
            resolve(ip_template);
            return;
        }


        let test_ip = [0, 0, 0, 0];
        ip_splits.forEach((value, index) => {
            test_ip[index] = parseInt(value);
        });

        let pos = 0;
        let ips: string[] = [];
        while (true) {
            let v = test_ip[test_ip.length - 1 - pos];
            if (v >= 255) {
                test_ip[test_ip.length - 1 - pos] = 0;
                pos++;
                if (pos >= 4 - (ip_splits.length)) break;

                // console.log(pos, ip_splits.length-1)
            } else {
                test_ip[test_ip.length - 1 - pos]++;
                if (pos > 0) {
                    pos--;
                }
            }

            ips.push(test_ip.join("."));
        }

        let numInFlight = 0;
        let running = true;
        let ipCurrentIndex = 0;



        // only check if crack nr is current
        let currentCrackNr = random_string() + random_string();

        // -> https://stackoverflow.com/a/27220617/11664234
        const tryOne = (ip: string, cNr: string) => {
            ++numInFlight;
            const address = "ws://" + ip + ":" + port;
            let socket: WebSocket | undefined = new WebSocket(address);
            const timer = setTimeout(function() {
                // console.log(address + " timeout");
                let s = socket;
                socket = undefined;
                s?.close();
                --numInFlight;
                next(cNr);
            }, MAX_SERVER_FIND_TIMEOUT);
            socket.onopen = function() {
                if (socket) {
                    console.log(address + " success");
                    clearTimeout(timer);
                    resolve(address);
                    socket?.close();
                    running = false;
                    --numInFlight;
                    next(cNr);
                }
            };
            socket.onerror = function(err) {
                if (socket) {
                    clearTimeout(timer);
                    --numInFlight;
                    next(cNr);
                }
            };
        };

        function next(cNr: string) {
            while (currentCrackNr === cNr && running && numInFlight < MAX_SERVER_FIND_PARALLEL_RUNS && ipCurrentIndex < ips.length) {
                tryOne(ips[ipCurrentIndex++], currentCrackNr);
            }
        }

        next(currentCrackNr);


    });

};
