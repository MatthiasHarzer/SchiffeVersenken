import "./Chat.css"
import { Component } from "react";
import { network } from "../network";
import { game } from "../game";

const scrollTo = (ref: any) => {

    if (ref ) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}



export class Chat extends Component<any, any>{


    componentDidMount() {
        network.onReceive("CHAT", data=>{
            data?.message && this.setState({
                messages: [...this.state?.messages || [], {text: data?.message, playerNr: data?.playerNr}]
            })
            if(!this.state?.open){
                this.setState({
                    unread: this.state?.unread + 1
                })
            }
        })
    }

    toggleOpen=()=>{
        if(!this.state?.open){
            this.setState({
                unread: 0
            })
        }

        this.setState({
            open: !this.state?.open
        })
    }

    render() {
        return (<div className={"chat "  + (this.state?.open ? "chat-open" : "")}>
            <div className={"header"}>
                <button onClick={this.toggleOpen}>
                    {this.state?.open ? "Hide" : this.state?.unread ? `Show chat (${this.state?.unread})` : "Show chat"}
                </button>
            </div>
            <div className="chat-messages">
                <div className={"top-fade"} > <div/></div>
                {this.state?.messages && this.state?.messages.map((message: any, index: number) => {
                    console.log(message, game?.playerNr)
                    return (<div key={index} className={"chat-message " + ((!isNaN(Number(message?.playerNr)) && message.playerNr === game?.playerNr) ? "me" : "")} ref={scrollTo}>
                        <span className={"chat-message-player"}>{(game.players && game.players[message.playerNr]) || "unknown"}</span>
                        <span className={"chat-message-text"}>{message.text}</span>
                    </div>)})}
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Type a message..." onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        network.send("CHAT", { message: e.currentTarget.value })
                        e.currentTarget.value = ""
                    }
                }} />
            </div>
        </div>);
    }
}
