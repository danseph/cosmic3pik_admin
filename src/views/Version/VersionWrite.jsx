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
            _id: '',
            version_count: '',
            version_name: '',
            version_type: 'android',
            version_comment: '',
            hard: false,
            isLoad:false
        };
    }


    render() {
        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);
        if (!this.state.isLoad && parsed.uid) {
            axios.post(cp.server_ip + '/api/version/get_history',
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

            axios.post(cp.server_ip + '/api/version/add_info',
                {
                    data: {
                        token: window.localStorage['nu_token'],
                        data: this.state,
                    }
                }
            ).then(res => {
                alert(res.data.msg);
                window.location.href = "/#version";
            }).catch(err => { console.log(err); });
            return false;
        }

        console.log(this.state);

        return (
        <div className="content">
            <Grid fluid>
            <Row>
                <Col md={12}>
                <Card
                    title="Withraw Info Write"
                    content={
                    <form method='post' onSubmit={(e ) => {doSumbit(e)}}>
                        <Row>
                            <FormInputs
                                changeAction={changed}
                                ncols={["col-md-2","col-md-2", "col-md-2", "col-md-4"]}
                                proprieties={[
                                    {
                                        label: "version OS",
                                        name : 'version_type',
                                        componentClass: "select",
                                        type:"select",
                                        bsClass: "form-control",
                                        defaultValue: this.state.version_type,
                                        description: 'OS를 선택해 주세요',
                                        required : true,
                                        option:[
                                        {	value : 'android' ,view : 'android' },
                                        {	value : 'ios' ,view : 'ios' },
                                        ]
                                    },
                                    {
                                        label: "version Count",
                                        name: 'version_count',
                                        componentClass: "input",
                                        type: "Number",
                                        bsClass: "form-control",
                                        placeholder: "1",
                                        defaultValue: this.state.version_count,
                                        description: '버전 카운트를 적어주세요',
                                        required: true
                                    },
                                    {
                                        label: "version Name",
                                        name: 'version_name',
                                        componentClass: "input",
                                        type: "Text",
                                        bsClass: "form-control",
                                        placeholder: "1.0.1",
                                        defaultValue: this.state.version_name,
                                        description: '버전명을 적어주세요',
                                        required: true
                                    },
                                    {
                                        label: "version Comment",
                                        name: 'version_comment',
                                        componentClass: "input",
                                        type: "Text",
                                        bsClass: "form-control",
                                        placeholder: "강제 업데이트 기능 추가",
                                        defaultValue: this.state.version_comment,
                                        description: '간단한 설명을 적어주세요',
                                        required: true
                                    },
                                ]}
                            />
                            <Col md={2}>
                                <br />
                                <Checkbox
                                    changeAction = {changedCheck}
                                    number="2"
                                    name = 'hard'
                                    isChecked= {Boolean(this.state.hard)}
                                    label = "강제업데이트"
                                />

                            </Col>
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
