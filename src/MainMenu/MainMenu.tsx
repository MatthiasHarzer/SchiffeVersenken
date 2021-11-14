import { Component } from "react";
import "./MainMenu.css";
import { network } from "../network";

export class MainMenu extends Component<any, any> {
    ellipsesTimer: NodeJS.Timeout | undefined;

    componentDidMount() {
        this.setState({ name: localStorage.getItem("user_name") });

        network.onReceive("LOGIN", (data: any) => {
            data?.name && this.setState({ name: data?.name });
            this.setState({ logged_in: true });
            this.setUserName(this.state.name);
        });
        network.onReceive("SERVER_CONNECT", () => {
            this.setState({ server_connected: true });

            if (localStorage.getItem("user_name")){
                network.sendData({
                    type: "LOGIN",
                    name: localStorage.getItem("user_name")
                });
            }

        });
        network.onReceive("SERVER_DISCONNECT", () => {
            this.setState({ server_connected: false });

        });

        let dots = "";
        this.ellipsesTimer = setInterval(() => {
            dots += ".";
            if (dots.length > 4) {
                dots = ".";
            }
            this.setState({ ellipses_render: dots });
        }, 500);


    }

    componentWillUnmount() {
        if (this.ellipsesTimer) {
            clearInterval(this.ellipsesTimer);
        }
    }

    setUserName = (name: string) => {
        localStorage.setItem("user_name", name);
    };

    login = () => {
        this.setUserName(this.state.name);

        network.sendData({
            type: "LOGIN",
            name: this.state.name
        });

    };

    createMatch = async () => {
        const matchID = await network.createGame();

        if (matchID) {
            this.props.onGameConnected(matchID);
        }
    };
    joinMatch = async () => {
        const state = await network.joinGame(this.state?.inputMatchID || "");
        if (state !== "SUCCESS") {
            alert("Error: " + state);
        } else {
            this.props.onGameConnected(this.state?.inputMatchID);
        }
    };

    useCustomIPAddress = (ip: string) =>{
        console.log("Using custom IP: " + ip);
        network.findServerByIP(ip);
    }


    render() {
        return (
            <>
                <div className={"main-menu"}>
                    <div className={"ip-address-template-input"}>
                        <input type={"text"} defaultValue={localStorage.getItem("server_ip")||""} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                this.useCustomIPAddress(e.currentTarget.value);
                            }}
                        }
                               placeholder={"Custom IP"}
                        />
                    </div>
                    {/*<h1 className={"bg-header"}>{Array(100).fill("Schiffe Versenken ").map(r=>(<span style={{fontSize: Math.random()*120 + 15}}>{r}</span>))}</h1>*/}
                    <div className={"content"}>
                        {this.state?.server_connected ?
                            <>
                                <div className={"login combo"}>
                                    <input type={"text"} onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            this.login();
                                        }
                                    }} value={this.state?.name || ""}
                                           onChange={(e) => this.setState({ name: e.target.value })}
                                           placeholder={"Name"}
                                    />
                                    <button onClick={this.login}>Set Name</button>
                                </div>
                                <div className={(this.state?.logged_in ? "" : "hidden") + " game-select"}>
                                    <h3>Host or join a game</h3>
                                    <div className={"host"}>
                                        <button onClick={this.createMatch}>Host Game</button>
                                    </div>
                                    <div className={"join combo"}>
                                        <input placeholder={"Match ID"} type={"text"} value={this.state?.inputMatchID}
                                               onChange={(e) => this.setState({ inputMatchID: e.target.value.toUpperCase() })} />
                                        <button onClick={this.joinMatch}>Join</button>
                                    </div>
                                </div>
                            </> : <>
                                <div className={"loading"}>
                                    <div className="loader" />
                                    <span>Connecting to server{this.state?.ellipses_render}</span>
                                </div>
                            </>}
                    </div>
                </div>
            </>
        );
    }

}
