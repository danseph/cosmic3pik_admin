import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { style } from "variables/Variables.jsx";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import cp from '../../cp';
import moment from 'moment';

class VoteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            data: '',
			version_type:'android'
        };

        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);

        if (!this.state.isLoad) {
            axios.post(cp.server_ip + '/api/version/get_history',
                {
                    data: {
                        token: window.localStorage['nu_token'],
                        page: parsed.page,
						version_type:this.state.version_type
                    }
                }
            ).then(res => {
                if (res.data.err) { window.location.href = '/'; }
                else { this.setState({ data: res.data.data, isLoad: true }) }

            }).catch(err => { console.log(err); });
        }

    }
    render() {
        var tableTd = [];
		var tableTh = [];
		tableTh.push(
			<tr key="1">
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >버전OS</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >등록날짜</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >버전 name</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >버전 count</th>
				<th style={Object.assign({}, style.Config.w65, style.Config.wordCenter, style.Config.wordBlod)} >버전 comment</th>
			</tr>

		)

		for (var item of this.state.data) {
            var link = '/versionWrite?uid=' + item._id;
            var cr_date = moment(item.cr_date).format('YYYY-MM-DD HH:mm');
			tableTd.push(
				<tr style={style.Config.pointer} key={item._id} >
					<td style={Object.assign({}, style.Config.w20, style.Config.wordCenter)}>{item.version_type}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}><NavLink to={link} >{cr_date}</NavLink></td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.version_name}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.version_count}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.version_comment}</td>
				</tr>);

		}

		return (
			<div className="content">
				<Grid fluid>
					<NavLink
						to='/versionWrite'
						className="nav-link"
						activeClassName="active"
					>
						<p>Version Add</p>
					</NavLink>
					<Row>
						<Col md={12}>
							<Card
								title="Version Info List"
								category=""
								ctTableFullWidth
								ctTableResponsive
								content={
									<Table striped hover>
										<thead>
											{tableTh}
										</thead>
										<tbody>
											{tableTd}
										</tbody>
									</Table>
								}
							/>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

export default VoteList;
