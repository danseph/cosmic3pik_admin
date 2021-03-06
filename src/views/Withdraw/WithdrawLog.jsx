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
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

export const history = createBrowserHistory();

class VoteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            data: '',
            infoData:'',
            totalData: '',
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
                else { this.setState({ data: res.data.data, infoData: res.data.infoData.data, totalData: res.data.totalData, isLoad: true }) }

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

    cancleEvent = async (data) =>{
        var resData =  await axios.post(cp.server_ip + '/api/withdraw/cancle_history',
            {
                data: {
                    token: window.localStorage['nu_token'],
                    data: data,
                }
            }
        )
        if(resData.status === 200 && resData.data.result === 'succ'){
            alert('출금 취소 성공.')
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
                            cancleEvent={this.cancleEvent}
                             />
					)
			);
	}

    addComma = (num) => {
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');
    }
    search = () => {
        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);
        axios.post(cp.server_ip + '/api/withdraw/Withdraw_history_for_event',
            {
                data: {
                    token: window.localStorage['nu_token'],
                    page: parsed.page,
                    uid: parsed.info_id,
                    search: this.state.search,
                }
            }
        ).then(res => {
            if (res.data.status === 'err') {
                alert(res.data.msg);
            }
            else { this.setState({ data: res.data.data, infoData: res.data.infoData.data, totalData: res.data.totalData, isLoad: true }) }

        }).catch(err => { console.log(err); });
    };
    changed = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };
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
                    <th style={Object.assign({}, style.Config.w15, style.Config.wordCenter, style.Config.wordBlod)} >진행기간</th>
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >이벤트 번호</th>
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >스왑코인</th>
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >인당 최소, 최대 신청AI</th>
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >최소신청 AI단위</th>
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >총 신청 AI 제한</th>
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >신청수량</th>
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >신청인원</th>
                </tr>

            )
            var infoData = this.state.infoData;
            var totalData = this.state.totalData;
            var startDate = moment(infoData.start_date).format('YYYY-MM-DD HH:mm');
            var endDate = moment(infoData.end_date).format('YYYY-MM-DD HH:mm');
            var moDate = moment(infoData.mo_date).format('YYYY-MM-DD HH:mm');
            tableInfoTh.push(
                <tr style={style.Config.pointer} key={infoData._id} >
                    <td style={Object.assign({}, style.Config.w20, style.Config.wordCenter)}>{startDate} ~ {endDate}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{infoData.withdraw_info_id}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{infoData.coin_type}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{this.addComma(infoData.personal_amount_min)} / {this.addComma(infoData.personal_amount_max)}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{this.addComma(infoData.unit_min)}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{this.addComma(infoData.total_amount)}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{this.addComma(totalData.count)}</td>
                    <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{this.addComma(totalData.users)}</td>
                </tr>
            );




            // 히스토리 리스트
            tableTh.push(
                <tr key="1">
                    <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >유저닉네임</th>
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
                                        <div>
                                            <Row style={{position:"absolute", top:"10", right:"10", width:"20%",marginRight:"0"}}>
                                                <FormInputs
                                                    changeAction = {this.changed}
                                                    ncols={["col-md-10"]}
                                                    proprieties={[
                                                        {
                                                            label: "닉네임 검색(현재 닉네임을 입력해 주세요)",
                                                            name: 'search',
                                                            componentClass: "input",
                                                            type: "text",
                                                            bsClass: "form-control",
                                                            defaultValue: this.state.search,
                                                            required: false
                                                        }
                                                    ]}

                                                />
                                                <Col md={2} style={{ paddingLeft:"0", top:"28"}} onClick={this.search}>
                                                    <i style={{width:"30", height:"30", fontSize:"28", cursor:"pointer",}} className="pe-7s-search" />
                                                </Col>
                                            </Row>
                                            <Table striped hover>
                                                <thead>
                                                    {tableTh}
                                                </thead>
                                                <tbody>
                                                    {this.makeLogBox()}
                                                </tbody>
                                            </Table>
                                        </div>

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
