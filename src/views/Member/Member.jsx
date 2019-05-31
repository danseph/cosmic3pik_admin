import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    Table,
    FormGroup,
    FormControl,
    InputGroup,
    Button
  } from "react-bootstrap";
//   import Button from "components/CustomButton/CustomButton.jsx";
import Pagination from 'react-js-pagination';
import Card from "components/Card/Card.jsx";
import { style } from "variables/Variables.jsx";
import axios from 'axios';
import cp from '../../cp';
import moment from 'moment';

class Member extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            data: [],
            activePage: 1,
            totalCount: 0,
            search: '',
        };

        if (!this.state.isLoad) {
            this.fetch();
        }
    }

    /**
     * 리스트 출력
     */
    fetch = (pageNumber, search) => {
        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);

        axios.post(cp.server_ip + '/api/member/member_list',
            {
                data: {
                    token: window.localStorage['nu_token'],
                    startIndex: (!pageNumber)? 0 : (pageNumber -1) * 10,
                    search :search,
                }
            }
        ).then(res => {
            const { data } = res;
            if (data.err) { window.location.href = '/'; }
            else { this.setState({
                    data: data.data, 
                    totalCount: data.totalCount, 
                    isLoad: true 
                    }) 
                }

        }).catch(err => { 
            console.log(err); 
        });
    };

    /** 
     * 페이징 처리
     */
    pageClick = pageNumber => {
        this.setState({activePage: pageNumber});
        this.fetch(pageNumber);
    };

    onSearchClick = e => {
        console.log('e',e);
        // this.setState({search: this.state.search});
        this.fetch(0,this.search.value);
    };

    render() {
		let tableTh = [];
        let tableTd = [];

        const defaultStyle = Object.assign({}, style.Config.w10, style.Config.wordCenter);

		tableTh.push(
			<tr key="1">
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>USER ID</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>닉네임</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>가입일</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>가입경로</th>
			</tr>
        );
        
        for (let item of this.state.data) {
			tableTd.push(
				<tr key={item._id} >
					<td style={defaultStyle}>{item._id}</td>
                    <td style={defaultStyle}>{item.nick}</td>
                    <td style={defaultStyle}>{moment(item.time, "x").format("YYYY-MM-DD HH:mm")}</td>
                    <td style={defaultStyle}>{item.where}</td>
				</tr>);
        }
        
		return (
			<div className="content">
				<Grid fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Member Info List"
								category=""
								ctTableFullWidth
								ctTableResponsive
								content={
                                    <div>
                                    <Row style={style.Config.p15}>
                                        <Col md={3}>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                            inputRef={input => { this.search = input; }}
                                            placeholder="검색어 입력"
                                            // aria-label="Recipient's username"
                                            // aria-describedby="basic-addon2"
                                            />
                                           <InputGroup.Addon onClick={(e) => this.onSearchClick(e)}><i className="pe-7s-search"></i></InputGroup.Addon>
                                        </InputGroup>
                                        </Col>
                                    </Row>
									<Table striped hover>
										<thead>
											{tableTh}
										</thead>
										<tbody>
										    {tableTd}
										</tbody>
									</Table>
                                    </div>
								}
							/>
						</Col>
					</Row>
				</Grid>
                <div style={{textAlign:"center"}}> 
                <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.totalCount}
                    pageRangeDisplayed={10}
                    onChange={this.pageClick}
                    />
                </div>
			</div>
		);
	}
}

export default Member;
