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
  FormControl, Table ,HelpBlock ,InputGroup
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import LanguageSub from './LanguageSub.jsx';

import ErrAction from '../../ErrAction' ;


class Language extends Component {

  constructor(props) {
    super(props);
		this.state = {
				// or Date or Moment.js
				isLoad : false,
				data: new Array(),
				key: '' ,
				mentKr: '' ,
				mentEn: '' ,
				mentChn: '' ,
				searchText : '' ,
				searchAc : false,

		};



  }

	loadLanguage() {
		const queryString = require('query-string');
		const parsed = queryString.parse(this.props.location.search);
		axios.post(cp.server_ip+'/api/language', {
				proc: 'languageList',
				userId: window.localStorage['nu_id'],
				userToken: window.localStorage['nu_token'],
				page : parsed.page ,
				searchText : this.state.searchText,
			
		}).then(res => {
				if(res.data.err){window.location.href='/';}
				else{
					if(this.state.searchAc){
						this.setState({
							data :res.data ,
							key: this.state.key ,
							mentKr: this.state.mentKr ,
							mentEn: this.state.mentEn ,
							mentChn: this.state.mentChn ,
							searchText : this.state.searchText , isLoad : true ,searchAc :true
						})
					}else{
						this.setState({
							data :res.data ,
							key: '' ,
							mentKr: '' ,
							mentEn: '' ,
							mentChn: '' ,
							searchText : '' , isLoad : true ,searchAc :false
						})
					}

				}
				
				
		}).catch(err => { console.log(err); });		
	}

	renderProducts() {
			return this.state.data.map(item => 
					(
					  <LanguageSub key={item._id} data={item} searchText={this.state.searchText} />
					)
			)
	}

  render() {
		//console.log(this.state);
		
		if(!this.state.isLoad){
			this.loadLanguage();
		}

		var tableTh = new Array();
		tableTh.push(
			<tr>
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} >key [키값]</th>
				<th style={Object.assign({}, style.Config.w30, style.Config.wordCenter, style.Config.wordBlod)} >KOREAN [한국어]</th>
				<th style={Object.assign({}, style.Config.w30, style.Config.wordCenter, style.Config.wordBlod)} >ENGLISH [영어]</th>
				<th style={Object.assign({}, style.Config.w30, style.Config.wordCenter, style.Config.wordBlod)} >CHINESE [중국어]</th>
				<th style={Object.assign({}, style.Config.w5, style.Config.wordCenter, style.Config.wordBlod)} ></th>
			</tr>
		
		)

		const changed = (e) => {
				this.setState({ [e.target.name]: e.target.value , searchAc: false})

		};

		const changedSearch = (e) => {
				this.setState({ [e.target.name]: e.target.value , isLoad:false , searchAc : true})

		};
		

		const doSumbit = (e) =>{
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
						if(!res.data.err){this.setState({  isLoad:false , searchAc: false})}
					}
			}).catch(err => { console.log(err); });

			return false;
		}
		return (
      <div className="content">
				<Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Language Set"
                content={
                  <form method='post' onSubmit={(e ) => {doSumbit(e)}}>
										<Row>
											<Col md={2}>
												<FormGroup	controlId="form-control">
													<ControlLabel>key</ControlLabel>
													<FormControl
														componentClass="input"
														type="text"
														name = "key"
														required = "true"
														defaultValue={this.state.key}
														value={this.state.key}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>
													
													<FormControl.Feedback />
													<HelpBlock>해당 맨트의 상징적인 키 맨트를 입력하세요 (단어)</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={3}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>Korean</ControlLabel>
													<FormControl
														name = 'mentKr'
														rows="3"
														componentClass="textarea"
														defaultValue={this.state.mentKr}
														value={this.state.mentKr}
														required = "true"
														onChange={(e ) => {changed(e)}}
													/>
													<HelpBlock>한국어</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={3}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>English</ControlLabel>
													<FormControl
														name = 'mentEn'
														rows="3"
														componentClass="textarea"
														defaultValue={this.state.mentEn}
														value={this.state.mentEn}
														required = "true"
														onChange={(e ) => {changed(e)}}

													/>
													<HelpBlock>영어</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={3}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>Chinese</ControlLabel>
													<FormControl
														name = 'mentChn'
														rows="3"
														componentClass="textarea"
														defaultValue={this.state.mentChn}
														value={this.state.mentChn}
														required = "true"
														onChange={(e ) => {changed(e)}}

													/>
													<HelpBlock>중국어</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={1}>
												<br /><br /><br />
												<Button bsStyle="info" pullLeft fill type="submit" >
													submit
												</Button>
											</Col>

										</Row>
                  </form>
                }
								/>
															
								<Row>
									<Col md={12}>
										<Card
											title="Language List"
											category=""
											ctTableFullWidth
											ctTableResponsive
											content={
											<div>
												<Row style={style.Config.p15}>
													<Col md={2}>
														
														<FormGroup	controlId="form-control">
															<InputGroup>
																<InputGroup.Addon><i className='pe-7s-search'></i></InputGroup.Addon>
																	<FormControl
																		componentClass="input"
																		name = "searchText"
																		defaultValue={this.state.searchText}
																		value={this.state.searchText}
																		onChange={(e ) => {changedSearch(e)}}
																	>
																	</FormControl>
																</InputGroup>
															<FormControl.Feedback />
														</FormGroup>
													</Col>
												</Row>
												<Table striped hover>
													<thead>
														{tableTh}
													</thead>
													<td colSpan='5'>
														<div style={style.Config.p15}>
														{this.renderProducts()}
														</div>
													</td>
												</Table>
											</div>
											}
										/>
									</Col>
								</Row>

	           </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Language;
