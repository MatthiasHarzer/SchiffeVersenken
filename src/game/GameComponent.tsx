import {Component} from "react";
// import "../MainMenu.css";    //TODO

import "./Grid.css";
import Grid from "./Grid";

class GameComponent extends Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className={"fullscreen-center"}>
            <div className={"content grid-container"}>
                <Grid x={10} y={10} title={"Dein Feld"}/>
                <Grid x={10} y={10} title={"Feindliches Feld"}/>
            </div>
        </div>;
    }
}

export default GameComponent;
