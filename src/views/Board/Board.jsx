import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray ,style } from "variables/Variables.jsx";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import cp from '../../cp';

class BoardList extends Component {

  constructor(props) {
    super(props);
		this.state = {
				// or Date or Moment.js
				isLoad : false,
				data: '',

		};

		const queryString = require('query-string');
		const parsed = queryString.parse(this.props.location.search);

		//console.log(parsed);
		if(!this.state.isLoad){
			axios.post(cp.server_ip+'/api/board', {
					proc: 'boardList',
					userId: window.localStorage['nu_id'],
					userToken: window.localStorage['nu_token'],
					page : parsed.page
			}).then(res => {
					console.log(res.data);

					if(res.data.err){window.location.href='/';}
					else{this.setState({data : res.data , isLoad:true})}
					
			}).catch(err => { console.log(err); });
		}

  }


  render() {
		var tableTd = new Array();
		var tableTh = new Array();
		tableTh.push(
			<tr>
				<th style={Object.assign({}, style.Config.w20, style.Config.wordCenter, style.Config.wordBlod)} >날짜</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >카테고리</th>
				<th style={Object.assign({}, style.Config.w10, style.Config.wordCenter, style.Config.wordBlod)} >하위 카테고리</th>
				<th style={Object.assign({}, style.Config.w60, style.Config.wordLeft, style.Config.wordBlod)} >제목</th>
			</tr>
		
		)

		for(var item of this.state.data){
				var link = '/boardWrite?uid='+item._id;
				tableTd.push(
				<tr>
					<td style={Object.assign({}, style.Config.w20, style.Config.wordCenter)} ><NavLink to={link} > {item.date}</NavLink></td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)} >{item.boardCate}</td>
					<td style={Object.assign({}, style.Config.w10, style.Config.wordCenter)} >{item.subCate}</td>
					<td style={Object.assign({}, style.Config.w60, style.Config.wordLeft)} >{item.titleKr}</td>
				</tr>);

		}

		return (
      <div className="content">
        <Grid fluid>
					<NavLink
						to='/boardWrite'
						className="nav-link"
						activeClassName="active"
					>
						<p>Board Add</p>
					</NavLink>
          <Row>
            <Col md={12}>
              <Card
                title="Board List"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
											{tableTh}
                    </thead>
                    <tbody>
											{tableTd}
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

export default BoardList;
