import { Component } from "react";
import win_lose from "../assets/imgs/lose_win.webp";
import "./end.css"

type IProps = {
    winnerName: string,
    loserName: string,
}

export class EndScreenImg extends Component<IProps>{
    render() {
        return(
            <>
                <div className={"end-img"}>
                    <img src={win_lose} alt={"Cool iamge"}/>

                    <div className={"winner"}>
                        <span>{this.props.winnerName}</span>
                    </div>

                    <div className={"loser"}>
                        <span>{this.props.loserName}</span>
                    </div>

                </div>
            </>
        );
    }
}
