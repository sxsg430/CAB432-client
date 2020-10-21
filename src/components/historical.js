import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import TweetHist from './ui_elements/tweethist';

export class Historical extends Component {
state = {
    tweets: [],
    keys: [],
    totalScore: 0,
    sentiment: ""
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
      let result = this.fetchTweets();
      //this.setState({keys: result});
      //console.log(this.state.keys);
    
  }

  render() {
      if (this.state.keys.length === 0) {
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
                    <h1> { this.state.sentiment}</h1>
                    <h2> avrage score : { this.state.totalScore}</h2>
                    <h3> total tweets fetched : { this.state.tweets.length}</h3>
                  </Col>
                  <Col xs="7" sm="7">
                    {this.state.keys.map((tweet) => (
                      <TweetHist tweet={tweet} />
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
    const mkeys = await fetch('http://localhost:3405/historical?query=' + parameters.get('query')); // Hardcoded address
    const key2 = await mkeys.json();
    this.setState({keys: key2});
  }
}