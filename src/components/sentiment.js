import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import Tweet from './ui_elements/tweet';
import collect from 'collect.js';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';

export class Sentiment extends Component {
state = {
    tweets: [],
    tweetbody: [],
    totalScore: 0,
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
    const resp = await fetch('http://localhost:3405/twitter?query=' + parameters.get('query') + '&count=' + parameters.get('count')); // Hardcoded address
    const respdat = await resp.json();
    const resarr = await respdat.array;
    resarr.forEach(element => {
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
    this.setState({tweets: respdat.array, totalScore: respdat.totalScore, sentiment: respdat.sentiment, tweetbody: finalTWT})
    //console.log(this.state.tweetbody);
  }
}