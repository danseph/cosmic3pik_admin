import React, { Component } from "react";
import { FormattedMessage } from 'react-intl'

import Card from "components/Card/Card.jsx";
import { style } from "variables/Variables.jsx";
import axios from 'axios';
import cp from '../../cp';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
	FormControl,
	InputGroup
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import LanguageSub from './LanguageSub.jsx';

import ErrAction from '../../ErrAction' ;

class Language extends Component {

  constructor(props) {
    super(props);
		this.state = {
				isLoad : false,
				data: [],
				key: '' ,
				mentKr: '' ,
				mentEn: '' ,
				mentChn: '' ,
				mentJa: '' ,
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
							data :res.data,
							key: this.state.key,
							mentKr: this.state.mentKr,
							mentEn: this.state.mentEn,
							mentChn: this.state.mentChn,
							mentJa: this.state.mentJa,
							searchText: this.state.searchText,
							isLoad: true,
							searchAc :true,
						})
					}else{
						this.setState({
							data :res.data,
							key: '' ,
							mentKr: '',
							mentEn: '' ,
							mentChn: '' ,
							mentJa: '' ,
							searchText : '',
							isLoad : true,
							searchAc :false,
						})
					}
				}
		}).catch(err => { console.log(err); });
	}

	changed(e) {
		this.setState({ [e.target.name]: e.target.value , searchAc: false})
	};

	changedSearch(e) {
		this.setState({ [e.target.name]: e.target.value , isLoad:false , searchAc : true})
	};

	doSumbit(e) {
		e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다
		axios.post(cp.server_ip+'/api/language', {
				userId: window.localStorage['nu_id'],
				userToken: window.localStorage['nu_token'],
				data : {
					key: this.state.key,
					mentChn: this.state.mentChn,
					mentEn: this.state.mentEn,
					mentKr: this.state.mentKr,
					mentJa: this.state.mentJa,
				},
				proc: 'languageWrite'
		}).then(res => {
				if (res.data.err) {
					if (res.data.errStatus === 0) {
						alert('Update fail, please login!');
						return;
					}
					if (res.data.errStatus === 26) {
						alert('Duplicate key');
						return;
					}
					ErrAction(res.data.err);
					return;
				}
				alert('Success!');
				this.setState({
					isLoad:false,
					searchAc: false,
					key: '',
					mentChn: '',
					mentEn: '',
					mentKr: '',
					mentJa: '',
				});
		}).catch(err => { console.log(err); });

		return false;
	}

	makeLanguageInsertBox = () => {
		const boxs = [
			{ id: 'LANGUAGE.UNIQUE_KEY', name: 'key' },
			{ id: 'LANGUAGE.KOREAN', name: 'mentKr' },,
			{ id: 'LANGUAGE.ENGLISH', name: 'mentEn' },,
			{ id: 'LANGUAGE.CHINA', name: 'mentChn' },,
			{ id: 'LANGUAGE.JAPANESE', name: 'mentJa' },
		];

		return (
			<Row>
				{boxs.map(item => {
					return (
						<Col md={2} key={item.name}>
						<FormGroup	controlId="formControlsTextarea">
							<FormControl
								name={item.name}
								label={item.name}
								rows="3"
								componentClass="textarea"
								value={this.state[item.name]}
								required="true"
								onChange={(e) => this.changed(e)}
							>
							</FormControl>
							<ControlLabel style={{float: "right"}}>
								<FormattedMessage id={item.id} />
							</ControlLabel>
							<FormControl.Feedback />
						</FormGroup>
						</Col>
					);
				})}

				<Col md={2}>
					<Button bsStyle="info" pullLeft fill type="submit" >
						submit
					</Button>
				</Col>
			</Row>
		);
	}

	makeLanguageListBoxHeader = () => {
		const list = [
			{ id: 'LANGUAGE.UNIQUE_KEY' },
			{ id: 'LANGUAGE.KOREAN' },
			{ id: 'LANGUAGE.ENGLISH' },
			{ id: 'LANGUAGE.CHINA' },
			{ id: 'LANGUAGE.JAPANESE' },
			{ id: 'LANGUAGE.UNIQUE_KEY' },
		];
		return (
			<Row style={{ padding: '0 15px' }}>
				<div key="1">
					{list.map((item, idx) => (
						<div 
							key={`${item.id}-${idx}`}
							style={
								Object.assign(
									{ width: `${100 / 6}%`, padding: '0 15px' }, 
									style.Config.wordLeft, 
									style.Config.wordBlod, 
									style.Config.floatL
								)}
							>
							<FormattedMessage id={item.id} />
						</div>
					))}
				</div>
			</Row>
		);
	}

	makeLanguageListBox = () => {
			return this.state.data.map(item =>
					(
						<LanguageSub 
							key={item._id} 
							data={item} 
							searchText={this.state.searchText} />
					)
			);
	}

  render() {
		if (!this.state.isLoad) this.loadLanguage();
		return (
      <div className="content">
				<Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Language Set"
                content={
                  <form method='post' onSubmit={(e ) => {this.doSumbit(e)}}>
										{this.makeLanguageInsertBox()}
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
																<InputGroup.Addon><i className="pe-7s-search"></i></InputGroup.Addon>
																	<FormControl
																		componentClass="input"
																		name="searchText"
																		defaultValue={this.state.searchText}
																		onChange={(e) => this.changedSearch(e)}
																	>
																	</FormControl>
																</InputGroup>
															<FormControl.Feedback />
														</FormGroup>
													</Col>
												</Row>
												{this.makeLanguageListBoxHeader()}
												{this.makeLanguageListBox()}
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
