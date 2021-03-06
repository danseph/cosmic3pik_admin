import React, { Component } from "react";

class CustomCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_checked: props.isChecked ? true : false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ is_checked: !this.props.isChecked });
		this.props.changeAction( '' ,'checkbox' , !this.props.isChecked  ,  this.props.name);
  }
  render() {
    const { isChecked, number, label, inline, changeAction, ...rest } = this.props;
    const classes =
      inline !== undefined ? "checkbox checkbox-inline" : "checkbox";
    return (
      <div className={classes}>
        <input
          id={number}
          type="checkbox"
          onChange={this.handleClick}
          checked={this.props.isChecked}
          {...rest}
        />
        <label htmlFor={number}>{label}</label>
      </div>
    );
  }
}

export default CustomCheckbox;
