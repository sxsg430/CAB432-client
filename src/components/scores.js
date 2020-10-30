import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import Tweet from './ui_elements/tweet';
import collect from 'collect.js';
import json from 'json-keys-sort';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import Chart from 'chart.js';
import { Bar } from '@reactchartjs/react-chart.js';

export class Scores extends Component {
state = {
    scores: [],
    roundedscore: [],
    totalScore: 0,
    sentiment: ""
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
      this.fetchTweets();
    
  }

  render() {
    const fontSizeMapper = word => Math.log2(word.value) * 5;
    const rotate = word => word.value % 360;
      if (this.state.scores.length === 0) {
          return (
              <div>
                  <h1>Loading</h1>
              </div>
          )
      } else {
        return (
            <div className="App">
              <Navbar color="dark" dark expand="md">
                          <NavbarBrand href="/">Twitter Search</NavbarBrand>
                          <Nav className="mr-auto" navbar>
                              <NavItem>
                                  <NavLink href="/">Search</NavLink>
                              </NavItem>
                          </Nav>
                      </Navbar>
              <Container fluid>
                <Row>
                  <Col xs="5" sm="5">
                  <h2> Average Score: { this.state.scores[0]}</h2>
                  <h3> Total Tweets Fetched: { this.state.scores.length}</h3>
                  <h4>Sentiment Graph</h4>
                  <Bar data={this.state.roundedscore} />
                  </Col>
                  <Col xs="7" sm="7">
                  </Col>
                </Row>
              </Container>
            </div>
          );
      }
    
  }

  async fetchTweets() {
    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    let search = window.location.search;
    let parameters = new URLSearchParams(search);
    const mkeys = await fetch(process.env.REACT_APP_SERVER + '/scores?query=' + parameters.get('query')); // Hardcoded address
    const key2 = await mkeys.json();
    var roundedvals = [];
    key2.forEach(async (element) => {
      roundedvals.push(parseFloat(element).toFixed(2));
    })
    const twColl = collect(roundedvals);
    const twDup = twColl.countBy();
    const twFinal = twDup.all();
    const sorted = json.sort(twFinal, false);
    const sorted2 = json.sort(twFinal);
    var barPositive = [];
    var barNegative = [];
    var barLabels = [];
    var barData = [];
    for (const key in sorted2) {
      if (parseFloat(key) >= 0) {
        barPositive.push([key, twFinal[key]])
    }
  }
    for (const key in sorted) {
      if (parseFloat(key) < 0) {
        barNegative.push([key, twFinal[key]])
    }
  }
    barNegative.forEach(async (element) => {
      barLabels.push(element[0]);
      barData.push(element[1])
    })
    barPositive.forEach(async (element) => {
      barLabels.push(element[0]);
      barData.push(element[1])
    })
    const barMeta = {
      labels: barLabels,
      datasets: [
        {
          label: "Sentiment Scores",
          data: barData,
          backgroundColor: '#660000'
        }
      ]
    }


    this.setState({scores: key2, roundedscore: barMeta});
  }
}