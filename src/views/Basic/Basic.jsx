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
import { NavDropdown  , MenuItem ,HelpBlock} from "react-bootstrap";
import axios from 'axios';
import cp from '../../cp';
import Select from 'react-select';

class Basic extends Component {
  constructor(props, context) {
      super(props, context);

      // Initial state with date
      this.state = {
          configId : '',
          coinList : [] ,
          randomVoteRewordD : [],
          randomWinRewordD : [],
          rankRewordD : [],
          randomVoteRewordW : [],
          randomWinRewordW : [],
          rankRewordW : [],
          randomVoteRewordM : [],
          randomWinRewordM : [],
          rankRewordM : [],
          rankVoteRewordM : [] ,
          rankWinRewordM : [] ,
          contRewordD : [{ 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'contD'}],
          contRewordW : [{ 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'contW'}],
          contRewordM : [{'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'contM'}],
          signReword : [{ 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'sgin'}],
          rewordCoin :
            {
              'randomVoteRewordD' : '' ,
              'randomWinRewordD' : '' ,
              'rankRewordD' : '' ,
              'randomVoteRewordW' : '' ,
              'randomWinRewordW' : '' ,
              'rankRewordW' : '' ,
              'randomVoteRewordM' : '' ,
              'randomWinRewordM' : '' ,
              'rankRewordM' : '' ,
              'rankVoteRewordM' : '' ,
              'rankWinRewordM' : '' ,
              'contRewordD' : '' ,
              'contRewordW' : '' ,
              'contRewordM' : '' ,
              'signReword' : '' ,

            }
          ,
          isLoad:false


      };


  }

  addCoinList(){
    let temp = this.state.coinList;
    temp.push({'key' : '' , 'contractAddress' : '' ,  'symbol' : '' , 'name' : '' , 'nameKR' : ''});
    this.setState({ ['coinList']: temp})
  }

  addRandomVoteRewordD(){		// 일간 참가자 추첨 이벤트
    let temp = this.state.randomVoteRewordD;
    temp.push({'roundNum' : '' ,  'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'randomVoteD'});
    this.setState({ ['randomVoteRewordD']: temp})
  }
  addRandomWinRewordD(){		// 일간 정답자 추첨 이벤트
    let temp = this.state.randomWinRewordD;
    temp.push({'roundNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'randomWinD'});
    this.setState({ ['randomWinRewordD']: temp})
  }
  addRankRewordD(){					// 일간 랭킹 이벤트
    let temp = this.state.rankRewordD;
    temp.push({'roundNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'rankD'});
    this.setState({ ['rankRewordD']: temp})
  }


  addRandomVoteRewordW(){		// 주간 참가자 추첨 이벤트
    let temp = this.state.randomVoteRewordW;
    temp.push({'roundNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'randomVoteW'});
    this.setState({ ['randomVoteRewordW']: temp})
  }
  addRandomWinRewordW(){		// 주간 정답자 추첨 이벤트
    let temp = this.state.randomWinRewordW;
    temp.push({'roundNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'randomWinW'});
    this.setState({ ['randomWinRewordW']: temp})
  }
  addRankRewordW(){					// 주간 랭킹 이벤트
    let temp = this.state.rankRewordW;
    temp.push({'roundNum' : ''  , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'rankW'});
    this.setState({ ['rankRewordW']: temp})
  }


  addRandomVoteRewordM(){		// 월간 참가자 추첨 이벤트
    let temp = this.state.randomVoteRewordM;
    temp.push({'roundNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'randomWinM'});
    this.setState({ ['randomVoteRewordM']: temp})
  }
  addRandomWinRewordM(){		// 월간 정답자 추첨 이벤트
    let temp = this.state.randomWinRewordM;
    temp.push({'roundNum' : '' , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'randomVoteM'});
    this.setState({ ['randomWinRewordM']: temp})
  }
  addRankRewordM(){					// 월간 랭킹 이벤트
    let temp = this.state.rankRewordM;
    temp.push({'roundNum' : ''  , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'rankM'});
    this.setState({ ['rankRewordM']: temp})
  }

  addRankRewordM(){					// 월간 최다 투표자 이벤트
    let temp = this.state.rankVoteRewordM;
    temp.push({'roundNum' : ''  , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'rankVoteM'});
    this.setState({ ['rankVoteRewordM']: temp})
  }

  addRankRewordM(){					// 월간 최다 정답자 이벤트
    let temp = this.state.rankWinRewordM;
    temp.push({'roundNum' : ''  , 'coinNum' : '' , 'pointNum' : '' , 'rewordEtc' : 'rankWinM'});
    this.setState({ ['rankWinRewordM']: temp})
  }

  render() {
    if(!this.state.isLoad){
      axios.post(cp.server_ip+'/api/config', {
          proc: 'configDetail',
          userId: window.localStorage['nu_id'],
          userToken: window.localStorage['nu_token']
      }).then(res => {
          if(res.data.err){window.location.href='/';}
          else{
            this.setState({
              configId : res.data._id,
              coinList: res.data.coinList,
              randomVoteRewordD : res.data.randomVoteRewordD,
              randomWinRewordD : res.data.randomWinRewordD,
              rankRewordD : res.data.rankRewordD,
              randomVoteRewordW : res.data.randomVoteRewordW,
              randomWinRewordW : res.data.randomWinRewordW,
              rankRewordW :res.data.rankRewordW,
              randomVoteRewordM : res.data.randomVoteRewordM,
              randomWinRewordM : res.data.randomWinRewordM,
              rankRewordM : res.data.rankRewordM,
              rankVoteRewordM : res.data.rankVoteRewordM,
              rankWinRewordM : res.data.rankWinRewordM,
              contRewordD : res.data.contRewordD,
              contRewordW : res.data.contRewordW,
              contRewordM : res.data.contRewordM,
              signReword : res.data.signReword,
              rewordCoin : res.data.rewordCoin[0],
              isLoad : true ,

            })
          }

          console.log(res.data._id);

      }).catch(err => { console.log(err); });
    }

    var rewordCoinObject = [];			//코인 항목 리스트 저장
    var rewordCoinValue = [];
    for( var item of Object.keys(this.state.rewordCoin)){
      rewordCoinObject[item] = [];
      for(var coinItem of this.state.coinList){			//코인 리스트
        rewordCoinObject[item].push({ value: coinItem.key, label: coinItem.name+'('+coinItem.nameKR+')' , class: 'coinList' , name : item });
        if(coinItem.key == this.state.rewordCoin[item]){
          rewordCoinValue[item] = {value: this.state.rewordCoin[item], label: coinItem.name+'('+coinItem.nameKR+')' , class: 'coinList' , name : item }

        }
      }
    }


    const removeField = (name , i) => {		// 보상항목 제거 이벤트
      let temp = this.state[name];
      temp.splice(i,1);
      this.setState({ [name]: temp })

    }

    const changed = (e , arrayNum , filedName) => {
      if(e.class == 'coinList'){ // 코인선택일시
        let temp = this.state.rewordCoin;
        temp[e.name] = e.value;
        this.setState({ rewordCoin: temp })
        return false;
      }

      if(arrayNum >= 0){
        let temp = this.state[filedName];
        temp[arrayNum][e.target.name] = e.target.value;
        this.setState({ [filedName]: temp })

      }else{
        this.setState({ [e.target.name]: e.target.value })
      }
    };
    const changedValue = (name, data) => {this.setState({ [name]: data })};




    var defaultRewordArr = {
      randomVoteRewordD : [],
      randomWinRewordD : [],
      rankRewordD : [],
      randomVoteRewordW : [],
      randomWinRewordW : [],
      rankRewordW : [],
      randomVoteRewordM : [],
      randomWinRewordM : [],
      rankRewordM : [] ,
      rankVoteRewordM : [] ,
      rankWinRewordM : [] ,


    }

    var defaultRewordArrNont = {	//논타켓 보상 에리어
      contRewordD : [] ,
      contRewordW : [] ,
      contRewordM : [] ,
      signReword : []
    }

    var coinList = [];  // 코인 리스트




    var makeRewordField = (cate) =>{
      var num = 0;
      for( var item of this.state[cate]){		// 참여보상 input 배열 만들기
        defaultRewordArr[cate].push(
            <Row>


              <FormInputs
                changeAction = {changed}
                arrayNum = {num}
                filedName = {cate}
                ncols={["col-md-2" , "col-md-2" , "col-md-2"]}
                proprieties={[
                  {
                    label: "count",
                    name : 'roundNum',
                    componentClass: "input",
                    type:"text",
                    bsClass: "form-control",
                    placeholder: "0",
                    defaultValue: item.roundNum,
                    description: '카운트',
                    required : true,
                  },
                  {
                    label: "coin number",
                    name : 'coinNum',
                    componentClass: "input",
                    type:"number",
                    bsClass: "form-control",
                    placeholder: "0",
                    defaultValue: item.coinNum,
                    description: '보상 코인 갯수',
                    required : true,
                  },
                  {
                    label: "point number",
                    name : 'pointNum',
                    componentClass: "input",
                    type:"number",
                    bsClass: "form-control",
                    placeholder: "0",
                    defaultValue: item.pointNum,
                    description: '보상 포인트',
                    required : true,
                  }
                ]}
              />
              <Col md={1}>
              <ControlLabel>&nbsp;</ControlLabel>
                <div>
                  <Button  bsStyle="danger" fill type="button" filedName = {cate}  removeAction={removeField} cntNum={num} fill type="button" >
                    delete
                  </Button>
                </div>
              </Col>

            </Row>
        )
        num++;
      }

    }


    var makeRewordFieldNont = (cate) =>{
      var num = 0;
      for( var item of this.state[cate]){		// 논타켓 참여보상 input 배열 만들기
        defaultRewordArrNont[cate].push(
            <Row>
              <FormInputs
                changeAction = {changed}
                arrayNum = {num}
                filedName = {cate}
                ncols={["col-md-4" , "col-md-4"]}
                proprieties={[
                  {
                    label: "coin number",
                    name : 'coinNum',
                    componentClass: "input",
                    type:"number",
                    bsClass: "form-control",
                    placeholder: "0",
                    defaultValue: item.coinNum,
                    description: '보상 코인 갯수',
                    required : true,
                  },
                  {
                    label: "point number",
                    name : 'pointNum',
                    componentClass: "input",
                    type:"number",
                    bsClass: "form-control",
                    placeholder: "0",
                    defaultValue: item.pointNum,
                    description: '보상 포인트',
                    required : true,
                  }
                ]}
              />
            </Row>
        )
        num++;
      }

    }




    var num = 0;
    for(var item of this.state.coinList){		// 참여보상 input 배열 만들기
      coinList.push(
          <Row>
            <FormInputs
              changeAction = {changed}
              arrayNum = {num}
              filedName = 'coinList'
              ncols={["col-md-1" ,"col-md-4" ,  "col-md-2" , "col-md-2" , "col-md-2" ]}
              proprieties={[
                {
                  label: "token key",
                  name : 'key',
                  componentClass: "input",
                  type:"text",
                  bsClass: "form-control",
                  placeholder: "",
                  defaultValue: item.key,
                  description: '토큰 키값 절대 수정 말기',
                  required : true,
                },
								{
									label: "token contract address",
									name : 'contractAddress',
									componentClass: "input",
									type:"text",
									bsClass: "form-control",
									placeholder: "",
									defaultValue: item.contractAddress,
									description: '토큰 컨트랙트 주소',
									required : true,
								},
                {
                  label: "token symbol",
                  name : 'symbol',
                  componentClass: "input",
                  type:"text",
                  bsClass: "form-control",
                  placeholder: "",
                  defaultValue: item.symbol,
                  description: '토큰 심볼',
                  required : true,
                },
                {
                  label: "token name",
                  name : 'name',
                  componentClass: "input",
                  type:"text",
                  bsClass: "form-control",
                  placeholder: "",
                  defaultValue: item.name,
                  description: '토큰명',
                  required : true,
                },
                {
                  label: "token name KR",
                  name : 'nameKR',
                  componentClass: "input",
                  type:"text",
                  bsClass: "form-control",
                  placeholder: "",
                  defaultValue: item.nameKR,
                  description: '토큰명 (한글)',
                  required : true,
                },
              ]}
            />
            <Col md={1}>
            <ControlLabel>&nbsp;</ControlLabel>
              <div>
                <Button  bsStyle="danger" fill type="button" filedName = 'coinList' removeAction={removeField} cntNum={num}  fill type="button" >
                  delete
                </Button>
              </div>
            </Col>

          </Row>
      )
      num++;
    }

    for( var item of Object.keys(defaultRewordArr)){		// 참여보상 input 배열 만들기
      makeRewordField(String(item));
    }
    for( var item of Object.keys(defaultRewordArrNont)){		// 논타겟 참여보상 input 배열 만들기
      makeRewordFieldNont(String(item));
    }



    const doSumbit = (e) =>{
      e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다
      console.log(this.state);

      axios.post(cp.server_ip+'/api/config', {
          userId: window.localStorage['nu_id'],
          userToken: window.localStorage['nu_token'],
          data : this.state,
          proc: 'configUpdate'
      }).then(res => {
          alert('저장 완료');
         window.location.href="/#basic";
      }).catch(err => { console.log(err); });

      return false;
    }


    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Basic Setting"
                content={
                  <form method='post' onSubmit={(e ) => {doSumbit(e)}}>

                    <Row>
                      <Col md={12}>
                        <h4>취급코인 리스트 &nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addCoinList(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    {coinList}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>일간 참가자 추첨 &nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRandomVoteRewordD(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['randomVoteRewordD']}
                            value={rewordCoinValue['randomVoteRewordD']}
                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['randomVoteRewordD']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>일간 정답자 추첨 &nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRandomWinRewordD(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['randomWinRewordD']}
                            value={rewordCoinValue['randomWinRewordD']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['randomWinRewordD']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>일간 랭킹 보상[ 카운트 양식 단일대상 ex) 1  , 복수대상 ex) 1~3 ]&nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRankRewordD(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['rankRewordD']}
                            value={rewordCoinValue['rankRewordD']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['rankRewordD']}
                    <br /><br /><br />




                    <Row>
                      <Col md={12}>
                        <h4>주간 참가자 추첨 &nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRandomVoteRewordW(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['randomVoteRewordW']}
                            value={rewordCoinValue['randomVoteRewordW']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['randomVoteRewordW']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>주간 정답자 추첨 &nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRandomWinRewordW(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['randomWinRewordW']}
                            value={rewordCoinValue['randomWinRewordW']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['randomWinRewordW']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>주간 랭킹 보상[ 카운트 양식 단일대상 ex) 1  , 복수대상 ex) 1~3 ]&nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRankRewordW(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['rankRewordW']}
                            value={rewordCoinValue['rankRewordW']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['rankRewordW']}
                    <br /><br /><br />




                    <Row>
                      <Col md={12}>
                        <h4>월간 참가자 추첨 &nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRandomVoteRewordM(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['randomVoteRewordM']}
                            value={rewordCoinValue['randomVoteRewordM']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['randomVoteRewordM']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>월간 정답자 추첨 &nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRandomWinRewordM(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['randomWinRewordM']}
                            value={rewordCoinValue['randomWinRewordM']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['randomWinRewordM']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>월간 랭킹 보상[ 카운트 양식 단일대상 ex) 1  , 복수대상 ex) 1~3 ]&nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRankRewordM(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                   <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['rankRewordM']}
                            value={rewordCoinValue['rankRewordM']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['rankRewordM']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>월간 최다 투표자 보상[ 카운트 양식 단일대상 ex) 1  , 복수대상 ex) 1~3 ]&nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRankRewordM(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                   <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['rankVoteRewordM']}
                            value={rewordCoinValue['rankVoteRewordM']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['rankVoteRewordM']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>월간 최다 정답자 보상[ 카운트 양식 단일대상 ex) 1  , 복수대상 ex) 1~3 ]&nbsp;&nbsp;&nbsp;<Button  onClick={(e ) => {this.addRankRewordM(e)}}  fill type="button">추가</Button></h4>
                      </Col>
                    </Row>
                   <Row>
                      <Col md={2}>
                      <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['rankWinRewordM']}
                            value={rewordCoinValue['rankWinRewordM']}

                          />
                        </div>
                      </Col>
                    </Row>
                    {defaultRewordArr['rankWinRewordM']}
                    <br /><br /><br />

                    <Row>
                      <Col md={12}>
                        <h4>회원가입 보상</h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                        <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['signReword']}
                            value={rewordCoinValue['signReword']}

                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        {defaultRewordArrNont['signReword']}
                      </Col>
                    </Row>


                    <Row>
                      <Col md={12}>
                        <h4>일간 첫투표 보상</h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                        <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['contRewordD']}
                            value={rewordCoinValue['contRewordD']}

                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        {defaultRewordArrNont['contRewordD']}
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <h4>주간 연속투표 보상</h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                        <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['contRewordW']}
                            value={rewordCoinValue['contRewordW']}

                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        {defaultRewordArrNont['contRewordW']}
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <h4>월간 연속투표 보상</h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                        <ControlLabel>해당 항목 보상코인 선택</ControlLabel>
                        <div>
                          <Select
                            className={num}
                            onChange={changed}
                            options={rewordCoinObject['contRewordM']}
                            value={rewordCoinValue['contRewordM']}

                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        {defaultRewordArrNont['contRewordM']}
                      </Col>
                    </Row>

                    <Button bsStyle="info" pullRight fill type="submit">
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

export default Basic;
