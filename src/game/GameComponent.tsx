import {Component} from "react";
import "../MainMenu.css";    //TODO
import "./Grid.css";
import Grid from "./Grid";

class GameComponent extends Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className={"bg"}>
            <h1 className={"bg-header"}>{Array(100).fill("Schiffe Versenken ").map(r => (
                <span style={{fontSize: Math.random() * 120 + 15}}>{r}</span>))}</h1>

            <div className={"menu grid-container"}>
                <Grid x={10} y={10} title={"Dein Feld"}/>
                <Grid x={10} y={10} title={"Feindliches Feld"}/>
            </div>
        </div>;
    }
}

export default GameComponent;