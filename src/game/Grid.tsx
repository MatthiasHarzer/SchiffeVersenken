import React, {Component, RefObject} from "react";
// import "../MainMenu.css"; //TODO
import "./Grid.css";

type IGridProps = {
    x: number,
    y: number,
    title: string
};

class Grid extends Component<IGridProps> {

    static defaultProps = {
        x: 10,
        y: 10,
        title: "Dein Feld"
    }

    private readonly canvasRef: RefObject<any>;

    constructor(props: IGridProps) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
    }

    render() {
        return <div className={"grid"}>
            <h1>{this.props.title}</h1>
            <canvas ref={this.canvasRef} className={"grid-canvas"}/>
        </div>;
    }
}

export default Grid;
