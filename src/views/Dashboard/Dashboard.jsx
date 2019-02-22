import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import Axios from 'axios';
import cp from '../../cp';

import { StatsCard } from "components/StatsCard/StatsCard.jsx";

class Dashboard extends Component {

  constructor() {
    super()
    this.state = {
      totalAiCoin: 0,
      usersCount: 0,
    };
  }

  pleaseLogin() {
    alert('Please login!');
    window.location.href='/';
    return;
  }

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
        if (!data.coins) return alert('Error, there is no coin!');
        // for only AI coin
        const coins = data.coins.find(coin => coin.name === '3');
        if (!coins) return false;
        this.setState({ totalAiCoin: coins.total });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

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
      this.setState({ usersCount: res.data.count });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  }

  componentDidMount() {
    this.getAicoins();
    this.getUserCount();
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
    const { totalAiCoin, usersCount } = this.state;
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
                statsValue={usersCount}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
                statsClick={this.getUserCount.bind(this)}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
