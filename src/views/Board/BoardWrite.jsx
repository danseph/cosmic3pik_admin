import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  ControlLabel,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import cp from '../../cp';
import Checkbox from 'components/CustomCheckbox/CustomCheckbox';
import { ContentState,  EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import queryString from 'query-string';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class BoardWrite extends Component {
	constructor(props, context) {
			super(props, context);

			this.state = {
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
					titleJa : '' ,
					titleSubJa : '' ,
					editorJa :  EditorState.createEmpty() ,
					contentsJa :  '' ,
					viewJa: false ,
			};
			this.getLanguage();

			this.toolbar = {
				inline: { inDropdown: false },
				list: { inDropdown: true },
				textAlign: { inDropdown: true },
				link: { inDropdown: true },
				history: { inDropdown: true },
				emoji:  { inDropdown: false},
				image: {
					uploadCallback: this.uploadImageCallBack.bind(this),
					previewImage: true
				},
			};
	}

	getLanguage() {
		const parsed = queryString.parse(this.props.location.search);
		if (!parsed.uid) return;
		axios.post(cp.server_ip+'/api/board', {
				proc: 'boardDetail',
				userId: window.localStorage['nu_id'],
				userToken: window.localStorage['nu_token'],
				uid : parsed.uid
		}).then(res => {
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

				const contentBlock_Ja = htmlToDraft(item.contentsJa || '<p></p>');
				const contentState_Ja = ContentState.createFromBlockArray(contentBlock_Ja.contentBlocks);
				const outputEditorState_Ja = EditorState.createWithContent(contentState_Ja);

				this.setState({
					boardId : item._id,
					boardCate: item.boardCate,
					subCate: item.subCate,
					topView: item.topView || false,
					titleKr : item.titleKr || '',
					titleSubKr : item.titleSubKr || '',
					editorKr : outputEditorState_Kr || EditorState.createEmpty(),
					contentsKr :item.contentsKr || '<p></p>',
					viewKr: item.viewKr || false,
					titleEn : item.titleEn || '',
					titleSubEn : item.titleSubEn || '',
					editorEn : outputEditorState_En || EditorState.createEmpty(),
					contentsEn :item.contentsEn || '<p></p>',
					viewEn :item.viewEn || false,
					titleChn : item.titleChn || '',
					titleSubChn : item.titleSubChn || '',
					editorChn : outputEditorState_Chn || EditorState.createEmpty(),
					contentsChn :  item.contentsChn || '<p></p>',
					viewChn: item.viewChn || false,
					titleJa : item.titleJa || '',
					titleSubJa : item.titleSubJa || '',
					editorJa : outputEditorState_Ja || EditorState.createEmpty(),
					contentsJa :  item.contentsJa || '<p></p>',
					viewJa: item.viewJa || false,
				})
			}
		}).catch(err => { console.log(err); });
	}

	makeHTML = (editorState, language) => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    const contentBlock = htmlToDraft(html);
		if (contentBlock) {
			const stateData = {};
			stateData[`editor${language}`] = editorState;
			stateData[`contents${language}`] = html;
			this.setState(stateData);
		}
	}

	uploadImageCallBack = (file) => {
		return new Promise(
			(resolve, reject) => {
				const config = { headers: {'accept': 'application/json','Content-Type': 'multipart/form-data' } };
				var newFormObj  = new FormData();
				newFormObj.append('listingImage', file , 'imageFIle' );

				axios.post(`${cp.server_ip}/api/upload`, newFormObj ,config)
				.then(function (response) {
						resolve({data: {link: `${cp.server_ip}/${response.data.path}`}})
				})
				.then(societe => {
						reject(societe);
				})
			}
		);
	}

	inputChange = (e , type , value , filedName) => {
		if(type === 'checkbox'){
			this.setState({ [filedName]:value });
			return false;
		}
		this.setState({ [e.target.name]: e.target.value })
	};

	/**
	 * prepare sub category
	 */
	prepareSubCategory = () => {
		if (this.state.boardCate !== 'faq') return;
		return (
				<FormInputs
					key="boardCateFAQ"
					changeAction = {this.inputChange}
					ncols={["col-md-3"]}
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

	doSumbit = (e) => {
		e.preventDefault(); // 기본적인 서브밋 행동을 취소합니다
		axios.post(`${cp.server_ip}/api/board`, {
				userId: window.localStorage['nu_id'],
				userToken: window.localStorage['nu_token'],
				data : this.state,
				proc: 'boardWrite'
		}).then(res => {
			if (res.data.err) {
				alert('Fail update');
				return;
			}
			alert('success!');
		}).catch(err => { console.log(err); });
		return false;
	}

	prepareEditor = () => {
		const languageList = [
			{
				EditorTitle: 'Korean',
				defaultValue: this.state.titleKr,
				checkboxNumber: '2',
				isChecked: Boolean(this.state.viewKr),
				subDefaultValue: this.state.titleSubKr,
				editorState: this.state.editorKr,
				editorChange: 'Kr',
				viewBox: true,
			}, {
				EditorTitle: 'English',
				defaultValue: this.state.titleEn,
				checkboxNumber: '3',
				isChecked: Boolean(this.state.viewEn),
				subDefaultValue: this.state.titleSubEn,
				editorState: this.state.editorEn,
				editorChange: 'En',
				viewBox: true,
			}, {
				EditorTitle: 'Chinese',
				defaultValue: this.state.titleChn,
				checkboxNumber: '4',
				isChecked: Boolean(this.state.viewChn),
				subDefaultValue: this.state.titleSubChn,
				editorState: this.state.editorChn,
				editorChange: 'Chn',
				viewBox: true,
			}, {
				EditorTitle: 'Japanese',
				defaultValue: this.state.titleJa,
				checkboxNumber: '5',
				isChecked: Boolean(this.state.viewJa),
				subDefaultValue: this.state.titleSubJa,
				editorState: this.state.editorJa,
				editorChange: 'Ja',
				viewBox: true,
			}
		];

		return (
			languageList.map((item) => {
			return item.viewBox ? (<div key={item.editorChange}>
				<Row>
					<Col md={12}>
						<h4>{item.EditorTitle}</h4>
					</Col>
				</Row>
				<Row>
					<FormInputs
						changeAction = {this.inputChange}
						ncols={["col-md-8" ]}
						proprieties={[
							{
								label: 'TITLE',
								name : `title${item.editorChange}`,
								componentClass: "input",
								type:"text",
								bsClass: "form-control",
								defaultValue: item.defaultValue,
							}
						]}
					/>
					<Col md={2}>
						<Checkbox
							changeAction={this.inputChange}
							number={item.checkboxNumber}
							name={`view${item.editorChange}`}
							isChecked={item.isChecked}
							label="노출 ( with view )"
						/>
					</Col>
				</Row>
				<Row>
					<FormInputs
						changeAction = {this.inputChange}
						ncols={["col-md-8" ]}
						proprieties={[
							{
								label: 'SUB TITLE',
								name : `titleSub${item.editorChange}`,
								componentClass: "input",
								type:"text",
								bsClass: "form-control",
								defaultValue: item.subDefaultValue,
							}
						]}
					/>
				</Row>
				<Row>
					<Col md={10}>
						<ControlLabel>CONTENTS</ControlLabel>
						<Editor
							editorState={item.editorState}
							editorClassName="demo-editor"
							toolbarClassName="toolbar-class"
							wrapperStyle={{border: '1px solid #eee', padding: '1em'}}
							stripPastedStyles={true}
							toolbar={this.toolbar}
							onEditorStateChange={editorState => this.makeHTML(editorState, item.editorChange)}
						/>
					</Col>
				</Row>
			</div>
			): false})
		);
	}

  render() {

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Board Write"
                content={
                  <form method='post' onSubmit={(e ) => {this.doSumbit(e)}}>
                    <Row>
											<FormInputs
												changeAction = {this.inputChange}
												ncols={["col-md-3"]}
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
															{	value : 'event',view : '이벤트( Event )' },
															{	value : 'faq',view : 'FAQ' },
														]
													}
												]}
											/>
											{this.prepareSubCategory()}
											<Col md={2}>
												<Checkbox
													changeAction = {this.inputChange}
													number="1"
													name = 'topView'
													isChecked= {Boolean(this.state.topView)}
													label = "상단( top view )"
												/>
											</Col>
                    </Row>
										{this.prepareEditor()}
                    <Button bsStyle="info" pullRight fill type="submit" >
                      Update Profile
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>

        </Grid>
	    </div>
    );
  }
}

export default BoardWrite;
