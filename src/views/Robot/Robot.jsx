import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
	FormControl,
	HelpBlock,
} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { style } from "variables/Variables.jsx";
import ErrAction from '../../ErrAction' ;
import cp from '../../cp';
import queryString from 'query-string';

class Language extends Component {

  constructor(props) {
    super(props);
		this.state = {
				isLoad : false,
				data: [],
				name: '' ,
				uid: '' ,
				file: '' ,
				fileThumb: '' ,
				fileIcon: '' ,
				fileViceo :'' ,
				infoKr: '' ,
				infoEn: '' ,
				infoChn : '',
				infoJa: '',
				tagKr : '',
				tagEn : '',
				tagChn : '',
				tagJa: '',
				videoLink : '' ,
				fileData :  new FormData()
		};
	}
	
	resetData = (data) => {
		this.setState({
			data: data,
			name: '' ,
			uid: '' ,
			file: '' ,
			fileThumb: '' ,
			fileIcon : '' ,
			fileVideo : '' ,
			infoKr: '' ,
			infoEn: '' ,
			infoChn: '',
			infoJa: '',
			tagKr: '',
			tagEn: '',
			tagChn: '',
			tagJa: '',
			videoLink: '',
			fileData: new FormData(),
			isLoad: true,
		});
	}

	loadRobot(parsed) {
		axios.post(cp.server_ip+'/api/robot', {
				proc: 'roadList',
				userId: window.localStorage['nu_id'],
				userToken: window.localStorage['nu_token'],
		}).then(res => {
				if(res.data.err){window.location.href='/';}
				else{
					var curData ;
					for(var item of res.data){
						if(item._id === parsed.uid){
							curData = item;
						}
					}
					this.resetData(res.data);
					if (!curData) return;
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
						infoJa: curData.infoJa,
						tagKr : curData.tagKr,
						tagEn : curData.tagEn,
						tagChn : curData.tagChn,
						tagJa: curData.tagJa,
						videoLink : curData.videoLink,
						fileData :  new FormData(),
						isLoad : true,
					});
				}
		}).catch(err => { console.log(err); });
	}

  render() {
		const parsed = queryString.parse(this.props.location.search);
		if (!this.state.isLoad || (!parsed.uid && this.state.uid !== '') ){
			this.loadRobot(parsed);
		}

		var dataArr = [];
		var filePath = '';
		var fileThumbPath = '';
		var fileIconPath = '';
		var fileVideoPath = '';

		for(var item of this.state.data){
			var style2= { }
			if(parsed.uid === item._id){
				style2= {background:'#da4d55'}
				filePath = <a target='_blank' rel='noopener noreferrer' href={cp.server_ip+'/uploads/'+item.file}><img alt='' style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.file} /></a>;
				fileThumbPath = <a target='_blank' rel='noopener noreferrer' href={cp.server_ip+'/uploads/'+item.fileThumb}><img alt='' style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.fileThumb} /></a>;
				fileIconPath = <a target='_blank' rel='noopener noreferrer' href={cp.server_ip+'/uploads/'+item.fileIcon}><img alt='' style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.fileIcon} /></a>;
				fileVideoPath = <a target='_blank' rel='noopener noreferrer' href={cp.server_ip+'/uploads/'+item.fileVideo}><img alt='' style={{width:'50px'}} src ={cp.server_ip+'/uploads/'+item.fileVideo} /></a>;
			}
			dataArr.push(
				<Col key={item._id} md={1}>
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
			e.preventDefault();
			if(this.state.name === ''){
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
			newFormObj.set('infoJa', this.state.infoJa);
			newFormObj.set('tagKr', this.state.tagKr);
			newFormObj.set('tagEn', this.state.tagEn);
			newFormObj.set('tagChn', this.state.tagChn);
			newFormObj.set('tagJa', this.state.tagJa);
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
						return;
					}
					alert('Success!');
					this.setState({ isLoad:false });
			}).catch(err => { console.log(err); });
			return false;
		}

		const prepareLanguages = () => {
			const languageList = [
				{
					language: 'Ko',
					infoLable: 'Infomation Korean',
					infoName: 'infoKr',
					infoRows: 5,
					infoComponentClass: 'textarea',
					infoValue: this.state.infoKr,
					tagLable: 'Tag for Korean',
					tagName: 'tagKr',
					tagRows: 2,
					tagComponentClass: 'textarea',
					tagValue: this.state.tagKr,
					viewBox: true,
				},
				{
					language: 'En',
					infoLable: 'Infomation English',
					infoName: 'infoEn',
					infoRows: 5,
					infoComponentClass: 'textarea',
					infoValue: this.state.infoEn,
					tagLable: 'Tag for English',
					tagName: 'tagEn',
					tagRows: 2,
					tagComponentClass: 'textarea',
					tagValue: this.state.tagEn,
					viewBox: true,
				},
				{
					language: 'Cn',
					infoLable: 'Infomation Chinese',
					infoName: 'infoChn',
					infoRows: 5,
					infoComponentClass: 'textarea',
					infoValue: this.state.infoChn,
					tagLable: 'Tag for Chinese',
					tagName: 'tagChn',
					tagRows: 2,
					tagComponentClass: 'textarea',
					tagValue: this.state.tagChn,
					viewBox: true,
				},
				{
					language: 'Ja',
					infoLable: 'Infomation Japanese',
					infoName: 'infoJa',
					infoRows: 5,
					infoComponentClass: 'textarea',
					infoValue: this.state.infoJa,
					tagLable: 'Tag for Japanese',
					tagName: 'tagJa',
					tagRows: 2,
					tagComponentClass: 'textarea',
					tagValue: this.state.tagJa,
					viewBox: true,
				}
			];
			
			return languageList.map((item) => {
				return item.viewBox ? (<div key={item.language}>
					<Row>
						<Col md={4}>
							<FormGroup controlId="formControlsTextarea">
								<ControlLabel>{item.tagLable}</ControlLabel>
								<FormControl
									name={item.tagName}
									rows={item.tagRows}
									componentClass={item.tagComponentClass}
									value={item.tagValue}
									onChange={(e) => {changed(e)}}
								/>
							</FormGroup>
						</Col>
						<Col md={8}>
							<FormGroup controlId="formControlsTextarea">
								<ControlLabel>{item.infoLable}</ControlLabel>
								<FormControl
									name={item.infoName}
									rows={item.infoRows}
									componentClass={item.infoComponentClass}
									value={item.infoValue}
									onChange={(e) => {changed(e)}}
								/>
							</FormGroup>
						</Col>
					</Row>
				</div>
				): false}
			);
		};

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
														value={this.state.videoLink}
														onChange={(e ) => {changed(e)}}
													>
													</FormControl>

													<FormControl.Feedback />
													<HelpBlock>동영상 유튜브 링크를 등록해 주세요</HelpBlock>
												</FormGroup>
											</Col>
										</Row>
										{prepareLanguages()}
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
