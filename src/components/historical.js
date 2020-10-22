import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import Tweet from './ui_elements/tweet';
import collect from 'collect.js';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';

export class Historical extends Component {
state = {
    tweets: [],
    keys: [],
    tweetbody: [],
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
      if (this.state.tweetbody.length === 0) {
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

  async fetchTweets() {
    /*
    {this.state.keys.map((tweet) => (
                      <TweetHist tweet={tweet} />
                    ))}
                    */
    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    let search = window.location.search;
    let parameters = new URLSearchParams(search);
    const mkeys = await fetch('http://localhost:3405/historical?query=' + parameters.get('query')); // Hardcoded address
    const key2 = await mkeys.json();
    let tweetTXT = [];
    let tweetLST = [];
    let tweetSTORE = [];
    key2.forEach(async (element) => {
      tweetSTORE.push(JSON.parse(element));
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
    this.setState({tweets: tweetSTORE, tweetbody: finalTWT});
  }
}