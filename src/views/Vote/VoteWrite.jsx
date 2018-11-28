import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import CustomDatePicker from "components/CustomDatepicker/CustomDatepicker.jsx";
import avatar from "assets/img/faces/face-3.jpg";
import { NavDropdown  , MenuItem} from "react-bootstrap";
import axios from 'axios';
import cp from '../../cp';
import Select from 'react-select';
import Checkbox from 'components/CustomCheckbox/CustomCheckbox';


class VoteWrite extends Component {
	constructor(props, context) {
			super(props, context);

			// Initial state with date
			this.state = {
					// or Date or Moment.js
					voteId : '',
					voteDate: new Date(),
					voteNumber : '' ,
					voteType : '',
					rewordCoin : '' ,
					steadyAreaT : '',
					steadyAreaB : '' ,
					firstVoteReword : [],
					firstWinReword : [],
					etcReword : [],
					voteCountT : '0',
					voteCount1 : '0',
					voteCount2 : '0',
					voteCount3 : '0',
					special : false,
					default : false,
					rewordCoinList : [] ,
					isLoad : false ,
					
			};
	}

	addFirstVoteReword(){		// 참여보상 추가 이벤트
		let temp = this.state.firstVoteReword;
		temp.push({'startNum' : '' , 'endNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'firstVote'});
		this.setState({ ['firstVoteReword']: temp})
	}
	addFirstWinReword(){		// 정답보상 추가 이벤트
		let temp = this.state.firstWinReword;
		temp.push({'startNum' : '' , 'endNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'firstWin'});
		this.setState({ ['firstWinReword']: temp})
	}
	addEtcReword(){					// 그외보상 추가 이벤트
		let temp = this.state.etcReword;
		temp.push({'startNum' : ''  , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'luckyVote'});
		this.setState({ ['etcReword']: temp})
	}


  render() {


		const queryString = require('query-string');
		const parsed = queryString.parse(this.props.location.search);
		//console.log(parsed);

		var rewordCoinObject = [];			//코인 항목 리스트 저장
		var rewordCoinValue = {};			//코인 항목 리스트 저장
		for(var coinItem of this.state.rewordCoinList){			//코인 리스트
			rewordCoinObject.push({ value: coinItem.symbol, label: coinItem.name+'('+coinItem.nameKR+')' , class: 'coinList' , name : coinItem.name });
			if(coinItem.symbol == this.state.rewordCoin){
				rewordCoinValue = {value: this.state.rewordCoin, label: coinItem.name+'('+coinItem.nameKR+')' , class: 'coinList' , name: coinItem.name };

			}
		}		
	
		if(!this.state.isLoad && parsed.uid){
			axios.post(cp.server_ip+'/api/vote', {
					proc: 'voteDetail',
					userId: window.localStorage['nu_id'],
					userToken: window.localStorage['nu_token'],
					uid : parsed.uid
			}).then(res => {
					if(res.data.err){window.location.href='/';}
					else{
						axios.post(cp.server_ip+'/api/config', {
								proc: 'coinList',
								userId: window.localStorage['nu_id'],
								userToken: window.localStorage['nu_token'],
								uid : parsed.uid
						}).then(res2 => {
								if(res2.data.err){window.location.href='/';}
								else{
									this.setState({
										voteId : res.data._id,
										voteDate: res.data.voteDate,
										voteNumber : res.data.voteNumber,
										voteType : res.data.voteType,
										rewordCoin : res.data.rewordCoin,
										steadyAreaT : res.data.steadyAreaT,
										steadyAreaB : res.data.steadyAreaB,
										firstVoteReword :res.data.firstVoteReword,
										firstWinReword : res.data.firstWinReword,
										etcReword : res.data.etcReword,
										voteCountT : res.data.voteCountT,
										voteCount1 : res.data.voteCount1,
										voteCount2 : res.data.voteCount2,
										voteCount3 : res.data.voteCount3,
										special : res.data.special,
										default : res.data.default,
										rewordCoinList : res2.data.coinList,
										isLoad : true ,
									
									})	
								}
						}).catch(err => { console.log(err); });

					}



			}).catch(err => { console.log(err); });
		}else if(!this.state.isLoad && !parsed.uid){
			axios.post(cp.server_ip+'/api/config', {
					proc: 'coinList',
					userId: window.localStorage['nu_id'],
					userToken: window.localStorage['nu_token'],
			}).then(res2 => {
					if(res2.data.err){window.location.href='/';}
					else{
						console.log(res2);
						this.setState({
							rewordCoinList : res2.data.coinList,
							isLoad : true ,
						})	
					}
			}).catch(err => { console.log(err); });
		}



		const removeField = (name , i) => {		// 보상항목 제거 이벤트
			let temp = this.state[name];
			temp.splice(i,1);
			this.setState({ [name]: temp })

		}

		const changedCheck = (e , type , value , filedName) => {
			if(type == 'checkbox'){
				this.setState({ [filedName]:value });
				return false;
			}
			this.setState({ [e.target.name]: e.target.value })

		};
		
		const changed = (e , arrayNum , filedName) => {
			if(e.class == 'coinList'){ // 코인선택일시
				this.setState({ rewordCoin: e.value })
				return false;
			}
			if(arrayNum >= 0){
				let temp = this.state[filedName];
				temp[arrayNum][e.target.name] = e.target.value;
				this.setState({ [filedName]: temp })
				return false;
			}else{
				this.setState({ [e.target.name]: e.target.value })
				return false;
			}
		};
		const changedValue = (name, data) => {this.setState({ [name]: data })};
		
		var firstVoteRewordFiled = [];  // 참여보상 input 배열
		var firstWinRewordFiled = [];  // 정답보상 input 배열
		var etcRewordFiled = [];  // 그외보상 input 배열

		var num = 0;
		for( item of this.state.firstVoteReword){		// 참여보상 input 배열 만들기
			firstVoteRewordFiled.push(
					<Row>
						<FormInputs
							changeAction = {changed}
							arrayNum = {num}
							filedName = 'firstVoteReword'
							ncols={["col-md-2" , "col-md-2" , "col-md-2" , "col-md-2"]}
							proprieties={[
								{
									label: "reword start num",
									name : 'startNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.startNum,
									description: '참여보상 시작순번',
									required : true,
								},
								{
									label: "reword end num",
									name : 'endNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.endNum,
									description: '참여보상 마지막순번',
									required : true,
								},
								{
									label: "reword coin num",
									name : 'coinNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.coinNum,
									description: '참여보상 코인갯수',
									required : true,
								},
								{
									label: "reword point num",
									name : 'pointNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.pointNum,
									description: '참여보상 포인트점수',
									required : true,
								},
							]}
						/>
            <Col md={1}>
            <ControlLabel>&nbsp;</ControlLabel>
							<div>
								<Button  bsStyle="danger" fill type="button" filedName = 'firstVoteReword'  removeAction={removeField} cntNum={num} fill type="button" >
									delete
								</Button>
							</div>
            </Col>

					</Row>			
			)
			num++;
		}

		var num = 0;
		for( item of this.state.firstWinReword ){		// 참여보상 input 배열 만들기
			firstWinRewordFiled.push(
					<Row>
						<FormInputs
							changeAction = {changed}
							arrayNum = {num}
							filedName = 'firstWinReword'
							ncols={["col-md-2" , "col-md-2" , "col-md-2" , "col-md-2"]}
							proprieties={[
								{
									label: "reword start num",
									name : 'startNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.startNum,
									description: '정답보상 시작순번',
									required : true,
								},
								{
									label: "reword end num",
									name : 'endNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.endNum,
									description: '정답보상 마지막순번',
									required : true,
								},
								{
									label: "reword coin num",
									name : 'coinNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.coinNum,
									description: '정답보상 코인갯수',
									required : true,
								},
								{
									label: "reword point num",
									name : 'pointNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.pointNum,
									description: '정답보상 포인트점수',
									required : true,
								},
							]}
						/>
            <Col md={1}>
            <ControlLabel>&nbsp;</ControlLabel>
							<div>
								<Button  bsStyle="danger" fill type="button" filedName = 'firstWinReword' removeAction={removeField} cntNum={num}  fill type="button" >
									delete
								</Button>
							</div>
            </Col>
					</Row>			
			)
			num++;
		}

		var num = 0;
		for(var item of this.state.etcReword){		// 참여보상 input 배열 만들기
			etcRewordFiled.push(
					<Row>
						<FormInputs
							changeAction = {changed}
							arrayNum = {num}
							filedName = 'etcReword'
							ncols={["col-md-2" ,  "col-md-2" , "col-md-2" ]}
							proprieties={[
								{
									label: "reword start num",
									name : 'startNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.startNum,
									description: '그외보상 시작순번',
									required : true,
								},
								{
									label: "reword coin num",
									name : 'coinNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.coinNum,
									description: '그외보상 코인갯수',
									required : true,
								},
								{
									label: "reword point num",
									name : 'pointNum',
									componentClass: "input",
									type:"number",
									bsClass: "form-control",
									placeholder: "0",
									defaultValue: item.pointNum,
									description: '그외보상 포인트점수',
									required : true,
								},
							]}
						/>
            <Col md={1}>
            <ControlLabel>&nbsp;</ControlLabel>
							<div>
								<Button  bsStyle="danger" fill type="button" filedName = 'etcReword' removeAction={removeField} cntNum={num}  fill type="button" >
									delete
								</Button>
							</div>
            </Col>

					</Row>			
			)
			num++;
		}

		// 토큰에따른 회차
		var voteNumberOption = [];
		voteNumberOption.push({value : '' , view : '선택해주세요'});
		if(this.state.voteType == 'BTC'){
			for(var i = 1 ; i < 13 ; i++){
				voteNumberOption.push({value : i*2 , view : i*2});
			}
		}else if(this.state.voteType == 'ETH'){
			for(var i = 1 ; i < 13 ; i++){
				voteNumberOption.push({value : (i*2)-1 , view : (i*2)-1});

			}
		}


		const doSumbit = (e) =>{
			e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다
			axios.post(cp.server_ip+'/api/vote', {
					userId: window.localStorage['nu_id'],
					userToken: window.localStorage['nu_token'],
					data : this.state,
					proc: 'voteWrite'
			}).then(res => {
				 window.location.href="/#vote";
			}).catch(err => { console.log(err); });

			return false;
		}
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Vote Write"
                content={
                  <form method='post' onSubmit={(e ) => {doSumbit(e)}}>
	
                    <Row>
                      <Col md={2}>
												<CustomDatePicker
													label = 'vote date'
													name = 'voteDate'
													changeAction = {changedValue}
													defaultDate = {this.state.voteDate}
													description = '투표할 날짜를 선택해 주세요'

												/>
                      </Col>

											<FormInputs
												changeAction = {changed}
												ncols={["col-md-2", "col-md-2"]}
												proprieties={[
													{
														label: "vote type",
														name : 'voteType',
														componentClass: "select",
														type:"select",
														bsClass: "form-control",
														defaultValue: this.state.voteType,
														description: '투표할 코인을 선택해 주세요',
														required : true,
														option:[
															{	value : '',view : '선택해주세요' },
															{	value : 'BTC',view : '비트코인(BTC)' },
															{	value : 'ETH',view : '이더리움(ETH)' },
		
														]
													},
													{
														label: "vote number",
														name : 'voteNumber',
														componentClass: "select",
														type:"select",
														bsClass: "form-control",
														defaultValue: this.state.voteNumber,
														required:true,
														description: '투표할 회차를 선택해 주세요',
														option: voteNumberOption
													},
												]}
											/>

											<Col md={2}>
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

											</Col>
                    </Row>
                    <Row>
											<FormInputs
												changeAction = {changed}
												ncols={["col-md-2" , "col-md-2"]}
												proprieties={[
													{
														label: "steady area top",
														name : 'steadyAreaT',
														componentClass: "input",
														type:"number",
														bsClass: "form-control",
														placeholder: "0.05",
														defaultValue: this.state.steadyAreaT,
														description: '보합구간 상단 %',
														required : true
													},
													{
														label: "steady area bottom",
														name : 'steadyAreaB',
														componentClass: "input",
														type:"number",
														bsClass: "form-control",
														placeholder: "0.05",
														defaultValue: this.state.steadyAreaB,
														description: '보합구간 하단 %',
														required : true
													},
												]}
											/>
										</Row>
                    <Row>
										<Col md={2}>
											<Select
												value={rewordCoinValue}
												onChange={changed}
												options={rewordCoinObject}
											/>
										</Col>


                      <Col md={10}>
                        <ControlLabel>보상방식 추가</ControlLabel>
												<div>
													<Button  onClick={(e ) => {this.addFirstVoteReword(e)}}  fill type="button">
														선착순 참가 보상추가
													</Button>&nbsp;&nbsp;
													<Button  onClick={(e ) => {this.addFirstWinReword(e)}}  fill type="button">
														선착순 정답 보상추가
													</Button>&nbsp;&nbsp;
													<Button  onClick={(e ) => {this.addEtcReword(e)}}  fill type="button">
														그외 보상추가
													</Button>
												</div>
											</Col>

                    </Row>
										<Row>
                      <Col md={12}>
												<h4>참여보상</h4>
                      </Col>

										</Row>
										{firstVoteRewordFiled}
										<Row>
                      <Col md={12}>
												<h4>정답보상</h4>
                      </Col>

										</Row>
										{firstWinRewordFiled}

										<Row>
                      <Col md={12}>
												<h4>그외보상</h4>
                      </Col>

										</Row>
										{etcRewordFiled}

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
