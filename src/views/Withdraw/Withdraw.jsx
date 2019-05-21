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
        };

        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);

        if (!this.state.isLoad) {
            axios.post(cp.server_ip + '/api/withdraw/withdraw_info_list',
                {
                    data: {
                        token: window.localStorage['nu_token'],
                        page: parsed.page
                    }
                }
            ).then(res => {
                console.log(res.data.data);

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
				<th style={Object.assign({}, style.Config.w20, style.Config.wordCenter, style.Config.wordBlod)} >진행기간</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >이벤트 번호</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >스왑코인</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >인당 최소, 최대 신청AI</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >최소신청 AI단위</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >총 신청 AI 제한</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >마지막 수정일</th>
			</tr>

		)

		for (var item of this.state.data) {
            var link = '/WithdrawWrite?uid=' + item.withdraw_info_id;
            var startDate = moment(item.start_date).format('YYYY-MM-DD HH:mm');
            var endDate = moment(item.end_date).format('YYYY-MM-DD HH:mm');
            var moDate = moment(item.mo_date).format('YYYY-MM-DD HH:mm');

			tableTd.push(
				<tr style={style.Config.pointer} key={item._id} >
					<td style={Object.assign({}, style.Config.w20, style.Config.wordCenter)}><NavLink to={link} >{startDate} ~ {endDate}</NavLink></td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.withdraw_info_id}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.coin_type}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.personal_amount_min}, {item.personal_amount_max}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.unit_min}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.total_amount}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{moDate}</td>
				</tr>);

		}

		return (
			<div className="content">
				<Grid fluid>
					<NavLink
						to='/withdrawWrite'
						className="nav-link"
						activeClassName="active"
					>
						<p>Withdraw Add</p>
					</NavLink>
					<Row>
						<Col md={12}>
							<Card
								title="Withdraw Info List"
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
