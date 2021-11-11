import { Component } from "react";
import "./App.css";

import { MainMenu } from "./MainMenu/MainMenu";
import { network } from "./network";
import { game } from "./game";
import { Lobby } from "./Lobby/Lobby";

export default class App extends Component<any, any> {

    componentDidMount() {
        this.setState({ currentTab: "MAIN_MENU" });
        network.onReceive("GAME_STATE", (data) => {
            console.log("rev: GAME_STATE", data )
            game.setState(data?.state);
            if(data?.state==="PLACE"){
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


    render() {
        return (
            <div className="App">
                <div className={"bg"}>
                    <h1 className={"bg-header"}>{Array(100).fill("Schiffe Versenken ").map(r=>(<span style={{fontSize: Math.random()*120 + 15}}>{r}</span>))}</h1>
                </div>
                <div className={"content"}>

                    <div hidden={this.state?.currentTab !== "MAIN_MENU"}>
                        <MainMenu onGameConnected={this.onGameConnected.bind(this)} />
                    </div>

                    <div hidden={this.state?.currentTab !== "LOBBY"}>
                        <Lobby />
                    </div>

                    <div hidden={this.state?.currentTab !== "PLACE"}>
                        {/*  TODO*/}
                    </div>

                    <div hidden={this.state?.currentTab !== "BOMB"}>
                        {/*  TODO*/}
                    </div>

                    <div hidden={this.state?.currentTab !== "END"}>
                        {/*  TODO*/}
                    </div>
                </div>
            </div>
        );
    }
}


