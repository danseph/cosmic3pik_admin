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
import { ContentState,  EditorState, RichUtils, convertToRaw , convertFromRaw , convertFromHTML ,decorator } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { thArray, tdArray ,style } from "variables/Variables.jsx";
import htmlToDraft from 'html-to-draftjs';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import draftToHtml from 'draftjs-to-html';
import HTMLtoJSX from 'htmltojsx';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class BoardWrite extends Component {
	constructor(props, context) {
			super(props, context);

			// Initial state with date
			this.state = {
					// or Date or Moment.js
					boardId : '',
					boardCate: '',
					subCate: '',
					topView: false,
					titleKr : '' ,
					titleSubKr : '' ,
					editorKr : EditorState.createEmpty() ,
					contentsKr : '' ,
					viewKr: false ,
					titleEn : '' ,
					titleSubEn : '' ,
					editorEn : EditorState.createEmpty() ,
					contentsEn :'',
					viewEn :false ,
					titleChn : '' ,
					titleSubChn : '' ,
					editorChn :  EditorState.createEmpty() ,
					contentsChn :  '' ,
					viewChn: false ,
					isLoad : false ,

			};


	}

  onContentStateChangeKr : Function = (editorState) => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const outputEditorState = EditorState.createWithContent(contentState);
			this.setState({
				editorKr : editorState,
				contentsKr : html,
			});

    }
  };

  onContentStateChangeEn : Function = (editorState) => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const outputEditorState = EditorState.createWithContent(contentState);
			this.setState({
				editorEn : editorState,
				contentsEn : html,
			});

    }
  };

  onContentStateChangeChn : Function = (editorState) => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const outputEditorState = EditorState.createWithContent(contentState);
			this.setState({
				editorChn : editorState,
				contentsChn : html,
			});

    }

  };



	uploadImageCallBack(file) {
			return new Promise(
					(resolve, reject) => {
						const config = { headers: {'accept': 'application/json','Content-Type': 'multipart/form-data' } };
						var newFormObj  = new FormData();
						newFormObj.append('listingImage', file , 'imageFIle' );

						axios.post(cp.server_ip+'/api/upload', newFormObj ,config)
						.then(function (response) {
								//console.log(cp.server_ip+'/'+response.data.path);
								resolve({data: {link: cp.server_ip+'/'+response.data.path}})
						})
						.then(societe => {
								reject(societe);
						})
					}
			);

	}





  render() {

		console.log(this.state);
    const { editorKr  , editorEn , editorChn} = this.state;
		const queryString = require('query-string');
		const parsed = queryString.parse(this.props.location.search);
		//console.log(parsed);
		if(!this.state.isLoad && parsed.uid){
			axios.post(cp.server_ip+'/api/board', {
					proc: 'boardDetail',
					userId: window.localStorage['nu_id'],
					userToken: window.localStorage['nu_token'],
					uid : parsed.uid
			}).then(res => {
				//console.log(editorStateWithoutUndo );
				if(res.data.err){window.location.href='/';}
				else{

					var item = res.data


			    const contentBlock_kr = htmlToDraft(item.contentsKr);
					const contentState_kr = ContentState.createFromBlockArray(contentBlock_kr.contentBlocks);
					const outputEditorState_Kr = EditorState.createWithContent(contentState_kr);


			    const contentBlock_En = htmlToDraft(item.contentsEn);
					const contentState_En = ContentState.createFromBlockArray(contentBlock_En.contentBlocks);
					const outputEditorState_En = EditorState.createWithContent(contentState_En);

			    const contentBlock_Chn = htmlToDraft(item.contentsChn);
					const contentState_Chn = ContentState.createFromBlockArray(contentBlock_Chn.contentBlocks);
					const outputEditorState_Chn = EditorState.createWithContent(contentState_Chn);




					this.setState({
						boardId : item._id,
						boardCate: item.boardCate,
						subCate:item.subCate,
						topView: item.topView,
						titleKr : item.titleKr,
						titleSubKr : item.titleSubKr,
						editorKr : outputEditorState_Kr,
						contentsKr :item.contentsKr,
						viewKr: item.viewKr,
						titleEn : item.titleEn,
						titleSubEn : item.titleSubEn,
						editorEn : outputEditorState_En,
						contentsEn :item.contentsEn,
						viewEn :item.viewEn,
						titleChn : item.titleChn,
						titleSubChn : item.titleSubChn,
						editorChn : outputEditorState_Chn,
						contentsChn :  item.contentsChn,
						viewChn: item.viewChn,
						isLoad : true ,

					})
				}

			}).catch(err => { /*console.log(err);*/ });
		}

		const changed = (e , type , value , filedName) => {
			if(type == 'checkbox'){
				this.setState({ [filedName]:value });
				return false;
			}
			this.setState({ [e.target.name]: e.target.value })

		};


		var subCate= []
		// FAQ 일시 서브항목 변수
		if(this.state.boardCate == 'faq'){
			subCate.push(
					<FormInputs
						changeAction = {changed}
						ncols={["col-md-2"]}
						proprieties={[
							{
								label: "sub catagory",
								name : 'subCate',
								componentClass: "select",
								type:"select",
								bsClass: "form-control",
								defaultValue: this.state.subCate,
								description: '하위 카테고리를 선택해 주세요',
								required : true,
								option:[
									{	value : '',view : '선택해주세요' },
									{	value : 'joinAndLogin',view : '가입/로그인 관련 ( Join and Login )' },
									{	value : 'using',view : '이용방법 ( Using )' },
									{	value : 'withdraw',view : '출금 관련 ( Withdraw )' },
									{	value : 'etc',view : '기타 ( ETC )' },

								]
							}
						]}
					/>
			);
		}


		const doSumbit = (e) =>{
			e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다
			axios.post(cp.server_ip+'/api/board', {
					userId: window.localStorage['nu_id'],
					userToken: window.localStorage['nu_token'],
					data : this.state,
					proc: 'boardWrite'
			}).then(res => {
				 window.location.href="/#board";
			}).catch(err => { console.log(err); });

			return false;
		}

		const toolbar = {
				inline: {
						inDropdown: false,
				},
				list: { inDropdown: true },
				textAlign: { inDropdown: true },
				link: { inDropdown: true },
				history: { inDropdown: true },
				emoji  :  {inDropdown: false},
				image: { uploadCallback: this.uploadImageCallBack.bind(this),  previewImage: true },
		};

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Board Write"
                content={
                  <form method='post' onSubmit={(e ) => {doSumbit(e)}}>

                    <Row>

											<FormInputs
												changeAction = {changed}
												ncols={["col-md-2"]}
												proprieties={[
													{
														label: "board catagory",
														name : 'boardCate',
														componentClass: "select",
														type:"select",
														bsClass: "form-control",
														defaultValue: this.state.boardCate,
														description: '게시판 종류를 선택해 주세요',
														required : true,
														option:[
															{	value : '',view : '선택해주세요' },
															{	value : 'notice',view : '공지사항( Notice )' },
															{	value : 'event',view : '이벤트 ( Event )' },
															{	value : 'faq',view : 'FAQ' },

														]
													}
												]}
											/>
											{subCate}
											<Col md={2}>
												<br />
												<Checkbox
														changeAction = {changed}
														number="1"
														name = 'topView'
														isChecked= {Boolean(this.state.topView)}
														label = "상단노출( top view )"
												/>

											</Col>

                    </Row>
										<Row>
                      <Col md={12}>
												<h4>한국어 ( Korean )</h4>
                      </Col>

										</Row>
                    <Row>
											<FormInputs
												changeAction = {changed}
												ncols={["col-md-8" ]}
												proprieties={[
													{
														label: "title Korean",
														name : 'titleKr',
														componentClass: "input",
														type:"text",
														bsClass: "form-control",
														defaultValue: this.state.titleKr,
														description: '타이틀 한국어',
													}
												]}
											/>
											<Col md={2}>
												<br />
												<Checkbox
														changeAction = {changed}
														number="2"
														name = 'viewKr'
														isChecked= {Boolean(this.state.viewKr)}
														label = "노출여부 ( with view )"
												/>

											</Col>
										</Row>

                    <Row>
											<FormInputs
												changeAction = {changed}
												ncols={["col-md-8" ]}
												proprieties={[
													{
														label: "sub title Korean",
														name : 'titleSubKr',
														componentClass: "input",
														type:"text",
														bsClass: "form-control",
														defaultValue: this.state.titleSubKr,
														description: '서브타이틀 타이틀 한국어',
													}
												]}
											/>
										</Row>

                    <Row>
											<Col md={10} style={Object.assign({}, style.Config.hp450)}>
												<ControlLabel>컨탠츠 ( 한국어 )  / contents ( korean )</ControlLabel>
                        <Editor
                            editorState={editorKr}
                            editorClassName="demo-editor"
                            toolbarClassName="toolbar-class"
                           // defaultEditorState={sampleEditorContent}
                            toolbar={toolbar}
                            onEditorStateChange={this.onContentStateChangeKr.bind(this)}
                        />

											</Col>
										</Row>

										<Row>
                      <Col md={12}>
												<h4>영어 ( English )</h4>
                      </Col>

										</Row>
                    <Row>
											<FormInputs
												changeAction = {changed}
												ncols={["col-md-8" ]}
												proprieties={[
													{
														label: "title English",
														name : 'titleEn',
														componentClass: "input",
														type:"text",
														bsClass: "form-control",
														defaultValue: this.state.titleEn,
														description: '타이틀 영어',
													}
												]}
											/>
											<Col md={2}>
												<br />
												<Checkbox
														changeAction = {changed}
														number="3"
														name = 'viewEn'
														isChecked= {Boolean(this.state.viewEn)}
														label = "노출여부 ( with view )"
												/>

											</Col>
										</Row>

                    <Row>
											<FormInputs
												changeAction = {changed}
												ncols={["col-md-8" ]}
												proprieties={[
													{
														label: "sub title English",
														name : 'titleSubEn',
														componentClass: "input",
														type:"text",
														bsClass: "form-control",
														defaultValue: this.state.titleSubEn,
														description: '서브타이틀 타이틀 영어',
													}
												]}
											/>
										</Row>

                    <Row>
											<Col md={10} style={Object.assign({}, style.Config.hp450)}>
												<ControlLabel>컨텐츠 ( 영어 )  / contents ( english )</ControlLabel>
                        <Editor
                            editorState={editorEn}
                            editorClassName="demo-editor"
                            toolbarClassName="toolbar-class"
                           // defaultEditorState={sampleEditorContent}
                            toolbar={toolbar}
                            onEditorStateChange={this.onContentStateChangeEn.bind(this)}
                        />
											</Col>
										</Row>

										<Row>
                      <Col md={12}>
												<h4>중국어 ( Chinese )</h4>
                      </Col>

										</Row>
                    <Row>
											<FormInputs
												changeAction = {changed}
												ncols={["col-md-8" ]}
												proprieties={[
													{
														label: "title Chinese",
														name : 'titleChn',
														componentClass: "input",
														type:"text",
														bsClass: "form-control",
														defaultValue: this.state.titleChn,
														description: '타이틀 중국어',
													}
												]}
											/>
											<Col md={2}>
												<br />
												<Checkbox
														changeAction = {changed}
														number="4"
														name = 'viewChn'
														isChecked= {Boolean(this.state.viewChn)}
														label = "노출여부 ( top view )"
												/>

											</Col>
										</Row>


                    <Row>
											<FormInputs
												changeAction = {changed}
												ncols={["col-md-8" ]}
												proprieties={[
													{
														label: "sub title Chinese",
														name : 'titleSubChn',
														componentClass: "input",
														type:"text",
														bsClass: "form-control",
														defaultValue: this.state.titleSubChn,
														description: '서브타이틀 타이틀 중국어',
													}
												]}
											/>
										</Row>


                    <Row>
											<Col md={10} style={Object.assign({}, style.Config.hp450)}>
												<ControlLabel>컨탠츠 ( 중국어 )  / contents ( chinese )</ControlLabel>
                        <Editor
														wrapperClassName="demo-wrapper"
                            editorState={editorChn}
                            editorClassName="demo-editor"
                            toolbarClassName="toolbar-class"
                           // defaultEditorState={sampleEditorContent}
                            toolbar={toolbar}
                            onEditorStateChange={this.onContentStateChangeChn.bind(this)}
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

export default BoardWrite;

