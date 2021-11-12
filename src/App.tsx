import { Component } from "react";
import "./App.css";

import { MainMenu } from "./MainMenu/MainMenu";
import { network } from "./network";
import { game } from "./game";
import { Lobby } from "./Lobby/Lobby";
import GameComponent from "./game/GameComponent";

export default class App extends Component<any, any> {

    componentDidMount() {
        this.setState({ currentTab: "MAIN_MENU" });
        network.onReceive("GAME_STATE", (data) => {
            console.log("rev: GAME_STATE", data);
            game.setState(data?.state);
            if (data?.state === "PLACE") {
                this.setState({ currentTab: "PLACE" });
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


    render() {
        return (
            <div className="app fullscreen-center">

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
                        {/*  TODO*/}
                    </div>
                {/*</div>*/}
            </div>
        );
    }
}


