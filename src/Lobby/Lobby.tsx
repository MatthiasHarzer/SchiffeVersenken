import { Component } from "react";
import "./Lobby.css";
import { network } from "../network";
import { game } from "../game";
import isDev, { copyToClipboard } from "../util";
// @ts-ignore
import copy from "../assets/imgs/copy.png";
import back from "../assets/imgs/back.png";
import { ValueSelect } from "./ValueSelect";
import { settings } from "cluster";

type IState = {
    settings: Array<{


        id: string,
        name: string,
        value: number | string;
        input_type?: string;

    }>;
    gameID?: string;
    isHost?: boolean;
    players?: Array<string>;
    playerNr?: number;

}

export class Lobby extends Component<any, IState> {
    componentDidMount() {
        // * Set default settings

        this.setState({
            settings: [


                        {
                            id: "SHIP_SMALL",
                            name: "Small ship (1x1)",
                            value: 3,
                            input_type: "VALUE_SELECT",
                        },
                        {
                            id: "SHIP_MIDDLE",
                            name: "Middle ship (2x1)",
                            value: 2,
                            input_type: "VALUE_SELECT",
                        },
                        {
                            id: "SHIP_BIGG",
                            name: "Big ship (3x1)",
                            value: 2,
                            input_type: "VALUE_SELECT",
                        },
                        {
                            id: "SHIP_XXL",
                            name: "XXL ship (4x1)",
                            value: 1,
                            input_type: "VALUE_SELECT",
                        },
                        {
                            id: "SHIP_EG",
                            name: "Ever Given (7x2)",
                            value: 1,
                            input_type: "VALUE_SELECT",
                        }



            ]
        });


        game.onChange(() => {
            this.setState({ gameID: game.id });
        });

        network.onReceive("LOGIN", data => {
            this.setState({
                isHost: data?.playerNr === 0,
                players: data?.player,
                playerNr: data?.playerNr
            });
        });
        network.onReceive("KICK", this.leaveGame);

        network.onReceive("SETTINGS", data => {
            data?.settings && data?.settings?.length > 0 && this.setState({
                settings: data.settings
            });
        });
    }

    leaveGame = () => {
        network.sendData({
            type: "LEAVE"
        });

        this.props.onLeaveGame();
    };

    setSetting = (id: string, value: string | number)=>{
        let current_settings = this.state.settings;
        current_settings.map((s)=>s.id===id && (s.value = value));

        this.setState({settings: current_settings})

        network.sendData({
            type: "SETTINGS",
            settings: current_settings
        });



}

    render() {
        return (
            <>

                <div className={"lobby content"}>
                    <button className={"clear-btn back-btn"} onClick={this.leaveGame}>
                        <img src={back} alt={"<-"} />
                    </button>
                    <h1>Lobby Code: {this.state?.gameID}
                        <button className={"clear-btn"} title={"Copy to clipboard"}
                                onClick={() => copyToClipboard(game.id)}><img src={copy} alt={"/"}
                        /></button>
                    </h1>
                    <div>
                        <div className={"info"}>
                            <div className={"connected-players"}>
                                <h3>Connected players:</h3>
                                <ul>
                                    {this.state?.players?.map((player?: string, index?: number) => {
                                        return (
                                            <li key={index} className={index === this.state?.playerNr ? "me" : ""}>
                                            <span>
                                                 {player}
                                            </span>
                                                {(this.state?.isHost && index !== this.state?.playerNr) ?
                                                    <button className={"clear-btn kick-btn"}
                                                            onClick={() => network.sendData({
                                                                type: "KICK",
                                                                playerNr: index
                                                            })}>
                                                        Kick
                                                    </button> : null}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className={"settings"}>


                                <h2>Settings</h2>
                                <div className={"settings-inner"}>


                                        <ul className={"clean"}>
                                            {this.state?.settings && this.state.settings.map((setting, s_index)=><li key={setting.id}>
                                                {setting?.input_type === "VALUE_SELECT" &&
                                                    <ValueSelect enabled={this.state?.isHost || false} value={Number((this.state.settings[s_index]).value)} onChange={(value)=>this.setSetting(setting.id, value)} min={0} max={10} label={setting.name} />
                                                }
                                            </li>)}

                                        </ul>
                                    </div>


                            </div>
                        </div>
                        {this.state?.isHost &&
                        <div className={"host-controls"}>
                          <button disabled={this.state?.players && this.state?.players.length < 2 && !isDev()} onClick={() => {
                              network.sendData({
                                  type: "GAME_STATE",
                                  state: "PLACE"
                              });
                          }} className={"start-btn"}>Start Game
                          </button>
                        </div>
                        }


                    </div>
                </div>
            </>
        );
    }
}
