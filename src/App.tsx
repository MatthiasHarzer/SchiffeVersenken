import { Component } from "react";
import "./App.css";

import { MainMenu } from "./MainMenu/MainMenu";
import { network } from "./network";
import { game } from "./game";
import { Lobby } from "./Lobby/Lobby";
import GameComponent from "./game/GameComponent";

import { EndScreen } from "./end/EndScreen";

export default class App extends Component<any, any> {

    componentDidMount() {

        this.setState({ currentTab: "MAIN_MENU" });
        // this.setState({ win: false, winnerName: "BAS Player", loserName: localStorage.getItem("user_name"), currentTab: "END" });

        network.onReceive("LOGIN", data => {
            this.setState({
                isHost: data?.playerNr === 0,
                players: data?.player,
                playerNr: data?.playerNr
            });
        });

        network.onReceive("GAME_STATE", (data) => {
            console.log("rev: GAME_STATE", data);
            game.setState(data?.state);
            if (data?.state === "PLACE") {
                this.setState({ currentTab: "PLACE" });
            }

            if(["W1", "W0"].includes(data?.state)){
                let playerWin = Number(data?.state[1]);
                let playerLose = 1 - playerWin;
                let isWin = this.state?.playerNr === playerWin
                this.setState({ win: isWin, winnerName: this.state?.players[playerWin], loserName: this.state?.players[playerLose], currentTab: "END" });

            }
        });



    }

    onGameConnected(id?: string) {
        if (id) {

            console.log("Game connected with id", id);
            game.setID(id);
            this.setState({ currentTab: "LOBBY" });
        }
    }
    onLeaveGame() {
        this.setState({ currentTab: "MAIN_MENU" });
    }

    onEndClicked = () =>{
        this.setState({ currentTab: "MAIN_MENU" });


    }


    render() {
        return (
            <div className="app fullscreen-center">
                {/*<div className={"fullscreen-center background-text"} >*/}
                {/*    <Background />*/}
                {/*</div>*/}
                <h1 className={"background-text"}>{Array(100).fill("Schiffe Versenken ").map(r => (
                    <span style={{ fontSize: Math.random() * 120 + 15 }}>{r}</span>))}</h1>

                {/*<div className={"content"}>*/}
                    <div hidden={this.state?.currentTab !== "MAIN_MENU"}>
                        <MainMenu onGameConnected={this.onGameConnected.bind(this)} />
                    </div>

                    <div hidden={this.state?.currentTab !== "LOBBY"}>
                        <Lobby onLeaveGame={this.onLeaveGame.bind(this)} />
                    </div>

                    <div hidden={this.state?.currentTab !== "PLACE"}>
                        <GameComponent />
                    </div>

                    <div hidden={this.state?.currentTab !== "BOMB"}>
                        {/*  TODO*/}
                    </div>

                    <div hidden={this.state?.currentTab !== "END"}>
                        <EndScreen type={this.state?.win ? "WIN" : "LOSE"} loserName={this.state?.loserName} winnerName={this.state?.winnerName} onClick={this.onEndClicked.bind(this)}/>
                    </div>
                {/*</div>*/}
            </div>
        );
    }
}


