import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import Axios from 'axios';
import cp from '../../cp';
import { style } from 'variables/Variables.jsx';
import ReactHighcharts from 'react-highcharts';
import Highcharts from 'highcharts';


Highcharts.setOptions({
  lang: {
      thousandsSep: ','
  }
});


class Statistics extends Component {

  constructor() {
    super()
    this.state = {
      totalAiCoin: 0,
      usersTotalCnt: 0,
      usersMonthCnt: [],
      dayAmount:[],
      weekAmount: 0,
      issueDate:[],
      weekRewordAmount:{},
      weekRewordCount:{}
    };
  }

  // 로그인 페이지로 이동
  pleaseLogin() {
    alert('Please login!');
    window.location.href='/';
    return;
  }

  // 총 지급된 코인발행량 및 주간코인발행량, 일일코인발행량 요청
  getAicoins() {
    // Coins
    Axios.get(`${cp.server_ip}/api/coins/count`, {
        headers: {
          Authorization : `Bearer ${window.localStorage['nu_token']}`,
        },
      })
      .then((res) => {
        const data = res.data;
        if (!res || !data) return alert('Error, no data!');
        if (data.err && data.errStatus === 0) return this.pleaseLogin();
        if (data.err) return alert(`Error, ${data.errStatus}: ${data.err}`);
        if (!data) return alert('Error, there is no data!');
        // for only AI coin
        // const coins = data.coins.find(coin => coin.name === '3');
        // if (!coins) return false;
        this.setState({ totalAiCoin: data.result.totalAmount, weekAmount: data.result.weekAmount, weekCount: data.result.weekCount , dayAmount : data.result.dayAmount.reverse(), dayCount : data.result.dayCount.reverse(), issueDate : data.result.issueDate.reverse(), weekRewordAmount : data.result.weekRewordAmount, weekRewordCount: data.result.weekRewordCount });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }


  // 일일 코인발행량
  getDayCoinAmount(dayAmountArr,issueDateArr,dayCountArr) {
    let data = [];
    let num =0 ;
    dayAmountArr.map(item => {
      data.push(
        <tr key={issueDateArr[num]}>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{issueDateArr[num]}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{this.AddComma(dayAmountArr[num].labTotal)} <br />  ({dayCountArr[num].labTotalCount}회)</td>           
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userPik) ? this.AddComma(dayAmountArr[num].userPik) : '-'} <br /> {(dayAmountArr[num].userPik) ? '(' + (dayCountArr[num].userPik) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].voteLucky) ? this.AddComma(dayAmountArr[num].voteLucky) : '-'} <br /> {(dayAmountArr[num].voteLucky) ? '(' + (dayCountArr[num].voteLucky) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userWinRandom) ? this.AddComma(dayAmountArr[num].userWinRandom) : '-'} <br /> {(dayAmountArr[num].userWinRandom) ? '(' + (dayCountArr[num].userWinRandom) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userWin) ? this.AddComma(dayAmountArr[num].userWin) : '-'} <br /> {(dayAmountArr[num].userWin) ? '(' + (dayCountArr[num].userWin) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayWinRandom) ? this.AddComma(dayAmountArr[num].dayWinRandom) : '-'} <br /> {(dayAmountArr[num].dayWinRandom) ? '(' + (dayCountArr[num].dayWinRandom) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayVoteRandom) ? this.AddComma(dayAmountArr[num].dayVoteRandom) : '-'} <br /> {(dayAmountArr[num].dayVoteRandom) ? '(' + (dayCountArr[num].dayVoteRandom) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekWinRandom) ? this.AddComma(dayAmountArr[num].weekWinRandom) : '-'} <br /> {(dayAmountArr[num].weekWinRandom) ? '(' + (dayCountArr[num].weekWinRandom) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekVoteRandom) ? this.AddComma(dayAmountArr[num].weekVoteRandom) : '-'} <br /> {(dayAmountArr[num].weekVoteRandom) ? '(' + (dayCountArr[num].weekVoteRandom) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekRank) ? this.AddComma(dayAmountArr[num].weekRank) : '-'} <br /> {(dayAmountArr[num].weekRank) ? '(' + (dayCountArr[num].weekRank) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].monthRank) ? this.AddComma(dayAmountArr[num].monthRank) : '-'} <br /> {(dayAmountArr[num].monthRank) ? '(' + (dayCountArr[num].monthRank) + '회)'  : ''}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].lotteryOpen) ? this.AddComma(dayAmountArr[num].lotteryOpen) : '-'} <br /> {(dayAmountArr[num].lotteryOpen) ? '(' + (dayCountArr[num].lotteryOpen) + '회)'  : ''}</td>
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
        text: '주간 보상별 AI 코인 발행량'
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
      }, {
          name: '예측 정답',
          data: dayAmountArr.map((d) => {
            if(!d.userWin){
             return 0
            } 
            return d.userWin
          })
      }, {
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



  componentDidMount() {
    this.getAicoins();
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  render() {
    // const { totalAiCoin, usersTotalCnt: usersTotalCnt } = this.state;
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={12}  >
                <Card 
                  title= 'AI coin volume during a week'
                  category=""
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <div>
                      <Row style={{textAlign : "center"}}>
                          <div className="chart-container">
                            <ReactHighcharts config={this.highcharts(this.state.dayAmount,this.state.issueDate)}></ReactHighcharts>
                          </div>
                      </Row>
                      <Row>
                          <div className="table-container">
                              <Table striped bordered hover>
                              <thead>
                                <tr key="aicoin-day-count">
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >총 AI coin<br></br> 발행량</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 투표</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 참가<br></br> Lucky </th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 예측<br></br> 정답 추첨</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >예측 정답</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 정답자<br></br> 추첨</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 투표자<br></br> 추첨</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자<br></br> 추첨</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 투표자<br></br> 추첨</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자<br></br> 랭킹</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >월간 정답자<br></br> 랭킹</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >랜덤 <br></br>선물상자</th>
                                  <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >추천인</th>
                                </tr>  
                              </thead>
                              <tbody>
                                {this.AddComma(this.state.dayAmount) &&
                                  this.getDayCoinAmount(this.state.dayAmount, this.state.issueDate, this.state.dayCount)
                                }
                                <tr>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >Total</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.AddComma(this.state.weekAmount)} <br/> ({this.state.weekCount}회) </td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.userPik !== 0 ? this.AddComma(this.state.weekRewordAmount.userPik) : '-'} <br/> {this.state.weekRewordAmount.userPik !== 0 ? '(' + (this.state.weekRewordCount.userPik) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.voteLucky !== 0 ? this.AddComma(this.state.weekRewordAmount.voteLucky) : '-'} <br/> {this.state.weekRewordAmount.voteLucky !== 0 ? '(' + (this.state.weekRewordCount.voteLucky) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.userWinRandom !== 0 ? this.AddComma(this.state.weekRewordAmount.userWinRandom) : '-'} <br/> {this.state.weekRewordAmount.userWinRandom !== 0 ? '(' + (this.state.weekRewordCount.userWinRandom) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.userWin !== 0 ? this.AddComma(this.state.weekRewordAmount.userWin) : '-'} <br/> {this.state.weekRewordAmount.userWin !== 0 ? '(' + (this.state.weekRewordCount.userWin) + '회)' : '' }</td>  
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.dayWinRandom !== 0 ? this.AddComma(this.state.weekRewordAmount.dayWinRandom) : '-'} <br/> {this.state.weekRewordAmount.dayWinRandom !== 0 ? '(' + (this.state.weekRewordCount.dayWinRandom) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.dayVoteRandom !== 0 ? this.AddComma(this.state.weekRewordAmount.dayVoteRandom) : '-'} <br/> {this.state.weekRewordAmount.dayVoteRandom !== 0 ? '(' + (this.state.weekRewordCount.dayVoteRandom) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.weekWinRandom !== 0 ? this.AddComma(this.state.weekRewordAmount.weekWinRandom) : '-'} <br/> {this.state.weekRewordAmount.weekWinRandom !== 0 ? '(' + (this.state.weekRewordCount.weekWinRandom) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.weekVoteRandom !== 0 ? this.AddComma(this.state.weekRewordAmount.weekVoteRandom) : '-'} <br/> {this.state.weekRewordAmount.weekVoteRandom !== 0 ? '(' + (this.state.weekRewordCount.weekVoteRandom) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.weekRank !== 0 ? this.AddComma(this.state.weekRewordAmount.weekRank) : '-'} <br/> {this.state.weekRewordAmount.weekRank !== 0 ? '(' + (this.state.weekRewordCount.weekRank) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.monthRank !== 0 ? this.AddComma(this.state.weekRewordAmount.monthRank) : '-'} <br/> {this.state.weekRewordAmount.monthRank !== 0 ? '(' + (this.state.weekRewordCount.monthRank) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.lotteryOpen !== 0 ? this.AddComma(this.state.weekRewordAmount.lotteryOpen) : '-'} <br/> {this.state.weekRewordAmount.lotteryOpen !== 0 ? '(' + (this.state.weekRewordCount.lotteryOpen) + '회)' : '' }</td>
                                    <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekRewordAmount.lotteryRecommender !== 0 ? this.AddComma(this.state.weekRewordAmount.lotteryRecommender) : '-'} <br/> {this.state.weekRewordAmount.lotteryRecommender !== 0 ? '(' + (this.state.weekRewordCount.userPik) + '회)' : '' }</td> 
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                      </Row>
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
