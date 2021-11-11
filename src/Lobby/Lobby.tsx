import { Component } from "react";
import "./Lobby.css";
import { network } from "../network";
import { game } from "../game";
import { copyToClipboard } from "../util";
// @ts-ignore
import copy from "../imgs/copy.png";

export class Lobby extends Component<any, any> {

    componentDidMount() {
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
    }

    render() {
        return (
            <>
                <div className={"lobby"}>
                    <h1>Lobby Code: {this.state?.gameID} <img src={copy} alt={"/"}
                                                              onClick={() => copyToClipboard(game.id)} /></h1>
                    <div className={"info"}>
                        <div className={"connected-players"}>
                            <h3>Connected players:</h3>
                            <ul>
                                {this.state?.players?.map((player?: string, index?: number) => {
                                    return (
                                        <li key={index} className={index === this.state?.playerNr ? "me" : ""}>
                                            {player} ({index})
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        {this.state?.isHost &&
                        <div className={"host-controls"}>
                            <div>
                              <h3>Settings</h3>
                              <p>(Coming soon)</p>
                            </div>
                              <button onClick={() => {
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