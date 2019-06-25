import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import * as d3 from "d3";
import Card from "components/Card/Card.jsx";
import Axios from 'axios';
import cp from '../../cp';
import { style } from 'variables/Variables.jsx';


class Statistics extends Component {

  constructor() {
    super()
    this.state = {
      totalAiCoin: 0,
      usersTotalCnt: 0,
      usersMonthCnt: [],
      dayAmount:[],
      weekAmount: 0,
      issueDate:[]
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
        this.setState({ totalAiCoin: data.result.totalAmount, weekAmount: data.result.weekAmount , dayAmount : data.result.dayAmount, issueDate : data.result.issueDate });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }


  // 일일 코인발행량
  getDayCoinAmount(dayAmountArr,issueDateArr) {
    let data = [];
    let num =0 ;
    dayAmountArr.map(item => {
      data.push(
        <tr key={issueDateArr[num]}>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{issueDateArr[num]}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{this.AddComma(dayAmountArr[num].labTotal)}</td>           
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userPik) ? this.AddComma(dayAmountArr[num].userPik) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].voteLucky) ? this.AddComma(dayAmountArr[num].voteLucky) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userWinRandom) ? this.AddComma(dayAmountArr[num].userWinRandom) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].userWin) ? this.AddComma(dayAmountArr[num].userWin) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayWinRandom) ? this.AddComma(dayAmountArr[num].dayWinRandom) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].dayVoteRandom) ? this.AddComma(dayAmountArr[num].dayVoteRandom) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekWinRandom) ? this.AddComma(dayAmountArr[num].weekWinRandom) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekVoteRandom) ? this.AddComma(dayAmountArr[num].weekVoteRandom) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].weekRank) ? this.AddComma(dayAmountArr[num].weekRank) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].monthRank) ? this.AddComma(dayAmountArr[num].monthRank) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].lotteryOpen) ? this.AddComma(dayAmountArr[num].lotteryOpen) : '-'}</td>
          <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter)} >{(dayAmountArr[num].lotteryRecommender) ? this.AddComma(dayAmountArr[num].lotteryRecommender) : '-'}</td>
        </tr>
      );
      num++;
    });
    return data;
  }

  AddComma(data_value) {
    return Number(data_value).toLocaleString('en');
    }


  // D3 그래프
  graph(dayAmountArr,issueDateArr){

    var dataset = [];
    var num =0 ;
    dayAmountArr.map(item => {
      dataset.push(
          {
            x : issueDateArr[num],
            y : dayAmountArr[num].labTotal
          }
      );
      num++;
    });
    
    var svg = d3.select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 1000")
    .classed("svg-content", true);
    var width  = 1000;
    var height = 500;
    var svgG = svg.append("g")
    .attr("transform", "translate(100, 0)");
    var xScale = d3.scaleBand()
    .domain(dataset.map(function(d) { return d.x;} ).reverse())
    .range([0, width]).padding(0.9);
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d){ return d.y; }) + d3.max(dataset, function(d){ return d.y; })/4])
    .range([height, 0])

    // .domain(dataset.map(function(d) { return d.x;} ))

    svgG.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("height", function(d, i) {return height-yScale(d.y)})
    .attr("width", xScale.bandwidth())
    .attr("x", function(d, i) {return xScale(d.x)})
    .attr("y", function(d, i) {return yScale(d.y)})
    .attr("fill", "#a9a9a9")


    svgG.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {return Number(d.y).toLocaleString('en')})
    .attr("class", "text")
    .attr("x", function(d, i) {return xScale(d.x)+xScale.bandwidth()/2})
    .style("text-anchor", "middle")
    .attr("y", function(d, i) {return yScale(d.y) - 5 });

    svgG.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .call(d3.axisBottom(xScale));
    

    svgG.append("g")
    .call(d3.axisLeft(yScale));
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
    const { totalAiCoin, usersTotalCnt: usersTotalCnt } = this.state;
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
                      <Row>
                        <div id="container" className="svg-container">
                            <svg className="svg-content"style={{
                            
                            }}>
                                {this.graph(this.state.dayAmount,this.state.issueDate)}
                            </svg>  
                        </div>
                      </Row>
                      <Table striped bordered hover>
                      <thead>
                        <tr key="aicoin-day-count">
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >총 AI coin 발행량</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 투표보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 참가 Lucky 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >회차 예측 정답 추첨보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >예측 정답 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 정답자 추첨 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >일간 투표자 추첨 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자 추첨 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 투표자 추첨 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >주간 정답자 랭킹 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >월간 정답자 랭킹 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >랜덤 선물상자 보상</th>
                          <th style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >추천인 보상</th>
                        </tr>  
                      </thead>
                      <tbody>
                        {this.AddComma(this.state.dayAmount) &&
                          this.getDayCoinAmount(this.state.dayAmount,this.state.issueDate)
                        }
                        <tr>
                            <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >Total</td>
                            <td style={Object.assign({}, style.Config.w1, style.Config.wordCenter, style.Config.wordBlod)} >{this.AddComma(this.state.weekAmount)}</td>
                        </tr>
                      </tbody>
                    </Table>
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
