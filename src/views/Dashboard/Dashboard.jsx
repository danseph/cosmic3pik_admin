import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import Axios from 'axios';
import cp from '../../cp';

import { StatsCard } from "components/StatsCard/StatsCard.jsx";

class Dashboard extends Component {

  constructor() {
    super()
    this.state = {
      totalAiCoin: 0,
    };
  }

  getAicoins() {
    const token = window.localStorage['nu_token'];
    Axios.post(`${cp.server_ip}/api/coins`, { token })
      .then((res) => {
        if (!res || !res.data || !res.data.coins) return false;
        // for only AI coin
        const coins = res.data.coins.find(coin => coin.name === '3');
        if (!coins) return false;
        this.setState({ totalAiCoin: coins.total });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
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
    const { totalAiCoin } = this.state;
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
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
