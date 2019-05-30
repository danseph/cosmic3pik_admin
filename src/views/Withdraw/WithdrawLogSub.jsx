import React, { Component } from "react";
import axios from 'axios';
import cp from '../../cp';
import { Grid, Row, Col, Table, FormGroup, FormControl } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import ErrAction from '../../ErrAction' ;
import { style } from "variables/Variables.jsx";
import moment from 'moment';
import Clipboard from 'react-clipboard.js';
class LanguageSub extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
        this.changed = this.changed.bind(this);
    }

    static defaultProps = {
        data: [],
    };

    //   doSumbit(e) {
    //     e.preventDefault();
    //     axios.post(cp.server_ip+'/api/language', {
    //         userId: window.localStorage['nu_id'],
    //         userToken: window.localStorage['nu_token'],
    //         data : this.state,
    //         proc: 'languageWrite'
    //     }).then(res => {
    //       if (res.data.err) {
    //         if (res.data.errStatus === 0) {
    //           alert('Update fail, please login!');
    //           return;
    //         }
    //         ErrAction(res.data.err);
    //         return;
    //       }
    //       this.setState({
    //         key: res.data.modifiedLanguage.key,
    //         mentKr: res.data.modifiedLanguage.mentKr,
    //         mentEn: res.data.modifiedLanguage.mentEn,
    //         mentChn: res.data.modifiedLanguage.mentChn,
    //         mentJa: res.data.modifiedLanguage.mentJa,
    //         id: res.data.modifiedLanguage._id
    //       })
    //       alert('Success!');
    //     }).catch(err => { console.log(err); });
    //     return false;
    //   }

    //   doDelete(id) {
    //     if(window.confirm('Are you sure?')){
    //       axios.post(cp.server_ip+'/api/language', {
    //         userId: window.localStorage['nu_id'],
    //         userToken: window.localStorage['nu_token'],
    //         id: this.state.id,
    //         proc: 'languageDelete'
    //       }).then(res => {
    //         var elem = document.getElementById(String(id));
    //         elem.parentElement.removeChild(elem);
    //       }).catch(err => { console.log(err); });
    //       return false;
    //     }
    //   }

    changed(e) {
        var tempData = this.state.data;
        tempData[e.target.name] = e.target.value;
        this.setState({ data: tempData })
    }

    async update(e) {
        if (window.confirm('완료처리 하시겠습니까?')) {
            var status = await this.props.updateEvent(this.state.data);
            this.setState({ data: status });
        }
    }
    async cancle(e){
        if (window.confirm('취소하시겠습니까? 한번 선택하시면 수정 할 수 없습니다.')) {
            var status = await this.props.cancleEvent(this.state.data);
            this.setState({ data: status });
        }
    }

    addComma = (num) => {
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');
    }

    walletCopy = (e,text) => {
        var clipboard = new Clipboard(e.target, {
            target: function() {
                return document.querySelector('#copy-target');
            }
        });
    }

  makeLanguageList = () => {
    const item = this.state.data;
    var crDate = moment(item.cr_date).format('YYYY-MM-DD HH:mm');
    var userStatus = {'R' : '준비중' , 'I' : "진행중" , 'C' : '진행완료', 'W' : '취소완료'};
    return (
        <tr style={style.Config.pointer} key={item._id} >
            <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{item.nick}</td>
            <td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{this.addComma(item.ai_amount)}</td>
            <td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{item.coin_type} </td>
            <td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{this.addComma(item.coin_amount)}</td>
            <td style={Object.assign({}, style.Config.w15, style.Config.wordLeft)}>
                <Clipboard data-clipboard-text={item.wallet}>
                    {item.wallet}
                </Clipboard>
            </td>
            <td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)}>{userStatus[item.status]}</td>
            <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)}>{crDate}</td>
            <td style={Object.assign({}, style.Config.w35, style.Config.wordCenter)}>
                <FormGroup controlId="formControlsTextarea">
                    <FormControl
                        componentClass="textarea"
                        defaultValue={item.txid}
                        name='txid'
                        required="false"
                        disabled={item.disabled}
                        onChange={(e) => { this.changed(e) }}
                    >
                    </FormControl>
                    <FormControl.Feedback />
                </FormGroup>
            </td>
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
                    onClick={(e) => { this.update(e) }}
                    type="button">
                    완료하기
                        </Button>
                {(item.status === 'R' || item.status === 'I') &&
                    <Button
                        style={{
                            width: '5em',
                            padding: '.5em .1em',
                            margin: '0 .2em .2em 0'
                        }}
                        bsStyle="warning"
                        pullLeft
                        fill
                        onClick={(e) => { this.cancle(e) }}
                        type="button">
                        취소하기
                    </Button>
                }
            </th>
        </tr>
    );
  }

  render() {
    return (
        <React.Fragment>
            {this.makeLanguageList()}
        </React.Fragment>
    );
  }
}

export default LanguageSub;
