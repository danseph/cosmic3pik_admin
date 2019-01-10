import React, { Component } from "react";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray ,style } from "variables/Variables.jsx";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import cp from '../../cp';
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl, Table ,HelpBlock
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import ErrAction from '../../ErrAction' ;
import reactStringReplace from "react-string-replace";
import $ from 'jquery';
import classNames from 'classnames';


class LanguageSub extends Component {





  constructor(props) {
    super(props);

    this.state = {
        key: this.props.data.key ,
        mentKr:  this.props.data.mentKr ,
        mentEn:  this.props.data.mentEn ,
        mentChn:  this.props.data.mentChn ,
        id:  this.props.data._id

    };
  }

  static defaultProps = {
    data: []
  }


  render() {

    const curState = {};



    var replaceAll = (str, searchStr) => {
      if(this.props.searchText != ''){
        var str2  = String(str).split(/\n/g);
        var tempStr = [];
        for(var item of str2){
            tempStr.push(<div>
              {reactStringReplace(item ,searchStr, (match, i) => (
                <span className='highlight'>{searchStr}</span>
              ))}
            </div>);


        }


        return tempStr
      }

    }


    const changed = (e ) => {
        //console.log(e.target.name);
        this.setState({ [e.target.name]: e.target.value })

    };

    const doDelete = (id) =>{
      if(window.confirm('삭제하시곘습니까?')){
        axios.post(cp.server_ip+'/api/language', {
          userId: window.localStorage['nu_id'],
          userToken: window.localStorage['nu_token'],
          id : this.state.id,
          proc: 'languageDelete'
        }).then(res => {
          var elem = document.getElementById(String(id));
          elem.parentElement.removeChild(elem);
        }).catch(err => { console.log(err); });
        return false;
      }
    }

    const doSumbit = (e) =>{
      //console.log(this.state);
      e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다
      axios.post(cp.server_ip+'/api/language', {
          userId: window.localStorage['nu_id'],
          userToken: window.localStorage['nu_token'],
          data : this.state,
          proc: 'languageWrite'
      }).then(res => {
          if(res.data.err){
            ErrAction(res.data.err);
            return
          }else{
            this.setState({
              key: res.data.modifiedLanguage.key ,
              mentKr:  res.data.modifiedLanguage.mentKr ,
              mentEn:  res.data.modifiedLanguage.mentEn ,
              mentChn:  res.data.modifiedLanguage.mentChn ,
              id:  res.data.modifiedLanguage._id
            })

            alert('수정완료');
          }
      }).catch(err => { console.log(err); });

      return false;
    }



    return (

        <form method='post' onSubmit={(e ) => {doSumbit(e)}} id={this.state.id}>
          <Row>
            <Col md={2}>

              <FormGroup 	controlId="form-control">
                <div className ={classNames({'highlight-div': true}) }>{replaceAll(this.state.key , this.props.searchText)}</div>
                <FormControl
                  componentClass="textarea"
                  name = "key"
                  rows="1"
                  required = "true"
                  defaultValue={this.state.key}
                  value={this.state.key}
                  onChange={(e ) => {changed(e)}}

                >
                </FormControl>

                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup controlId="formControlsTextarea" >
                <div className ={classNames({'highlight-div': true}) }>{replaceAll(this.state.mentKr , this.props.searchText)}</div>
                <FormControl
                  name = 'mentKr'
                  rows="3"
                  componentClass="textarea"
                  defaultValue={this.state.mentKr}
                  value={this.state.mentKr}
                  required = "true"
                  onChange={(e ) => {changed(e)}}

                />

              </FormGroup>

            </Col>
            <Col md={3}>
              <FormGroup controlId="formControlsTextarea">
                <div className ={classNames({'highlight-div': true}) }>{replaceAll(this.state.mentEn , this.props.searchText)}</div>
                <FormControl
                  name = 'mentEn'
                  rows="3"
                  componentClass="textarea"
                  defaultValue={this.state.mentEn}
                  value={this.state.mentEn}
                  required = "true"
                  onChange={(e ) => {changed(e)}}

                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup controlId="formControlsTextarea">
                <div className ={classNames({'highlight-div': true}) }>{replaceAll(this.state.mentChn , this.props.searchText)}</div>
                <FormControl
                  name = 'mentChn'
                  rows="3"
                  componentClass="textarea"
                  defaultValue={this.state.mentChn}
                  value={this.state.mentChn}
                  required = "true"
                  onChange={(e ) => {changed(e)}}

                />
              </FormGroup>
            </Col>
            <Col md={1}>

              <Button bsStyle="info" pullLeft fill type="submit" >
                edit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Button>
              <Button bsStyle="danger" pullLeft fill onClick={(e ) => {doDelete(this.state.id)}}  type="button" >
                delete&nbsp;
              </Button>
            </Col>
          </Row>
        </form>
    );
  }
}

export default LanguageSub;
