import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import Tweet from './ui_elements/tweet';
import collect from 'collect.js';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';

export class Scores extends Component {
state = {
    tweets: [],
    tweetbody: [],
    scores: [],
    totalScore: 0,
    sentiment: ""
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
      this.fetchTweets();
      //this.setState({keys: result});
      //console.log(this.state.keys);
    
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
                  <h3> Total Tweets Fetched: { this.state.tweets.length}</h3>
                  <h4>Word Cloud</h4>
                 
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

  async fetchTweets() {
    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    let search = window.location.search;
    let parameters = new URLSearchParams(search);
    const mkeys = await fetch('http://localhost:3405/scores?query=' + parameters.get('query')); // Hardcoded address
    const key2 = await mkeys.json();
    console.log(key2);
    this.setState({scores: key2});
    /*let tweetTXT = [];
    let tweetSTORE = [];
    let tweetSCORE = [];
    key2.forEach(async (element) => {
      tweetSTORE.push(JSON.parse(element));
      tweetSCORE.push(JSON.parse(element).score);
      const twString = JSON.parse(element).text.split(" ");
      twString.forEach(element2 => {
        tweetTXT.push(element2);
      })
    })
    const twColl = collect(tweetTXT);
    const twDup = twColl.countBy();
    let finalTWT = [];
    const twFinal = twDup.all();
    for (const key in twFinal) {
      let localJS = {text: key, value: twFinal[key]};
      finalTWT.push(localJS);
    }
    
    const sentimentSUM = tweetSCORE.reduce((a, b) => a + b, 0);
    const sentimentAVG = (sentimentSUM / tweetSCORE.length) || 0;

    this.setState({tweets: tweetSTORE, tweetbody: finalTWT, scores: tweetSCORE, totalScore: sentimentAVG});*/
  }
}