import { Component } from "react";
import "./ValueSelect.css"
import minus from "../assets/imgs/minus.png"
import plus from "../assets/imgs/plus.png"
type IProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  enabled: boolean;
};

export class ValueSelect extends Component<IProps>{
    render(){
        return <div className={"value-select"}>

                <label>{this.props.label}</label>
                <div>
                    <button disabled={!this.props.enabled} className={"minus"} onClick={() => this.props.enabled && this.props.value > this.props.min && this.props.onChange(this.props.value - 1)}>
                        <img src={minus} alt={"-"} />
                    </button>
                    <span>{this.props.value}</span>
                    <button disabled={!this.props.enabled} className={"plus"} onClick={() => this.props.enabled &&  this.props.value < this.props.max && this.props.onChange(this.props.value + 1)}>
                        <img src={plus} alt={"+"} />
                    </button>
                </div>

        </div>
    }
}
