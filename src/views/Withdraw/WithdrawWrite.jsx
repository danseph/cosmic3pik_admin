import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    ControlLabel,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import CustomDatePicker from "components/CustomDatepicker/CustomDatepicker.jsx";
import axios from 'axios';
import cp from '../../cp';
import Select from 'react-select';
import Checkbox from 'components/CustomCheckbox/CustomCheckbox';
import moment from 'moment';
class VoteWrite extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            withdraw_info_id: '',
            start_date: new Date(),
            end_date: new Date(),
            start_time: '00',
            end_time: '00',
            total_amount: '',
            personal_amount_min: '',
            personal_amount_max: '',
            unit_min: '',
            coin_exchange: '',
            link_exchange: '',
            coin_type: '',
            ex_ratio: 0,
            fees: 0,
            mo_date: '',
            cr_date: new Date(),
            status: 'R',
            isLoad:false
        };
    }


    render() {
        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);
        const logLink = '/withdrawLog?info_id='+this.state.withdraw_info_id;
        if (!this.state.isLoad && parsed.uid) {
            axios.post(cp.server_ip + '/api/withdraw/detail_info_view',
                {
                    data: {
                        token: window.localStorage['nu_token'],
                        uid: parsed.uid
                    }
                }
            ).then(res => {
                var startTime = moment(res.data.data.start_date).format('HH');
                var endTime = moment(res.data.data.end_date).format('HH');
                if (res.status === 'err') { window.location.href = '/'; }
                else {
                    this.setState({
                        isLoad: true,
                        ...res.data.data,
                        start_time:startTime,
                        end_time : endTime
                    })
                }
            }).catch(err => { console.log(err); });
            return false;
        }


        const changedCheck = (e, type, value, filedName) => {
            if (type === 'checkbox') {
                this.setState({ [filedName]: value });
                return false;
            }
            this.setState({ [e.target.name]: e.target.value })

        };

        const changed = (e) =>{
            this.setState({ [e.target.name]: e.target.value })
        };

        const changedValue = (name, data) => { this.setState({ [name]: data }) };

        const doSumbit = (e) => {
            e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다

            axios.post(cp.server_ip + '/api/withdraw/add_info',
                {
                    data: {
                        token: window.localStorage['nu_token'],
                        data: this.state,
                    }
                }
            ).then(res => {
                alert(res.data.msg);
                window.location.href = "/#withdraw";
            }).catch(err => { console.log(err); });
            return false;
        }
        return (
        <div className="content">
            <Grid fluid>
            <NavLink
                to={logLink}
                className="nav-link"
                activeClassName="active"
            >
                <p style={{textAlign:"right"}}>Log History</p>
            </NavLink>
            <Row>
                <Col md={12}>
                <Card
                    title="Withraw Info Write"
                    content={
                    <form method='post' onSubmit={(e ) => {doSumbit(e)}}>
                        <Row>
                            <FormInputs
                                changeAction={changed}
                                ncols={["col-md-2","col-md-2", "col-md-4"]}
                                proprieties={[
                                    {
                                        label: "coin type",
                                        name: 'coin_type',
                                        componentClass: "input",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "AIPE",
                                        defaultValue: this.state.coin_type,
                                        description: '스왑될 코인 심볼을 적어주세요(대문자)',
                                        required: true
                                    },
                                    {
                                        label: "coin exchange",
                                        name: 'coin_exchange',
                                        componentClass: "input",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "Coinbene",
                                        defaultValue: this.state.coin_exchange,
                                        description: '이벤트 거래소 명을 입력해 주세요',
                                        required: true
                                    },
                                    {
                                        label: "link exchange",
                                        name: 'link_exchange',
                                        componentClass: "input",
                                        type: "text",
                                        bsClass: "form-control",
                                        placeholder: "https://www.coinbene.com/login/register.html#/?type=invitation&id=56966631&site=MAIN",
                                        defaultValue: this.state.link_exchange,
                                        description: '거래소 링크를 입력 해주세요',
                                        required: true
                                    }
                                ]}
                            />
                        </Row>
                        <Row>
                        <Col md={2}>
                            <CustomDatePicker
                            label = 'start date'
                            name = 'start_date'
                            changeAction = {changedValue}
                            defaultDate = {this.state.start_date}
                            description = '출금 시작 날짜를 선택해 주세요'

                            />
                        </Col>
                       <FormInputs
                            changeAction = {changed}
                            ncols={["col-md-2"]}
                            proprieties={[
                            {
                                label: "start time",
                                name : 'start_time',
                                componentClass: "select",
                                type:"select",
                                bsClass: "form-control",
                                defaultValue: this.state.start_time,
                                description: '출금 시작 시간를 선택해 주세요 00-23',
                                required : true,
                                option:[
                                {	value : '00' ,view : '00' },
                                {	value : '01' ,view : '01' },
                                {	value : '02' ,view : '02' },
                                {	value : '03' ,view : '03' },
                                {	value : '04' ,view : '04' },
                                {	value : '05' ,view : '05' },
                                {	value : '06' ,view : '06' },
                                {	value : '07' ,view : '07' },
                                {	value : '08' ,view : '08' },
                                {	value : '09' ,view : '09' },
                                {	value : '10' ,view : '10' },
                                {	value : '11' ,view : '11' },
                                {	value : '12' ,view : '12' },
                                {	value : '13' ,view : '13' },
                                {	value : '14' ,view : '14' },
                                {	value : '15' ,view : '15' },
                                {	value : '16' ,view : '16' },
                                {	value : '17' ,view : '17' },
                                {	value : '18' ,view : '18' },
                                {	value : '19' ,view : '19' },
                                {	value : '20' ,view : '20' },
                                {	value : '21' ,view : '21' },
                                {	value : '22' ,view : '22' },
                                {	value : '23' ,view : '23' },
                                {	value : '24' ,view : '24' },
                                ]
                            }
                            ]}
                        />



                        <Col md={2}>
                            <CustomDatePicker
                            label = 'end date'
                            name = 'end_date'
                            changeAction = {changedValue}
                            defaultDate = {this.state.end_date}
                            description = '출금 마감 날짜를 선택해 주세요'

                            />
                        </Col>

                       <FormInputs
                            changeAction = {changed}
                            ncols={["col-md-2"]}
                            proprieties={[
                            {
                                label: "end time",
                                name : 'end_time',
                                componentClass: "select",
                                type:"select",
                                bsClass: "form-control",
                                defaultValue: this.state.end_time,
                                description: '출금 마감 시간를 선택해 주세요 0-23',
                                required : true,
                                option:[
                                {	value : '00' ,view : '00' },
                                {	value : '01' ,view : '01' },
                                {	value : '02' ,view : '02' },
                                {	value : '03' ,view : '03' },
                                {	value : '04' ,view : '04' },
                                {	value : '05' ,view : '05' },
                                {	value : '06' ,view : '06' },
                                {	value : '07' ,view : '07' },
                                {	value : '08' ,view : '08' },
                                {	value : '09' ,view : '09' },
                                {	value : '10' ,view : '10' },
                                {	value : '11' ,view : '11' },
                                {	value : '12' ,view : '12' },
                                {	value : '13' ,view : '13' },
                                {	value : '14' ,view : '14' },
                                {	value : '15' ,view : '15' },
                                {	value : '16' ,view : '16' },
                                {	value : '17' ,view : '17' },
                                {	value : '18' ,view : '18' },
                                {	value : '19' ,view : '19' },
                                {	value : '20' ,view : '20' },
                                {	value : '21' ,view : '21' },
                                {	value : '22' ,view : '22' },
                                {	value : '23' ,view : '23' },
                                {	value : '24' ,view : '24' },
                                ]
                            }
                            ]}
                        />

                       <FormInputs
                            changeAction = {changed}
                            ncols={["col-md-2"]}
                            proprieties={[
                            {
                                label: "status",
                                name : 'status',
                                componentClass: "select",
                                type:"select",
                                bsClass: "form-control",
                                defaultValue: this.state.status,
                                description: '이벤트 진행여부를 등록해 주세요',
                                required : true,
                                option:[
                                {	value : 'R' ,view : '이벤트 대기중' },
                                {	value : 'I' ,view : '이벤트 진행중' },
                                {	value : 'C' ,view : '이벤트 마감' },
                                ]
                            }
                            ]}
                        />

                        {/* <Col md={2}>
                            <br />
                            <Checkbox
                                changeAction = {changedCheck}
                                number="1"
                                name = 'special'
                                isChecked= {Boolean(this.state.special)}
                                label = "스페셜투표(special Vote)"
                            />

                        </Col>

                        <Col md={1}>
                            <br />
                            <Checkbox
                                changeAction = {changedCheck}
                                number="2"
                                name = 'default'
                                isChecked= {Boolean(this.state.default)}
                                label = "고정(default)"
                            />

                        </Col> */}
                        </Row>

                        <Row>
                        <FormInputs
                            changeAction = {changed}
                            ncols={["col-md-2" , "col-md-2", "col-md-2", "col-md-2", "col-md-2", "col-md-2"]}
                            proprieties={[
                            {
                                label: "total amount",
                                name : 'total_amount',
                                componentClass: "input",
                                type:"number",
                                bsClass: "form-control",
                                placeholder: "10000000",
                                defaultValue: this.state.total_amount,
                                description: '총 출금 수량을 입력해 주세요',
                                required : true
                            },
                            {
                                label: "personal amount min",
                                name : 'personal_amount_min',
                                componentClass: "input",
                                type:"number",
                                bsClass: "form-control",
                                placeholder: "10000",
                                defaultValue: this.state.personal_amount_min,
                                description: '출금 최소한도를 입력해 주세요',
                                required : true
                            },
                            {
                                label: "personal amount max",
                                name : 'personal_amount_max',
                                componentClass: "input",
                                type:"number",
                                bsClass: "form-control",
                                placeholder: "50000",
                                defaultValue: this.state.personal_amount_max,
                                description: '출금 최대한도를 입력해 주세요',
                                required : true
                            },
                            {
                                label: "unit min",
                                name : 'unit_min',
                                componentClass: "input",
                                type:"number",
                                bsClass: "form-control",
                                placeholder: "1000",
                                defaultValue:this.state.unit_min,
                                description: '출금신청 수량 단위를 입력해 주세요',
                                required : true
                            },
                            {
                                label: "ex ratio",
                                name : 'ex_ratio',
                                componentClass: "input",
                                type:"number",
                                bsClass: "form-control",
                                placeholder: "50",
                                defaultValue: this.state.ex_ratio,
                                description: '코인 스왑 비율을 입력해 주세요',
                                required : true
                            },
                            {
                                label: "fees",
                                name : 'fees',
                                componentClass: "input",
                                type:"number",
                                bsClass: "form-control",
                                placeholder: "3000",
                                defaultValue: this.state.fees,
                                description: 'ai 수수료를 입력해 주세요',
                                required : true
                            }
                            ]}
                        />
                        </Row>


                        <Button bsStyle="info" pullRight fill type="submit" >
                        Update Profile
                        </Button>
                        <div className="clearfix" />
                    </form>
                    }
                />
                </Col>
            </Row>
            </Grid>>
        </div>
        );
    }
}

export default VoteWrite;
