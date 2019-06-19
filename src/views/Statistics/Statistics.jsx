import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import * as d3 from "d3";


import Card from "components/Card/Card.jsx";
import Axios from 'axios';
import cp from '../../cp';
import { style } from 'variables/Variables.jsx';

import { StatsCard } from "components/StatsCard/StatsCard.jsx";


class Dashboard extends Component {

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

  // 총 가입자 수와 월별 가입자수를 요청
  getUserCount() {
    // All users count
    Axios.get(`${cp.server_ip}/api/users/count`, {
      headers: {
        Authorization : `Bearer ${window.localStorage['nu_token']}`,
      },
    })
    .then((res) => {
      const data = res.data;
      if (!res || !data) return alert('Error, no data!');
      if (data.err && data.errStatus === 0) return this.pleaseLogin();
      if (data.err) return alert(`Error, ${data.errStatus}: ${data.err}`);
      if (!data.count) return alert('Error, there is no user count!');
      this.setState({ usersTotalCnt: data.result.totalCount, usersMonthCnt: data.result.monthCount });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  }

  // 월별 가입자 수
  getMonthUserCount(monthArr) {
    let data = [];
    monthArr.map(item => {
      data.push(
				<tr  key={item._id}>
					<td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)} >{item._id}</td>
					<td style={Object.assign({}, style.Config.w15, style.Config.wordCenter)} >{item.count}</td>
        </tr>
      );
    });
    return data;
  }

    // 일일 코인발행량
    getDayCoinAmount(dayAmountArr,issueDateArr) {
      let data = [];
      let num =0 ;
      dayAmountArr.map(item => {
        data.push(
          <tr key={issueDateArr[num]}>
            <td style={Object.assign({}, style.Config.w5, style.Config.wordCenter)} >{issueDateArr[num]}</td>
            <td style={Object.assign({}, style.Config.w15, style.Config.wordCenter)} >{dayAmountArr[num]}</td>
          </tr>
        );
        num++;
      });
      return data;
    }
    
    // D3 그래프
    graph(dayAmountArr,issueDateArr){
      
      var dataset = [];
      var num =0 ;
      dayAmountArr.map(item => {
        dataset.push(
            {
              y : dayAmountArr[num],
              x : issueDateArr[num]
            }
        );
        num++;
      });
    

      var svg = d3.select("svg");
      var width  = 500;
      var height = 250;
      var svgG = svg.append("g")
      .attr("transform", "translate(30, 0)");
      var xScale = d3.scaleBand()
      .domain([d3.min(dataset, function(d){ return d.x; }), d3.max(dataset, function(d){ return d.x; })])
      .range([0, width]).padding(0.2);
      var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d){ return d.y; })])
      .range([height, 0]);

      svgG.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("height", function(d, i) {return height-yScale(d.y)})
      .attr("width", xScale.bandwidth())
      .attr("x", function(d, i) {return xScale(d.x)})
      .attr("y", function(d, i) {return yScale(d.y)})
      .attr("fill", "steelblue")

      svgG.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function(d) {return d.y})
      .attr("class", "text")
      .attr("x", function(d, i) {return xScale(d.x)+xScale.bandwidth()/2})
      .style("text-anchor", "middle")
      .attr("y", function(d, i) {return yScale(d.y) + 15});

      svgG.append("g")
      .attr("transform", "translate(0," + (height) + ")")
      .call(d3.axisBottom(xScale));

      svgG.append("g")
      .call(d3.axisLeft(yScale)
            .ticks(5));

      // var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
      // var svgWidth = 1500, svgHeight = 180, barPadding = 5;

      // var barWidth = svgWidth / dataset.length;
      // var svg = d3.select('svg')
      //     .attr("width", svgWidth)
      //     .attr("height", svgHeight)
          
      
      // var xScale = d3.scaleLinear()
      //     .domain([0, d3.max(dataset)])
      //     .range([0, svgWidth]);
      
      // var yScale = d3.scaleLinear()
      //     .domain([ 0, d3.max(dataset) ])
      //     .range([svgHeight, 0]);
      
      // var x_axis = d3.axisBottom().scale(xScale);
      // var y_axis = d3.axisLeft().scale(yScale);
      
      // svg.append("g")
      //     .attr("transform", "translate(50, 10)")
      //     .call(y_axis);
      
      // var xAxisTranslate = svgHeight - 20;
      
      // svg.append("g")
      //     .attr("transform", "translate(50, " + xAxisTranslate +")")
      //     .call(x_axis);
          
      // var bars = svg.selectAll("rect")
      //     .data(dataset)
      //     .enter()
      //     .append("rect")
      //     .attr("y", function(d) {
      //         return svgHeight - d 
      //     })
      //     .attr("height", function(d) { 
      //         return d; 
      //     })
      //     .attr("width", barWidth - barPadding)
      //     .attr("class", "bar")
      //     .attr("transform", function (d, i) {
      //         var translate = [barWidth * i, 0]; 
      //         return "translate("+ translate +")";
      //     }).attr("fill", "steelblue")
      }


  componentDidMount() {
    this.getAicoins();
    this.getUserCount();
    // this.getAiCoinAmount();
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
            <Col lg={12}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="AI coin"
                statsValue={totalAiCoin}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
                statsClick={this.getAicoins.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Card
                content= {
                  <svg style={{width:'500', height:'300'}}>
                    {this.graph(this.state.dayAmount,this.state.issueDate)}
                  </svg>
                }
              />
            </Col>
          </Row>
          <Row>
          <Col lg={12}>
              <Card
                title="AI coin volume during a week"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover >
                    <thead>
                      <tr key="aicoin-day-count">
                        <th style={Object.assign({}, style.Config.w15, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
                        <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >AI coin 발행량</th>
                      </tr>  
                    </thead>
                    <tbody>
                      {this.state.dayAmount &&
                        this.getDayCoinAmount(this.state.dayAmount,this.state.issueDate)
                      }
                      <tr>
                          <td style={Object.assign({}, style.Config.w15, style.Config.wordCenter, style.Config.wordBlod)} >Total</td>
                          <td style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >{this.state.weekAmount}</td>
                      </tr>
                    </tbody>
                  </Table>
                }
              />
            </Col>
            
          </Row>

        </Grid>
      </div>
    );
  }
}

export default Dashboard;
