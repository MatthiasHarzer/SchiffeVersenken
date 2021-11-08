import {Component} from "react";
import "../MainMenu.css"; //TODO
import "./Grid.css";

type GridProps = {
    x: number,
    y: number,
    title: string
};

class Grid extends Component<GridProps> {

    static defaultProps = {
        x: 10,
        y: 10,
        title: "Dein Feld"
    }

    constructor(props: GridProps) {
        super(props);
    }

    render() {
        return <div className={"grid"}>
            <h1>{this.props.title}</h1>
            <canvas className={"grid-canvas"}/>
        </div>;
    }
}

export default Grid;