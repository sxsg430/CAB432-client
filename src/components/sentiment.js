import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import Tweet from './ui_elements/tweet';
import collect from 'collect.js';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import json from 'json-keys-sort';
import { Bar } from '@reactchartjs/react-chart.js';

export class Sentiment extends Component {
state = {
    tweets: [],
    tweetbody: [],
    totalScore: 0,
    roundedscore: [],
    sentiment: ""
  };

  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.getTweet();
  }

  render() {
    const fontSizeMapper = word => Math.log2(word.value) * 5;
    const rotate = word => word.value % 360;
    if (this.state.tweets.length === 0) {
      return (
        <p>Loading</p>
      );
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
                <h2> Average Score: { this.state.totalScore}</h2>
                <h3> Total Tweets Fetched: { this.state.tweets.length}</h3>
                <h4>Word Cloud</h4>
                <WordCloud
                  data={this.state.tweetbody}
                  fontSizeMapper={fontSizeMapper}
                  rotate={rotate}
                />
                <h4>Sentiment Graph</h4>
                  <Bar data={this.state.roundedscore} />
              </Col>
              <Col xs="7" sm="7">
                {this.state.tweets.map((tweet) => (
                  <Tweet tweet={tweet} />
                ))}
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
    
  }

  async getTweet() {
    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    let search = window.location.search;
    let parameters = new URLSearchParams(search);
    let tweetTXT = [];
    let tweetSCORE = [];
    const resp = await fetch(process.env.REACT_APP_SERVER + '/twitter?query=' + parameters.get('query') + '&count=' + parameters.get('count')); // Hardcoded address
    const respdat = await resp.json();
    const resarr = await respdat.array;
    resarr.forEach(element => {
      tweetSCORE.push(element.score);
      var splStr = element.text.split(' ');
      splStr.forEach(element2 => {
        tweetTXT.push(element2);
      })
    });
    const twColl = collect(tweetTXT);
    const twDup = twColl.countBy();
    let finalTWT = [];
    const twFinal = twDup.all();
    for (const key in twFinal) {
      let localJS = {text: key, value: twFinal[key]};
      finalTWT.push(localJS);
    }
    var roundedvals = [];
    tweetSCORE.forEach(async (element) => {
      roundedvals.push(parseFloat(element).toFixed(2));
    });
    const sentColl = collect(roundedvals);
    const sentDump = sentColl.countBy();
    const sentFinal = sentDump.all();
    const sorted = json.sort(sentFinal, false);
    const sorted2 = json.sort(sentFinal);
    var barPositive = [];
    var barNegative = [];
    var barLabels = [];
    var barData = [];
    for (const key in sorted2) {
      if (parseFloat(key) >= 0) {
        barPositive.push([key, sentFinal[key]])
    }
  }
    for (const key in sorted) {
      if (parseFloat(key) < 0) {
        barNegative.push([key, sentFinal[key]])
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
  


    this.setState({tweets: respdat.array, totalScore: respdat.totalScore, sentiment: respdat.sentiment, tweetbody: finalTWT, roundedscore: barMeta})
  }
}