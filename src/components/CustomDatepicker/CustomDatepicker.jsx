import React, { Component } from "react";
import { ControlLabel } from "react-bootstrap";
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';



export class CustomDatePicker extends Component {
	constructor(props, context) {
			super(props, context);

			// Initial state with date
			this.state = {
					// or Date or Moment.js
					selectedDate: this.props.defaultDate
			};

			// This binding is necessary to make `this` work in the callback
			this.onChange = this.onChange.bind(this);
	}
	onChange(date) {
		this.setState({
			selectedDate: date
		});
	}
  render() {
		return(
			<div>
				{this.props.description}
				<ControlLabel>{this.props.label}</ControlLabel>
				<DatePickerInput
						onChange={e => this.props.changeAction(this.props.name , e)}
						value={this.props.defaultDate}
						className='my-custom-datepicker-component'
				/>
			</div>
		)
	}
}

export default CustomDatePicker;
