import React, { Component } from "react";
import { Grid, Row, Col, Table, FormGroup, FormControl } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { style } from "variables/Variables.jsx";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import cp from '../../cp';
import moment from 'moment';
import Button from "components/CustomButton/CustomButton.jsx";
import { createBrowserHistory } from 'history';
import WithdrawLogSub from './WithdrawLogSub.jsx';

export const history = createBrowserHistory();

class VoteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            data: '',
            infoData:'',
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
                else { this.setState({ data: res.data.data, infoData: res.data.infoData.data, isLoad: true }) }

            }).catch(err => { console.log(err); });
        }
    }

    goback(){
        history.goBack();
    }

    updateEvent = async (data) =>{
        var resData =  await axios.post(cp.server_ip + '/api/withdraw/update_history',
            {
                data: {
                    token: window.localStorage['nu_token'],
                    data: data,
                }
            }
        )
        if(resData.status === 200 && resData.data.result === 'succ'){
            alert('업데이트 성공.')
        }
        return resData.data.data;

    }

	makeLogBox = () => {
			return this.state.data.map(item =>
					(
						<WithdrawLogSub
							key={item._id}
							data={item}
							searchText={this.state.searchText}
                            updateEvent={this.updateEvent}
                             />
					)
			);
	}


    render() {
        if (!this.state.isLoad) {
            return (<div></div>);
        } else {
            var tableInfoTd = [];
            var tableInfoTh = [];
            var tableTd = [];
            var tableTh = [];
            // info 리스트
            tableInfoTd.push(
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
            var infoData = this.state.infoData;
            var startDate = moment(infoData.start_date).format('YYYY-MM-DD HH:mm');
            var endDate = moment(infoData.end_date).format('YYYY-MM-DD HH:mm');
            var moDate = moment(infoData.mo_date).format('YYYY-MM-DD HH:mm');
            tableInfoTh.push(
                <tr style={style.Config.pointer} key={infoData._id} >
                    <td style={Object.assign({}, style.Config.w20, style.Config.wordCenter)}>{startDate} ~ {endDate}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{infoData.withdraw_info_id}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{infoData.coin_type}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{infoData.personal_amount_min}, {infoData.personal_amount_max}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{infoData.unit_min}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{infoData.total_amount}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{moDate}</td>
                </tr>
            );




            // 히스토리 리스트
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

            return (
                <div className="content">
                    <Grid fluid>
                        <div
                            className="nav-link"
                            activeClassName="active"
                            onClick={this.goback}
                            style={{ color: "#1DC7EA", cursor: "pointer" }}
                        >
                            <p>Back</p>
                        </div>

                        <Row>
                            <Col md={12}>
                                <Card
                                    title="Withdraw Info"
                                    category=""
                                    ctTableFullWidth
                                    ctTableResponsive
                                    content={
                                        <Table striped hover>
                                            <thead>
                                                {tableInfoTd}
                                            </thead>
                                            <tbody>
                                                {tableInfoTh}
                                            </tbody>
                                        </Table>
                                    }
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Card
                                    title="Withdraw History List"
                                    category=""
                                    ctTableFullWidth
                                    ctTableResponsive
                                    content={
                                        <Table striped hover>
                                            <thead>
                                                {tableTh}
                                            </thead>
                                            <tbody>
                                                {this.makeLogBox()}
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
}

export default VoteList;
