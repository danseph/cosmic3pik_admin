import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    Table,
    FormControl,
    InputGroup,
  } from "react-bootstrap";
import CustomDatePicker from "components/CustomDatepicker/CustomDatepicker.jsx";
import Select from 'react-select';
  import Button from "components/CustomButton/CustomButton.jsx";
import Pagination from 'react-js-pagination';
import Card from "components/Card/Card.jsx";
import { style } from "variables/Variables.jsx";
import axios from 'axios';
import cp from '../../cp';
import moment from 'moment';

class Member extends Component {
    
    constructor(props) {
        super(props);

        // config state
        this.state = {
            isLoad: false,
            data: [],
            activePage: 1,
            totalCount: 0,
            search: '',
            listCount: [
                            { value: '10', label: '10' },
                            { value: '50', label: '50' },
                            { value: '100', label: '100' }
                        ],
            selectedListCount: { value: '10', label: '10' },
            sort: [
                        { value: 'time', label: '날짜순' },
                        { value: 'coins', label: '코인순' },
                    ],
            selectedSort: { value: 'time', label: '날짜순' },
            searchKind: [
                        { value: 'nick', label: '닉네임' },
                        { value: 'email', label: '이메일' },
                    ],
            selectedSearchKind: { value: 'nick', label: '닉네임' },
        };

        // fetch the list when this page is loaded
        if (!this.state.isLoad) {
            this.fetch();
        }
    }

    /**
     * fetch list
     */
    fetch = (pageNumber, search) => {
        const queryString = require('query-string');
        
        axios.post(`${cp.server_ip}/api/member/member_list`,
            {
                data: {
                    token: window.localStorage['nu_token'],
                    startIndex: (!pageNumber)? 0 : (pageNumber -1) * this.state.selectedListCount.value,
                    search :search,
                    searchKind : this.state.selectedSearchKind.value,
                    sort : this.state.selectedSort.value,
                    limit : this.state.selectedListCount,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                }
            }
        ).then(res => {
            const { data } = res;

            if (data.err || !data) { 
                window.location.href = '/'; 
            } else { 
                this.setState(
                    {
                        data: data.data, 
                        totalCount: data.totalCount, 
                        isLoad: true 
                    }
                ) 
            }
        }).catch(err => { 
            console.error(err); 
        });
    };

    /** 
     * paging
     */
    pageChange = pageNumber => {
        this.setState({activePage: pageNumber});
        this.fetch(pageNumber, this.search.value);
    };

    /**
     * search
     */
    onSearch = () => {
        this.setState({activePage: 1});
        this.fetch(0, this.search.value);
    };

    /**
     * detect enter keypress
     */
    onKeyDown = e => {
        if(e.keyCode === 13){
            this.onSearch();
        }
    };

    /**
     * datepicker change
     */
    changedValue = (name, data) => { 
        this.setState({ [name]: data === 'Invalid date'? '' :
                        (name === 'startDate') ? moment(data).format("YYYY-MM-DD 00:00") : moment(data).format("YYYY-MM-DD 24:00")}) 
    };

    /**
     * list count per a page
     */
    listCountChange = selectedListCount => {
        this.setState({ selectedListCount },() => this.onSearch())
    };
      
    /**
     * sort desc
     */
    sortChange = selectedSort => {
        this.setState({ selectedSort },() => this.onSearch())
    };

    /**
     * searchKind
     */
    searchKindChange = selectedSearchKind => {
        this.setState({ selectedSearchKind })
    };


    render() {
		let tableTh = [];
        let tableTd = [];

        /** common style */
        const defaultStyle = Object.assign({}, style.Config.w10, style.Config.wordCenter);

		tableTh.push(
			<tr key="1">
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>USER ID</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>닉네임</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>가입일</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>가입경로</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>이메일</th>
				<th style={Object.assign({}, defaultStyle, style.Config.wordBlod)}>coins</th>
			</tr>
        );
        
        for (let item of this.state.data) {
			tableTd.push(
				<tr key={item._id} >
					<td style={defaultStyle}>{item._id}</td>
                    <td style={defaultStyle}>{item.nick}</td>
                    <td style={defaultStyle}>{moment(item.time, "x").format("YYYY-MM-DD HH:mm")}</td>
                    <td style={defaultStyle}>{item.where}</td>
                    <td style={defaultStyle}>{item.email}</td>
                    <td style={defaultStyle}>{item.coins.length > 0? item.coins.find(foo => foo.name === '3').value : '0'}</td>
				</tr>);
        }
        
		return (
			<div className="content">
				<Grid fluid>
					<Row>
						<Col md={12}>
							<Card
								title={`Member Info List (총 ${this.state.totalCount}명)`}
								ctTableFullWidth
								ctTableResponsive
								content={
                                    <div>
                                        <Row style={style.Config.p15}>
                                            <Col md={2}>
                                                <CustomDatePicker
                                                    name = 'startDate'
                                                    changeAction = {this.changedValue}
                                                    description='시작일'
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <CustomDatePicker                        
                                                        name = 'endDate'
                                                        changeAction = {this.changedValue}
                                                        description='종료일'
                                                />
                                            </Col>
                                            <Col md={1}>
                                                    <Select
                                                        onChange={this.searchKindChange}
                                                        options={this.state.searchKind}
                                                        value={this.state.selectedSearchKind}
                                                    />
                                                    검색구분
                                            </Col>
                                            <Col md={2}>
                                            <InputGroup>
                                                <FormControl
                                                    inputRef={input => { this.search = input; }}
                                                    placeholder={`${this.state.selectedSearchKind.label} 검색`}
                                                    onKeyDown={(e) => this.onKeyDown(e)}
                                                />
                                                <InputGroup.Addon ></InputGroup.Addon>
                                            </InputGroup>
                                            </Col>
                                            <Col md={1}>
                                                <Select
                                                    onChange={this.sortChange}
                                                    options={this.state.sort}
                                                    value={this.state.selectedSort}
                                                />
                                                정렬
                                            </Col>
                                            <Col md={1}>
                                                <Select
                                                    onChange={this.listCountChange}
                                                    options={this.state.listCount}
                                                    value={this.state.selectedListCount}
                                                />
                                                글갯수
                                            </Col>
                                            <Col md={1} >
                                                <Button bsStyle="info" fill onClick={(e) => this.onSearch(e)} >
                                                    검색
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Table striped hover>
                                            <thead content={tableTh} />
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
                        itemsCountPerPage={this.state.selectedListCount.value}
                        totalItemsCount={this.state.totalCount}
                        pageRangeDisplayed={10}
                        onChange={this.pageChange}
                    />
                </div>
			</div>
		);
	}
}

export default Member;
