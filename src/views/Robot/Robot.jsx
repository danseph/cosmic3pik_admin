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
import ErrAction from '../../ErrAction' ;


class Language extends Component {

  constructor(props) {
    super(props);
		this.state = {
				// or Date or Moment.js
				isLoad : false,
				data: new Array(),
				name: '' ,
				uid: '' ,
				file: '' ,
				fileThumb: '' ,
				fileIcon: '' ,
				fileViceo :'' ,
				infoKr: '' ,
				infoEn: '' ,
				infoChn : '' ,
				tagKr : '',
				tagEn : '',
				tagChn : '',
				videoLink : '' ,
				fileData :  new FormData()

		};



  }

	loadRobot(parsed) {
		axios.post(cp.server_ip+'/api/robot', {
				proc: 'roadList',
				userId: window.localStorage['nu_id'],
				userToken: window.localStorage['nu_token'],
		}).then(res => {
				if(res.data.err){window.location.href='/';}
				else{
					//console.log(res)
					var curData ;
					for(var item of res.data){
						if(item._id == parsed.uid){
							curData = item;
						}
					}
					if(curData){
						this.setState({
							data: res.data,
							uid: curData._id,
							name: curData.name,
							file: curData.file,
							fileThumb: curData.fileThumb,
							fileIcon: curData.fileIcon,
							fileVideo: curData.fileVideo,
							infoKr: curData.infoKr,
							infoEn: curData.infoEn,
							infoChn : curData.infoChn,
							tagKr : curData.tagKr,
							tagEn : curData.tagEn,
							tagChn : curData.tagChn  ,
							videoLink : curData.videoLink,
							fileData :  new FormData(),
							isLoad : true,

						});

					}else{
						this.setState({
							data: res.data,
							name: '' ,
							uid: '' ,
							file: '' ,
							fileThumb: '' ,
							fileIcon : '' ,
							fileVideo : '' ,
							infoKr: '' ,
							infoEn: '' ,
							infoChn : '' ,
							tagKr : '',
							tagEn : '',
							tagChn : '',
							videoLink : '' ,
							fileData :  new FormData(),
							isLoad : true,

						});

					}


				}

		}).catch(err => { console.log(err); });
	}



  render() {
		const queryString = require('query-string');
		const parsed = queryString.parse(this.props.location.search);

		if(!this.state.isLoad || (!parsed.uid && this.state.uid != '') ){
			this.loadRobot(parsed);
		}

		var dataArr = [];
		var filePath = '';
		var fileThumbPath = '';
		var fileIconPath = '';
		var fileVideoPath = '';

		for(var item of this.state.data){
			if(parsed.uid == item._id){
				var style2= {background:'#da4d55'}
				filePath = <a target='_blank' href={cp.server_ip+'/uploads/'+item.file}><img style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.file} /></a>;
				fileThumbPath = <a target='_blank' href={cp.server_ip+'/uploads/'+item.fileThumb}><img style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.fileThumb} /></a>;
				fileIconPath = <a target='_blank' href={cp.server_ip+'/uploads/'+item.fileIcon}><img style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.fileIcon} /></a>;
				fileVideoPath = <a target='_blank' href={cp.server_ip+'/uploads/'+item.fileVideo}><img style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.fileVideo} /></a>;
			}else{
				var style2= { }

			}
			dataArr.push(
				<Col md={1}>
					<NavLink onClick={(e ) => {this.setState({isLoad : false});}} to={'/robot?uid='+item._id} className="nav-link" activeClassName="active" style={{color:'#fff' }}><Button key={item._id} bsStyle="info" pullLeft fill type="button"  style={style2} >{item.name}</Button></NavLink>
				</Col>
			);
		}

		const changed = (e) => {
				if(e.target.files){
					var newFormObj  = this.state.fileData;
					newFormObj.set(e.target.name, e.target.files[0] , e.target.name);
					this.setState({ [e.target.name]: e.target.value , fileData : newFormObj , searchAc: false})
				}else{
					this.setState({ [e.target.name]: e.target.value , searchAc: false})
				}

		};


		const doSumbit = (e) =>{
			e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다
		//console.log(this.state.fileData);
			if(this.state.name == ''){
				alert('이름을 입력해 주세요');
				return false;
			}
			var newFormObj  = this.state.fileData;
			newFormObj.set('proc', 'robotWrite');
			newFormObj.set('name', this.state.name);
			newFormObj.set('uid', this.state.uid);
			newFormObj.set('infoKr', this.state.infoKr);
			newFormObj.set('infoEn', this.state.infoEn);
			newFormObj.set('infoChn', this.state.infoChn);
			newFormObj.set('tagKr', this.state.tagKr);
			newFormObj.set('tagEn', this.state.tagEn);
			newFormObj.set('tagChn', this.state.tagChn);
			newFormObj.set('videoLink', this.state.videoLink);
			newFormObj.set('fileTemp', this.state.file);
			newFormObj.set('fileThumbTemp', this.state.fileThumb);
			newFormObj.set('fileIconTemp', this.state.fileIcon);
			newFormObj.set('fileVideoTemp', this.state.fileVideo);
			newFormObj.set('userId', window.localStorage['nu_id']);
			newFormObj.set('userToken', window.localStorage['nu_token']);


			axios.post(cp.server_ip+'/api/robot', newFormObj).then(res => {
					if(res.data.err){
						ErrAction(res.data.err);
						return
					}else{
						if(!res.data.err){ this.setState({  isLoad:false}) ;/*console.log(res) ;*/}
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
                title="Robot Set"
                content={
                  <form method='post' onSubmit={(e ) => {doSumbit(e)}}>
										<Row>
											<Col md={2}>
												<FormGroup	controlId="form-control">
													<ControlLabel>name</ControlLabel>
													<FormControl
														componentClass="input"
														type="text"
														name = "name"
														defaultValue={this.state.name}
														value={this.state.name}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>

													<FormControl.Feedback />
													<HelpBlock>로봇의 이름을 입력해 주세요</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={2}>
												<FormGroup	controlId="form-control">
													<ControlLabel>image</ControlLabel>
													<FormControl
														componentClass="input"
														type="file"
														name = "file"
														defaultValue={this.state.file}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>

													<FormControl.Feedback />
													<HelpBlock>이미지를 등록해 주세요</HelpBlock>
												</FormGroup>
												{filePath}
											</Col>
											<Col md={2}>
												<FormGroup	controlId="form-control">
													<ControlLabel>thumb image</ControlLabel>
													<FormControl
														componentClass="input"
														type="file"
														name = "fileThumb"
														defaultValue={this.state.fileThumb}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>

													<FormControl.Feedback />
													<HelpBlock>썸네일 이미지를 등록해 주세요</HelpBlock>
												</FormGroup>
												{fileThumbPath}
											</Col>
											<Col md={2}>
												<FormGroup	controlId="form-control">
													<ControlLabel>icon image</ControlLabel>
													<FormControl
														componentClass="input"
														type="file"
														name = "fileIcon"
														defaultValue={this.state.fileIcon}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>

													<FormControl.Feedback />
													<HelpBlock>아이콘 이미지를 등록해 주세요</HelpBlock>
												</FormGroup>
												{fileIconPath}
											</Col>
											<Col md={2}>
												<FormGroup	controlId="form-control">
													<ControlLabel>video file</ControlLabel>
													<FormControl
														componentClass="input"
														type="file"
														name = "fileVideo"
														defaultValue={this.state.fileVideo}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>

													<FormControl.Feedback />
													<HelpBlock>턴테이블 동영상을 등록해 주세요</HelpBlock>
												</FormGroup>
												{fileVideoPath}
											</Col>
											<Col md={2}>
												<FormGroup	controlId="form-control">
													<ControlLabel>video youtube link</ControlLabel>
													<FormControl
														componentClass="input"
														type="text"
														name = "videoLink"
														defaultValue={this.state.videoLink}
														value={this.state.videoLink}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>

													<FormControl.Feedback />
													<HelpBlock>동영상 유튜브 링크를 등록해 주세요</HelpBlock>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col md={4}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>infomation KR</ControlLabel>
													<FormControl
														name = 'infoKr'
														rows="3"
														componentClass="textarea"
														defaultValue={this.state.infoKr}
														value={this.state.infoKr}
														onChange={(e ) => {changed(e)}}
													/>
													<HelpBlock>설명을 적어주세요 (한국어)</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={4}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>tag KR</ControlLabel>
													<FormControl
														name = 'tagKr'
														rows="3"
														componentClass="input"
														type="text"
														defaultValue={this.state.tagKr}
														value={this.state.tagKr}
														onChange={(e ) => {changed(e)}}

													/>
													<HelpBlock>태그르 적어주세요 (한국어)</HelpBlock>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col md={4}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>infomation En</ControlLabel>
													<FormControl
														name = 'infoEn'
														rows="3"
														componentClass="textarea"
														defaultValue={this.state.infoEn}
														value={this.state.infoEn}
														onChange={(e ) => {changed(e)}}
													/>
													<HelpBlock>설명을 적어주세요 (영어)</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={4}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>tag En</ControlLabel>
													<FormControl
														name = 'tagEn'
														rows="3"
														componentClass="input"
														type="text"
														defaultValue={this.state.tagEn}
														value={this.state.tagEn}
														onChange={(e ) => {changed(e)}}

													/>
													<HelpBlock>태그르 적어주세요 (영어)</HelpBlock>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col md={4}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>infomation Chn</ControlLabel>
													<FormControl
														name = 'infoChn'
														rows="3"
														componentClass="textarea"
														defaultValue={this.state.infoChn}
														value={this.state.infoChn}
														onChange={(e ) => {changed(e)}}
													/>
													<HelpBlock>설명을 적어주세요 (중국어)</HelpBlock>
												</FormGroup>
											</Col>
											<Col md={4}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>tag Chn</ControlLabel>
													<FormControl
														name = 'tagChn'
														rows="3"
														componentClass="input"
														type="text"
														defaultValue={this.state.tagChn}
														value={this.state.tagChn}
														onChange={(e ) => {changed(e)}}

													/>
													<HelpBlock>태그르 적어주세요 (중국어)</HelpBlock>
												</FormGroup>
											</Col>
										</Row>
										<Row>
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
											title="Robot List"
											category=""
											ctTableFullWidth
											ctTableResponsive
											content={
											<div>
												<Row style={style.Config.p15}>
													{dataArr}
												</Row>
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
