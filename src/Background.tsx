import { Component } from "react";


export class Background extends Component<any, any>{
    render() {
        return(<>
                <div className={"background"}>
                    {Array(10).fill(<>
                        {Array(100).fill("Schiffe Versenken ").map(r=><span style={{ fontSize: Math.random() * 120 + 15 }}>{r}</span>)}
                    </>)}
                </div>
            </>);
    }
}
