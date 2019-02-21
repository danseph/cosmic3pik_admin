import React, { Component } from "react";
import axios from 'axios';
import cp from '../../cp';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import ErrAction from '../../ErrAction' ;

class LanguageSub extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: this.props.data.key,
      mentKr: this.props.data.mentKr,
      mentEn: this.props.data.mentEn,
      mentChn: this.props.data.mentChn,
      id: this.props.data._id,
    };
  }

  static defaultProps = {
    data: [],
  };

  doSumbit(e) {
    e.preventDefault();
    axios.post(cp.server_ip+'/api/language', {
        userId: window.localStorage['nu_id'],
        userToken: window.localStorage['nu_token'],
        data : this.state,
        proc: 'languageWrite'
    }).then(res => {
      if (res.data.err) {
        if (res.data.errStatus === 0) {
          alert('Update fail, please login!');
          return;
        }
        ErrAction(res.data.err);
        return;
      }
      this.setState({
        key: res.data.modifiedLanguage.key,
        mentKr: res.data.modifiedLanguage.mentKr,
        mentEn: res.data.modifiedLanguage.mentEn,
        mentChn: res.data.modifiedLanguage.mentChn,
        id: res.data.modifiedLanguage._id
      })
      alert('Success!');
    }).catch(err => { console.log(err); });
    return false;
  }

  doDelete(id) {
    if(window.confirm('Are you sure?')){
      axios.post(cp.server_ip+'/api/language', {
        userId: window.localStorage['nu_id'],
        userToken: window.localStorage['nu_token'],
        id: this.state.id,
        proc: 'languageDelete'
      }).then(res => {
        var elem = document.getElementById(String(id));
        elem.parentElement.removeChild(elem);
      }).catch(err => { console.log(err); });
      return false;
    }
  }

  changed(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
        <form
          method='post'
          onSubmit={(e) => {this.doSumbit(e)}}
          id={this.state.id}>
          <Row key={this.state.id} style={{padding: '15px'}}>
            <Col md={2}>
              <FormGroup 	controlId="form-control">
                <FormControl
                  componentClass="input"
                  name = "key"
                  rows="1"
                  required = "true"
                  value={this.state.key}
                  disabled
                >
                </FormControl>
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup controlId="formControlsTextarea" >
                <FormControl
                  name = 'mentKr'
                  rows="3"
                  componentClass="textarea"
                  defaultValue={this.state.mentKr}
                  required = "true"
                  onChange={(e) => {this.changed(e)}}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup controlId="formControlsTextarea">
                <FormControl
                  name = 'mentEn'
                  rows="3"
                  componentClass="textarea"
                  defaultValue={this.state.mentEn}
                  required = "true"
                  onChange={(e) => {this.changed(e)}}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup controlId="formControlsTextarea">
                <FormControl
                  name = 'mentChn'
                  rows="3"
                  componentClass="textarea"
                  defaultValue={this.state.mentChn}
                  required = "true"
                  onChange={(e) => {this.changed(e)}}
                />
              </FormGroup>
            </Col>
            <Col md={1}>
              <Button
                style={{
                  width: '5em',
                  padding: '.5em .1em',
                  margin: '0 .2em .2em 0'}}
                bsStyle="info"
                pullLeft
                fill
                type="submit">
                Edit
              </Button>
              <Button
                style={{
                  width: '5em',
                  padding: '.5em .1em'}}
                bsStyle="danger"
                pullLeft
                fill
                onClick={() => {this.doDelete(this.state.id)}}
                type="button">
                Delete
              </Button>
            </Col>
          </Row>
        </form>
    );
  }
}

export default LanguageSub;
