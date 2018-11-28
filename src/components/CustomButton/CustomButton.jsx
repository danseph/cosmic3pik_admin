import React, { Component } from "react";
import { Button } from "react-bootstrap";
import cx from "classnames";
import PropTypes from "prop-types";

class CustomButton extends Component {
  render() {
    const { fill, simple, pullRight, round, block, ...rest } = this.props;

    const btnClasses = cx({
      "btn-fill": fill,
      "btn-simple": simple,
      "pull-right": pullRight,
      "btn-block": block,
      "btn-round": round
    });

		if(this.props.removeAction){
			 return <Button onClick={(e) => {this.props.removeAction(this.props.filedName , this.props.cntNum)}} className={btnClasses} {...rest} />;

		}else{
		   return <Button className={btnClasses} {...rest} />;

		}
  }
}

CustomButton.propTypes = {
  fill: PropTypes.bool,
  simple: PropTypes.bool,
  pullRight: PropTypes.bool,
  block: PropTypes.bool,
  round: PropTypes.bool
};

export default CustomButton;
