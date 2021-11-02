import React, { Component, useState } from "react";

import { network } from "./network";

interface ITestProps {}
interface ITestState {
    input_mid?: string,
    matchid?: string,
    name?: string,
    players?: [],
    loggedin?: boolean,
    playerNum?: number,
    currentPlayer?: number,
    gamestate?: string,
}

export class TestComp extends Component<ITestProps, ITestState>{

    constructor(props: any) {
        super(props);
        this.state = {
            // matchid:
        }


    }
    componentDidMount() {
        network.onReceive("LOGIN", data => {
            console.log("LOGIN",data)
            data?.name && this.setState({name: data?.name})
            data?.player && this.setState({players: data?.player})
            data?.playerNr !== undefined && this.setState({playerNum: data?.playerNr})
            this.setState({loggedin: true})
        })

        network.onReceive("GAME_STATE", data=>{
            console.log("GS", data)
            switch(data?.state){
                case "PLACE":
                    this.setState({gamestate: "PLACE"});
                    break;
                case "P1":
                    this.setState({currentPlayer: 1});
                    this.setState({gamestate: "BOMB"});
                    break;
                case "P0":
                    this.setState({currentPlayer: 0});
                    this.setState({gamestate: "BOMB"});
                    break;
            }
        })
        network.onReceive("FIELD_RESP", data=>{
            console.log("FIELD_RESP: ", data)
        })
    }


    createMatch = async() =>{
        this.setState({ matchid: await network.createGame() });
    }
    joinMatch = async() =>{
        const state = await network.joinGame(this.state.input_mid || "")
        if(state!=="SUCCESS"){
            alert("Message: " + state)
        }
    }

    login = () =>{
        network.sendData({
            type: "LOGIN",
            name: this.state.name
        })

    }

    start = () =>{
        network.sendData({
            type: "GAME_STATE",
            state: "PLACE"
        })
    }

    setField = (x: number,y: number)=>{
        if(this.state.gamestate === "PLACE"){
            network.sendData({
                type: "SET_MAP",
                map: [
                    [
                        [x,y]
                    ]
                ]
            })
        }else if(this.state.gamestate === "BOMB"){
            network.sendData({
                type: "FIELD_REQ",
                field: [x,y]
            })
        }

        const ship = [
            [1,0]
        ]
    }


    render(){
        return (
            <>
                <div>
                    <input value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} type={"text"}/>
                    <button onClick={this.login}>Login</button>
                </div>
                <p>{this.state.matchid}</p>
                {this.state.matchid === undefined && this.state.loggedin ? <>
                    <button onClick={this.createMatch}>Create</button>
                    <div>
                        <input type={"text"} onChange={(e)=>this.setState({input_mid: e.target.value})}/>
                        <button onClick={this.joinMatch}>Join</button>
                    </div>
                </> : <>
                </>}

                <h4>Connected players</h4>
                <ul>
                    {this.state.players?.map(player=>(<li>{player}</li>))}
                </ul>
                {this.state.playerNum === 0 && !this.state.gamestate ? <>
                    <button onClick={this.start}>Start</button>
                </> : ""}
                {this.state.playerNum === this.state.currentPlayer && this.state.currentPlayer !== undefined ? <h2>ITS YOUR TURN</h2> : ""}
                {this.state.gamestate ?
                    <>
                        <div>
                            <button onClick={()=>this.setField(0,0)}>F1</button>
                            <button onClick={()=>this.setField(1,0)}>F2</button>
                            <button onClick={()=>this.setField(0,1)}>F3</button>
                            <button onClick={()=>this.setField(1,1)}>F4</button>
                        </div>
                    </>
                    :
                    ""
                }
            </>
        )
    }
}
