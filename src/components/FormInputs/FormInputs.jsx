import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl ,HelpBlock } from "react-bootstrap";

export class FormInputs extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value:  this.props.defaultValue,
			textConfirm : this.props.textConfirm
    };
  }

  getValidationState(textConfirm , value , proc) {
		switch(textConfirm) {
			case "length-0-5-10":
				const length = value.length;
				if (length > 10) return 'success';
				else if (length > 5) return 'warning';
				else if (length > 0) return 'error';
				break;
			default:
				return null;
		}
    return null;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    var row = [];
		var option = [];

    for (var i = 0; i < this.props.ncols.length; i++) {
			if(this.props.proprieties[i].type === 'select'){
				option[i] = [];
				for (var j = 0; j < this.props.proprieties[i].option.length; j++) {
					option[i].push(<option key={i+'.'+j} value={this.props.proprieties[i].option[j].value}>{this.props.proprieties[i].option[j].view}</option>)
				}
			}

      row.push(
        <div key={i} className={this.props.ncols[i]}>
					<FormGroup
						controlId={this.props.proprieties[i].bsClass}
						validationState={this.getValidationState(this.props.proprieties[i].textConfirm , this.props.proprieties[i].defaultValue , this.props.proprieties[i].proc)}

					>
						<ControlLabel>{this.props.proprieties[i].label} &nbsp;&nbsp;&nbsp;{this.getValidationState(this.props.proprieties[i].textConfirm , this.props.proprieties[i].defaultValue)}</ControlLabel>
						<FormControl
							componentClass={this.props.proprieties[i].componentClass}
							type={this.props.proprieties[i].type}
							value={this.props.proprieties[i].defaultValue}
							placeholder={this.props.proprieties[i].placeholder}
							name = {this.props.proprieties[i].name}
							required = {this.props.proprieties[i].required}
							onChange={(e ) => {this.props.changeAction(e , this.props.arrayNum , this.props.filedName)}}

						>
						{option[i]}
						</FormControl>

						<FormControl.Feedback />
						<HelpBlock>{this.props.proprieties[i].description}</HelpBlock>
					</FormGroup>
        </div>
      );
    }
    return (
			<div>{row}</div>
    );
  }
}

export default FormInputs;
