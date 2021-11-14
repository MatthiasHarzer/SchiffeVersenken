import { Component } from "react";
import { EndScreenImg } from "./EndScreenImg";

type IEndScreenProps = {
    type: "WIN" | "LOSE",
    winnerName: string,
    loserName: string,
    onClick: () => void,
}

export class EndScreen extends Component<IEndScreenProps> {

    componentDidMount() {

    }

    render() {
        return (
            <div className="end-screen content">
                <h1>
                    {this.props.type === "WIN" ? "You Win!" : "You Lose!"}
                </h1>
                <div className={"end-img-wrapper"}>
                    <EndScreenImg winnerName={this.props.winnerName} loserName={this.props.loserName} />
                </div>
                <div className={"back-btn"}>
                    <button onClick={this.props.onClick}>Back to menu</button>
                </div>
            </div>
        );
    }
}
