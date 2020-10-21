import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
import Tweet from './ui_elements/tweet';

export class Sentiment extends Component {
state = {
    tweets: [],
    totalScore: 0,
    sentiment: ""
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    let search = window.location.search;
    let parameters = new URLSearchParams(search);
    fetch('http://localhost:3405/twitter?query=' + parameters.get('query') + '&count=' + parameters.get('count')) // Hardcoded address
    .then(res => res.json())
    .then(res => this.setState({tweets: res.array, totalScore: res.totalScore, sentiment: res.sentiment}))
  }

  render() {
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