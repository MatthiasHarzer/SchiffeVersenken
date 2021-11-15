import React, {Component, RefObject} from "react";
// import "../MainMenu.css"; //TODO
import "./Grid.css";
import {gameLoop} from "./GameLoop";

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
        gameLoop.start();

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        this.drawGrid(ctx, 10);

        gameLoop.injectCallback(() => {
            //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            //this.drawGrid(ctx, 10);
        });
    }

    drawGrid(ctx: any, fields: number) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        const wPx = width / fields;
        const wPy = height / fields;

        ctx.beginPath();

        for (let x = wPx; x <= width; x += wPx) {
            if (x >= width) {
                continue;
            }

            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        for (let y = wPy; y <= height; y += wPy) {
            if (y >= height) {
                continue;
            }
            ctx.moveTo(width, y);
            ctx.lineTo(0, y);
        }

        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.stroke();
    }

    componentWillUnmount() {
        gameLoop.ejectCallbacks();
    }

    render() {
        return <div className={"grid"}>
            <h1>{this.props.title}</h1>
            <canvas ref={this.canvasRef} className={"grid-canvas"}/>
        </div>;
    }
}

export default Grid;
