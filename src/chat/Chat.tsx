import "./Chat.css"
import { Component } from "react";
import { network } from "../network";
import { game } from "../game";
import { formatDate } from "../util";
import send from "../assets/imgs/send.png";
const scrollTo = (ref: any) => {

    if (ref ) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

type IChatState = {
    messages: any[];
    sendMessage: string;
    unread: number;
    open: boolean;
}

export class Chat extends Component<any, IChatState>{
    constructor(props: IChatState) {
        super(props);

        this.state = {
            messages: [],
            sendMessage: "",
            unread: 0,
            open: false
        }
    }

    componentDidMount() {
        network.onReceive("CHAT", data=>{
            data?.message && this.setState({
                messages: [...this.state.messages || [], {text: data?.message, playerNr: data?.playerNr}]
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

    sendMessage = ()=>{
        if(this.state?.sendMessage){

            network.send("CHAT", { message: this.state?.sendMessage })
        }
        this.setState({
            sendMessage: ""
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
                    return (<div key={index} className={"chat-message " + ((!isNaN(Number(message?.playerNr)) && message.playerNr === game?.playerNr) ? "me" : "")} ref={scrollTo}>
                        <span className={"chat-message-player"}>{(game.players && game.players[message.playerNr]) || "unknown"}</span>
                        <span className={"chat-message-text"}>{message.text}</span>
                        <span className={"chat-message-time"}>{formatDate(new Date(), "#hhhh#:#mm#")}</span>
                    </div>)})}
            </div>
            <div className="chat-input">
                <div className={"input-wrapper"}>

                <input type="text" placeholder="Type a message..." value={this.state.sendMessage} onChange={e=>{
                    this.setState({
                        sendMessage: e.currentTarget.value
                    })
                }}
                       onKeyPress={(e) => {

                    if (e.key === "Enter") {
                        this.sendMessage();
                        // e.currentTarget.value = ""
                    }
                }} />
                <button className={"clear-btn"} onClick={this.sendMessage}>
                    <img src={send} alt={">>>"}/>
                </button>
                </div>
            </div>
        </div>);
    }
}
