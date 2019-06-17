import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";


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
            <Col lg={6} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="AI coin"
                statsValue={totalAiCoin}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
                statsClick={this.getAicoins.bind(this)}
              />
            </Col>
            <Col lg={6} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-users text-warning" />}
                statsText="Current users"
                statsValue={usersTotalCnt}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
                statsClick={this.getUserCount.bind(this)}
              />
            </Col>
          </Row>
          <Row>
          <Col md={6}>
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
            <Col md={6}>
              <Card
                title="Month users count"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr key="user-month-count">
                        <th style={Object.assign({}, style.Config.w15, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
                        <th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >가입수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.usersMonthCnt && 
                        this.getMonthUserCount(this.state.usersMonthCnt)
                      }
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
