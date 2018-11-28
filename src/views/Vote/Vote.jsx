import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray, style } from "variables/Variables.jsx";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import cp from '../../cp';

class VoteList extends Component {
	//wefewfewfewf
	constructor(props) {
		super(props);
		this.state = {
			// or Date or Moment.js
			isLoad: false,
			data: '',

		};

		const queryString = require('query-string');
		const parsed = queryString.parse(this.props.location.search);

		//console.log(parsed);
		if (!this.state.isLoad) {
			axios.post(cp.server_ip + '/api/vote', {
				proc: 'voteList',
				userId: window.localStorage['nu_id'],
				userToken: window.localStorage['nu_token'],
				page: parsed.page
			}).then(res => {
				if (res.data.err) { window.location.href = '/'; }
				else { this.setState({ data: res.data, isLoad: true }) }

			}).catch(err => { console.log(err); });
		}

	}


	render() {
		var tableTd = new Array();
		var tableTh = new Array();
		tableTh.push(
			<tr>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >순번</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >투표타입</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >총 투표자</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >상승 투표자</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >보합 투표자</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >하락 투표자</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >진행여부</th>
			</tr>

		)

		for (var item of this.state.data) {
			var link = '/voteWrite?uid=' + item._id;
			tableTd.push(
				<tr style={style.Config.pointer}  >
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}><NavLink to={link} > {item.voteDate}</NavLink></td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.voteNumber}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.voteType}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.voteCountT}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.voteCount1}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.voteCount2}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.voteCount3}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.voteCount3}</td>
				</tr>);

		}

		return (
			<div className="content">
				<Grid fluid>
					<NavLink
						to='/voteWrite'
						className="nav-link"
						activeClassName="active"
					>
						<p>Vote Add</p>
					</NavLink>
					<Row>
						<Col md={12}>
							<Card
								title="Vote List"
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
