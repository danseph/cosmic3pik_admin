import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    Table,
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
import ReactHighcharts from 'react-highcharts';
import Highcharts from 'highcharts';


Highcharts.setOptions({
  lang: {
      thousandsSep: ','
  }
});


class Statistics extends Component {
    
    constructor(props) {
        super(props);

        // config state
        this.state = {
            totalDayCount: 0,
            dayAmount:[],
            dayCount:[],
            periodAmount: 0,
            periodCount: 0,
            issueDate:[],
            periodRewordAmount:{},
            periodRewordCount:{},
            isLoad: false,
            activePage: 1,
            listCount: [
                            { value: '10', label: '10' },
                            { value: '30', label: '30' }
                        ],
            selectedListCount: { value: '10', label: '10' },
            sortOption: [
                        { value: -1, label: '내림차순' },
                        { value: 1, label: '오름차순' },
                    ],
            selectedSortOption: { value: 1, label: '오름차순' }
        };

        // fetch the list when this page is loaded
        if (!this.state.isLoad) {
            this.fetch();
        }
    }

    /**
     * fetch list
     */
    fetch = (pageNumber) => {
        const queryString = require('query-string');
        
        axios.post(`${cp.server_ip}/api/stats/stats_list`,
            {
                data: {
                    token: window.localStorage['nu_token'],
                    startIndex: (!pageNumber)? 0 : (pageNumber -1) * this.state.selectedListCount.value,
                    sortOption : this.state.selectedSortOption.value,
                    limit : this.state.selectedListCount,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                }
            }
        ).then(res => {
            const data  = res.data;

            if (data.err || !data) { 
                window.location.href = '/'; 
            } else { 
                this.setState(
                    {
                        periodAmount: data.periodAmount, periodCount: data.periodCount , dayAmount : data.dayAmount, dayCount : data.dayCount, issueDate : data.issueDate, periodRewordAmount : data.periodRewordAmount, periodRewordCount: data.periodRewordCount,
                        totalDayCount: data.totalDayCount, 
                        isLoad: true 
                    },
                    () => this.render()
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
        this.fetch(pageNumber);
    };

    /**
     * search
     */
    onSearch = () => {
        this.setState({activePage: 1});
        this.fetch(0);
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
     * sort option change
     */
    sortOptionChange = selectedSortOption => {
        this.setState({ selectedSortOption },() => this.onSearch())
    };

    getDayCoinAmount(dayAmountArr,issueDateArr,dayCountArr) {
        let data = [];
        let num = 0;
        let no = (this.state.activePage -1) * this.state.selectedListCount.value + 1;
        dayAmountArr.map(item => {
          data.push(
            <tr key={issueDateArr[num]}>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{no++}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{issueDateArr[num]}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{this.AddComma(dayAmountArr[num].labTotal)} <br />  ({dayCountArr[num].labTotalCount})</td>           
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userPik) ? this.AddComma(dayAmountArr[num].userPik) : '-'} <br /> {(dayAmountArr[num].userPik) ? '(' + (dayCountArr[num].userPik) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].voteLucky) ? this.AddComma(dayAmountArr[num].voteLucky) : '-'} <br /> {(dayAmountArr[num].voteLucky) ? '(' + (dayCountArr[num].voteLucky) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userWinRandom) ? this.AddComma(dayAmountArr[num].userWinRandom) : '-'} <br /> {(dayAmountArr[num].userWinRandom) ? '(' + (dayCountArr[num].userWinRandom) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayWinRandom) ? this.AddComma(dayAmountArr[num].dayWinRandom) : '-'} <br /> {(dayAmountArr[num].dayWinRandom) ? '(' + (dayCountArr[num].dayWinRandom) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayVoteRandom) ? this.AddComma(dayAmountArr[num].dayVoteRandom) : '-'} <br /> {(dayAmountArr[num].dayVoteRandom) ? '(' + (dayCountArr[num].dayVoteRandom) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekWinRandom) ? this.AddComma(dayAmountArr[num].weekWinRandom) : '-'} <br /> {(dayAmountArr[num].weekWinRandom) ? '(' + (dayCountArr[num].weekWinRandom) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekVoteRandom) ? this.AddComma(dayAmountArr[num].weekVoteRandom) : '-'} <br /> {(dayAmountArr[num].weekVoteRandom) ? '(' + (dayCountArr[num].weekVoteRandom) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekRank) ? this.AddComma(dayAmountArr[num].weekRank) : '-'} <br /> {(dayAmountArr[num].weekRank) ? '(' + (dayCountArr[num].weekRank) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].monthRank) ? this.AddComma(dayAmountArr[num].monthRank) : '-'} <br /> {(dayAmountArr[num].monthRank) ? '(' + (dayCountArr[num].monthRank) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].lotteryOpen) ? this.AddComma(dayAmountArr[num].lotteryOpen) : '-'} <br /> {(dayAmountArr[num].lotteryOpen) ? '(' + (dayCountArr[num].lotteryOpen) + ')'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].lotteryRecommender) ? this.AddComma(dayAmountArr[num].lotteryRecommender) : '-'} <br /> {(dayAmountArr[num].lotteryRecommender) ? '(' + (dayCountArr[num].lotteryRecommender) + '회)'  : ''}</td>
            </tr>
          );
          num++;
        });
        return data;
      }
    
    AddComma(data_value) {
    return Number(data_value).toLocaleString('en');
    }


      
    highcharts(dayAmountArr,issueDateArr) {
        const config = {
        credits: {
        enabled: false
        },
        chart: {
            borderWidth: 0,
            height: '50%',
            type: 'column',
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: issueDateArr
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total AI coin volume'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: 0,
            verticalAlign: 'top',
            y: 25,
            floating: false,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: '회차 투표',
            data: dayAmountArr.map((d) => {
                if(!d.userPik){
                return 0
                }  
                return d.userPik
            })
        }, {
            name: '회차 참가 Lucky',
            data: dayAmountArr.map((d) => {
                if(!d.voteLucky){
                return 0
                }  
                return d.voteLucky
            })
        }, {
            name: '회차 예측 정답 추첨',
            data: dayAmountArr.map((d) => {
                if(!d.userWinRandom){
                return 0
                } 
                return d.userWinRandom
            })
        },
        {
            name: '일간 정답자 추첨',
            data: dayAmountArr.map((d) => {
            if(!d.dayWinRandom){
            return 0
            } 
            return d.dayWinRandom
            })
        }, {
            name: '일간 투표자 추첨',
            data: dayAmountArr.map((d) => {
            if(!d.dayVoteRandom){
            return 0
            } 
            return d.dayVoteRandom
            })
        }, {
            name: '주간 정답자 추첨',
            data: dayAmountArr.map((d) => {
            if(!d.weekWinRandom){
            return 0
            }  
            return d.weekWinRandom
            })
        }, {
            name: '주간 투표자 추첨',
            data: dayAmountArr.map((d) => {
            if(!d.weekVoteRandom){
            return 0
            } 
            return d.weekVoteRandom
            })
        }, {
            name: '주간 정답자 랭킹',
            data: dayAmountArr.map((d) => {
            if(!d.weekRank){
            return 0
            } 
            return d.weekRank
            })
        }, {
            name: '월간 정답자 랭킹',
            data: dayAmountArr.map((d) => {
            if(!d.monthRank){
            return 0
            } 
            return d.monthRank
            })
        }, {
            name: '랜덤 선물상자',
            data: dayAmountArr.map((d) => {
            if(!d.lotteryOpen){
            return 0
            } 
            return d.lotteryOpen
            })
        }, {
            name: '추천인 보상',
            data: dayAmountArr.map((d) => {
            if(!d.lotteryRecommender){
            return 0
            } 
            return d.lotteryRecommender
            })
        }
        ]
    };
    return config
    }


    render() {
		return (
			<div className="content">
				<Grid fluid>
					<Row>
						<Col md={12}>
							<Card
								title={`조회기간 (총 ${this.state.totalDayCount}일)`}
								ctTableFullWidth
								ctTableResponsive
								content={
                                    <div>
                                        <Row style={{textAlign : "center"}}>
                                            <div className="chart-container">
                                                <ReactHighcharts config={this.highcharts(this.state.dayAmount,this.state.issueDate)}></ReactHighcharts>
                                            </div>
                                        </Row>
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
                                                    onChange={this.sortOptionChange}
                                                    options={this.state.sortOption}
                                                    value={this.state.selectedSortOption}
                                                />
                                                정렬순서
                                            </Col>
                                            <Col md={1}>
                                                <Select
                                                    onChange={this.listCountChange}
                                                    options={this.state.listCount}
                                                    value={this.state.selectedListCount}
                                                />
                                                검색일수
                                            </Col>
                                            <Col md={1} >
                                                <Button bsStyle="info" fill onClick={(e) => this.onSearch(e)} >
                                                    검색
                                                </Button>
                                            </Col>
                                        </Row>
                                            <div>
                                                <Table striped  hover>
                                                <thead>
                                                    <tr key="aicoin-day-count">
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >NO</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >총 AI coin<br></br> 발행량 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 투표 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 참가<br></br> Lucky (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 예측<br></br> 정답 추첨 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 정답자<br></br> 추첨 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 투표자<br></br> 추첨 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자<br></br> 추첨 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 투표자<br></br> 추첨 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자<br></br> 랭킹 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >월간 정답자<br></br> 랭킹 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >랜덤 <br></br>선물상자 (회)</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >추천인 (회)</th>
                                                    </tr>  
                                                </thead>
                                                <tbody>
                                                    {this.AddComma(this.state.dayAmount) &&
                                                    this.getDayCoinAmount(this.state.dayAmount, this.state.issueDate, this.state.dayCount)
                                                    }
                                                    <tr>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >Total</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >-</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.AddComma(this.state.periodAmount)} <br/> ({this.state.periodCount}) </td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.userPik !== 0 ? this.AddComma(this.state.periodRewordAmount.userPik) : '-'}  <br/> {this.state.periodRewordAmount.userPik !== 0 ? '(' + (this.state.periodRewordCount.userPik) + ')' : '' } </td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.voteLucky !== 0 ? this.AddComma(this.state.periodRewordAmount.voteLucky) : '-'} <br/> {this.state.periodRewordAmount.voteLucky !== 0 ? '(' + (this.state.periodRewordCount.voteLucky) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.userWinRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.userWinRandom) : '-'} <br/> {this.state.periodRewordAmount.userWinRandom !== 0 ? '(' + (this.state.periodRewordCount.userWinRandom) + ')' : '' }</td>            
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.dayWinRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.dayWinRandom) : '-'} <br/> {this.state.periodRewordAmount.dayWinRandom !== 0 ? '(' + (this.state.periodRewordCount.dayWinRandom) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.dayVoteRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.dayVoteRandom) : '-'} <br/> {this.state.periodRewordAmount.dayVoteRandom !== 0 ? '(' + (this.state.periodRewordCount.dayVoteRandom) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.weekWinRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.weekWinRandom) : '-'} <br/> {this.state.periodRewordAmount.weekWinRandom !== 0 ? '(' + (this.state.periodRewordCount.weekWinRandom) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.weekVoteRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.weekVoteRandom) : '-'} <br/> {this.state.periodRewordAmount.weekVoteRandom !== 0 ? '(' + (this.state.periodRewordCount.weekVoteRandom) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.weekRank !== 0 ? this.AddComma(this.state.periodRewordAmount.weekRank) : '-'} <br/> {this.state.periodRewordAmount.weekRank !== 0 ? '(' + (this.state.periodRewordCount.weekRank) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.monthRank !== 0 ? this.AddComma(this.state.periodRewordAmount.monthRank) : '-'} <br/> {this.state.periodRewordAmount.monthRank !== 0 ? '(' + (this.state.periodRewordCount.monthRank) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.lotteryOpen !== 0 ? this.AddComma(this.state.periodRewordAmount.lotteryOpen) : '-'} <br/> {this.state.periodRewordAmount.lotteryOpen !== 0 ? '(' + (this.state.periodRewordCount.lotteryOpen) + ')' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.lotteryRecommender !== 0 ? this.AddComma(this.state.periodRewordAmount.lotteryRecommender) : '-'} <br/> {this.state.periodRewordAmount.lotteryRecommender !== 0 ? '(' + (this.state.periodRewordCount.userPik) + ')' : '' }</td> 
                                                    </tr>
                                                </tbody>
                                                </Table>
                                            </div>
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
                        totalItemsCount={this.state.totalDayCount}
                        pageRangeDisplayed={10}
                        onChange={this.pageChange}
                    />
                </div>
			</div>
		);
	}
}

export default Statistics;
