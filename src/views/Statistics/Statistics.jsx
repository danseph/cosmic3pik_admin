import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    Table
  } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import Card from "components/Card/Card.jsx";
import { style } from "variables/Variables.jsx";
import axios from 'axios';
import cp from '../../cp';
import moment from 'moment';
import ReactHighcharts from 'react-highcharts';
import Highcharts from 'highcharts';
import ReactToExcel from 'react-html-table-to-excel';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';


Highcharts.setOptions({
  lang: {
      thousandsSep: ','
  }
});

let curDate = new Date();
let newDate = moment(curDate).subtract(6, 'days').format('YYYY-MM-DD 00:00:00');
	newDate = new Date(newDate); 


class Statistics extends Component {
    
    constructor(props) {
        super(props);

        // config state
        this.state = {
            dayAmount:[],
            dayCount:[],
            periodAmount: 0,
            periodCount: 0,
            issueDate:[],
            periodRewordAmount:{},
            periodRewordCount:{},
            isLoad: false,
            startDate: newDate,
            endDate: curDate
        };

        // fetch the list when this page is loaded
        if (!this.state.isLoad) {
            this.fetch();
        }
    }

    /**
     * fetch list
     */
    fetch = () => {
        const queryString = require('query-string');
        let newStartDate = moment(this.state.startDate).format('YYYY-MM-DD 00:00:00');
        newStartDate = new Date(newStartDate).getTime();
        let newEndDate = moment(this.state.endDate).format('YYYY-MM-DD 24:00:00');
        newEndDate = new Date(newEndDate).getTime();
        let endDateMinusOne = moment(this.state.endDate).subtract(31, 'days').format('YYYY-MM-DD 24:00:00');
        endDateMinusOne = new Date(endDateMinusOne).getTime();

        if( newStartDate < endDateMinusOne && this.state.startDate  ){
            alert('최대 조회기간은 한달(31일)로 제한됩니다. 기간을 재설정하여 조회해주세요.')
        }
        else if( newStartDate > newEndDate  ){
            alert('조회기간 설정이 올바르지 않습니다. 기간을 재설정하여 조회해주세요.')
        }
        else {
            axios.post(`${cp.server_ip}/api/stats/stats_list`,
            {
                data: {
                    token: window.localStorage['nu_token'],
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
                            periodAmount: data.periodAmount, 
                            periodCount: data.periodCount , 
                            dayAmount : data.dayAmount, 
                            dayCount : data.dayCount, 
                            issueDate : data.issueDate, 
                            periodRewordAmount : data.periodRewordAmount, 
                            periodRewordCount: data.periodRewordCount,
                            isLoad: true 
                        },
                        () => this.render()
                    ) 
                }
            }).catch(err => { 
                console.error(err); 
            })
        }
    }

    /**
     * search
     */
    onSearch = () => {
        this.fetch();
    };

    /**
     * datepicker change
     */
    changedStartDateValue = (e) => { 
        this.setState({ 
            startDate: new Date(moment(e).format("YYYY-MM-DD 00:00:00"))
        });
    }

        /**
     * datepicker change
     */
    changedEndDateValue = (e) => { 
        this.setState({ 
            endDate : new Date(moment(e).format("YYYY-MM-DD 23:59:59"))
        });
    }


    /**
     * 조회기간 이벤트 (최근 한달)
     */
    recentOneMonth = () => { 
        var curDate = new Date();
        var newDate = moment(curDate).subtract(30, 'days').format('YYYY-MM-DD 00:00:00');
            newDate = new Date(newDate); 

        this.setState({startDate : newDate, endDate: curDate}, () => this.fetch()) ;
    };

        /**
     * 조회기간 이벤트 (최근 일주일)
     */
    recentOneWeek = () => { 
        var curDate = new Date();
        var newDate = moment(curDate).subtract(6, 'days').format('YYYY-MM-DD 00:00:00');
            newDate = new Date(newDate); 

        this.setState({startDate : newDate, endDate: curDate}, () => this.fetch()) ;
    };

    getDayCoinAmount(dayAmountArr,issueDateArr,dayCountArr) {
        let data = [];
        let num = 0;
        dayAmountArr.map(item => {
          data.push(
            <tr key={issueDateArr[num]}>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{issueDateArr[num]}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{this.AddComma(dayAmountArr[num].labTotal)} <br />  [ {dayCountArr[num].labTotalCount} ]</td>           
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userPik) ? this.AddComma(dayAmountArr[num].userPik) : '-'} <br /> {(dayAmountArr[num].userPik) ? '[ ' + (dayCountArr[num].userPik) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].voteLucky) ? this.AddComma(dayAmountArr[num].voteLucky) : '-'} <br /> {(dayAmountArr[num].voteLucky) ? '[ ' + (dayCountArr[num].voteLucky) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userWinRandom) ? this.AddComma(dayAmountArr[num].userWinRandom) : '-'} <br /> {(dayAmountArr[num].userWinRandom) ? '[ ' + (dayCountArr[num].userWinRandom) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayWinRandom) ? this.AddComma(dayAmountArr[num].dayWinRandom) : '-'} <br /> {(dayAmountArr[num].dayWinRandom) ? '[ ' + (dayCountArr[num].dayWinRandom) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayVoteRandom) ? this.AddComma(dayAmountArr[num].dayVoteRandom) : '-'} <br /> {(dayAmountArr[num].dayVoteRandom) ? '[ ' + (dayCountArr[num].dayVoteRandom) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekWinRandom) ? this.AddComma(dayAmountArr[num].weekWinRandom) : '-'} <br /> {(dayAmountArr[num].weekWinRandom) ? '[ ' + (dayCountArr[num].weekWinRandom) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekVoteRandom) ? this.AddComma(dayAmountArr[num].weekVoteRandom) : '-'} <br /> {(dayAmountArr[num].weekVoteRandom) ? '[ ' + (dayCountArr[num].weekVoteRandom) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekRank) ? this.AddComma(dayAmountArr[num].weekRank) : '-'} <br /> {(dayAmountArr[num].weekRank) ? '[ ' + (dayCountArr[num].weekRank) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].monthRank) ? this.AddComma(dayAmountArr[num].monthRank) : '-'} <br /> {(dayAmountArr[num].monthRank) ? '[ ' + (dayCountArr[num].monthRank) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].lotteryOpen) ? this.AddComma(dayAmountArr[num].lotteryOpen) : '-'} <br /> {(dayAmountArr[num].lotteryOpen) ? '[ ' + (dayCountArr[num].lotteryOpen) + ' ]'  : ''}</td>
              <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].lotteryRecommender) ? this.AddComma(dayAmountArr[num].lotteryRecommender) : '-'} <br /> {(dayAmountArr[num].lotteryRecommender) ? '[ ' + (dayCountArr[num].lotteryRecommender) + ' ]'  : ''}</td>
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
								title={`Chart & List for AI coin volume`}
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
                                                시작일
                                                <DatePickerInput
                                                        name = 'startDate'
                                                        onChange={e => this.changedStartDateValue(e)}
                                                        value={ this.state.startDate  }
                                                        className='my-custom-datepicker-component'
                                                />
                                            </Col>
                                            <Col md={2}>
                                                종료일
                                                <DatePickerInput
                                                        name = 'endDate'
                                                        onChange={e => this.changedEndDateValue(e)}
                                                        value={this.state.endDate}
                                                        className='my-custom-datepicker-component'
                                                />
                                            </Col>
                                            <Col md={1} >
                                                <br />
                                                <Button bsStyle="info" fill onClick={(e) => this.onSearch(e)}  >
                                                    검색
                                                </Button>
                                            </Col>
                                            <Col md={1} > 
                                                <br />
                                                    <Button bsStyle="primary" round onClick={(e) => this.recentOneWeek(e)}>
                                                        최근 일주일
                                                    </Button>
                                            </Col>
                                            <Col md={1}  >
                                                <br />
                                                    <Button bsStyle="primary" round onClick={(e) => this.recentOneMonth(e)}>
                                                        최근 한달
                                                    </Button>
                                            </Col>
                                            <Col md={1} style={{float: 'right', marginRight: 30}} >
                                                <br />
                                                <ReactToExcel
                                                        className="test-table-xls-button"
                                                        table="table-to-xls"
                                                        filename="statistics"
                                                        sheet="AI coin volume"
                                                        buttonText="Download as Excel (.xls)"
                                                        />
                                            </Col>
                                        </Row>
                                            <div>
                                                <Table striped  hover id='table-to-xls'>
                                                <thead>
                                                    <tr key="aicoin-day-count">
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >총 AI coin<br></br> 발행량 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 투표 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 참가<br></br> Lucky [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 예측<br></br> 정답 추첨 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 정답자<br></br> 추첨 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 투표자<br></br> 추첨 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자<br></br> 추첨 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 투표자<br></br> 추첨 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자<br></br> 랭킹 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >월간 정답자<br></br> 랭킹 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >랜덤 <br></br>선물상자 [횟수]</th>
                                                    <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >추천인 [횟수]</th>
                                                    </tr>  
                                                </thead>
                                                <tbody>
                                                    {this.AddComma(this.state.dayAmount) &&
                                                    this.getDayCoinAmount(this.state.dayAmount, this.state.issueDate, this.state.dayCount)
                                                    }
                                                    <tr>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >Total</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.AddComma(this.state.periodAmount)} <br/> [ {this.state.periodCount} ] </td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.userPik !== 0 ? this.AddComma(this.state.periodRewordAmount.userPik) : '-'}  <br/> {this.state.periodRewordCount.userPik !== 0 ? '[ ' + (this.state.periodRewordCount.userPik) + ' ]' : '' } </td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.voteLucky !== 0 ? this.AddComma(this.state.periodRewordAmount.voteLucky) : '-'} <br/> {this.state.periodRewordCount.voteLucky !== 0 ? '[ ' + (this.state.periodRewordCount.voteLucky) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.userWinRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.userWinRandom) : '-'} <br/> {this.state.periodRewordCount.userWinRandom !== 0 ? '[ ' + (this.state.periodRewordCount.userWinRandom) + ' ]' : '' }</td>            
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.dayWinRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.dayWinRandom) : '-'} <br/> {this.state.periodRewordAmount.dayWinRandom !== 0 ? '[ ' + (this.state.periodRewordCount.dayWinRandom) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.dayVoteRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.dayVoteRandom) : '-'} <br/> {this.state.periodRewordAmount.dayVoteRandom !== 0 ? '[ ' + (this.state.periodRewordCount.dayVoteRandom) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.weekWinRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.weekWinRandom) : '-'} <br/> {this.state.periodRewordAmount.weekWinRandom !== 0 ? '[ ' + (this.state.periodRewordCount.weekWinRandom) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.weekVoteRandom !== 0 ? this.AddComma(this.state.periodRewordAmount.weekVoteRandom) : '-'} <br/> {this.state.periodRewordAmount.weekVoteRandom !== 0 ? '[ ' + (this.state.periodRewordCount.weekVoteRandom) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.weekRank !== 0 ? this.AddComma(this.state.periodRewordAmount.weekRank) : '-'} <br/> {this.state.periodRewordAmount.weekRank !== 0 ? '[ ' + (this.state.periodRewordCount.weekRank) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.monthRank !== 0 ? this.AddComma(this.state.periodRewordAmount.monthRank) : '-'} <br/> {this.state.periodRewordAmount.monthRank !== 0 ? '[ ' + (this.state.periodRewordCount.monthRank) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.lotteryOpen !== 0 ? this.AddComma(this.state.periodRewordAmount.lotteryOpen) : '-'} <br/> {this.state.periodRewordAmount.lotteryOpen !== 0 ? '[ ' + (this.state.periodRewordCount.lotteryOpen) + ' ]' : '' }</td>
                                                        <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.periodRewordAmount.lotteryRecommender !== 0 ? this.AddComma(this.state.periodRewordAmount.lotteryRecommender) : '-'} <br/> {this.state.periodRewordAmount.lotteryRecommender !== 0 ? '[ ' + (this.state.periodRewordCount.userPik) + ' ]' : '' }</td> 
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
			</div>
		);
	}
}

export default Statistics;
