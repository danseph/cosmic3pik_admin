import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { style } from "variables/Variables.jsx";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import cp from '../../cp';
import moment from 'moment';
import Button from "components/CustomButton/CustomButton.jsx";

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
            axios.post(cp.server_ip + '/api/withdraw/Withdraw_history_for_event',
                {
                    data: {
                        token: window.localStorage['nu_token'],
                        page: parsed.page,
                        uid: parsed.info_id,
                    }
                }
            ).then(res => {
                if(res.data.status === 'err'){
                    alert(res.data.msg);
                }
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
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >유저id (추후 닉네임추가)</th>
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >신청 ai수량</th>
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >스왑코인</th>
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >변환된 수량</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >지갑주소</th>
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >진행상태</th>
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >신청날짜</th>
				<th style={Object.assign({}, style.Config.w15, style.Config.wordCenter, style.Config.wordBlod)} >txid</th>
				<th style={Object.assign({}, style.Config.w15, style.Config.wordCenter, style.Config.wordBlod)} >기능</th>
			</tr>

		)

		for (var item of this.state.data) {
            var crDate = moment(item.cr_date).format('YYYY-MM-DD HH:mm');
            var userStatus = {'R' : '준비중' , 'I' : "진행중" , 'C' : '진행완'};
            if(item.status )
			tableTd.push(
				<tr style={style.Config.pointer} key={item._id} >
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.user_id}</td>
					<td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{item.ai_amount}</td>
					<td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{item.coin_type}</td>
					<td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{item.coin_amount}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordLeft)}>{item.wallet}</td>
					<td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{userStatus[item.status]}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{crDate}</td>
					<td style={Object.assign({}, style.Config.w35, style.Config.wordCenter)}>{item.txid}</td>
    				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >
                        <Button
                            style={{
                                width: '5em',
                                padding: '.5em .1em',
                                margin: '0 .2em .2em 0'
                            }}
                            bsStyle="info"
                            pullLeft
                            fill
                            onClick={() => { alert('준비중입니다.') }}
                            type="button">
                            Edit
                        </Button>

                        <Button
                            style={{
                                width: '5em',
                                padding: '.5em .1em'
                            }}
                            bsStyle="danger"
                            pullLeft
                            fill
                            onClick={() => { alert('준비중입니다.') }}
                            type="button">
                            Delete
                        </Button>
                    </th>
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
