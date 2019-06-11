import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';

export class Update extends Component {
    render(){
        return(
            <div className="content">
                <div className="footer">
                <hr />
                    <div className="stats" onClick={this.props.statsClick}>
                        {this.props.statsIcon} {this.props.statsIconText}
                    </div>
                </div>
            </div> 
        )
        
    }
}