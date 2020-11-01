import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink, Spinner, Alert} from 'reactstrap';
import collect from 'collect.js';
import json from 'json-keys-sort';
import { Bar } from '@reactchartjs/react-chart.js';

export class Scores extends Component {
state = {
    scores: [],
    roundedscore: [],
    totalScore: 0,
    scoreAVG: 0,
    sentiment: "",
    loading: true,
    status: "000"
  };

  componentDidMount() {
      // Run the function to get tweets.
      this.fetchTweets();
    
  }

  render() {
    // If page is still loading, show animation.
    if (this.state.loading) {
      return (
        <div>
          <h2>Loading</h2>
          <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}/>
        </div>
      );
    } else {
      // If a code other than 200 is returned, assume an error occured and show result.
      if (this.state.status !== 200) {
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
            <Alert color="warning">
              An error has occured. Either no results were returned, or the server returned an eror.
            </Alert>
          </div>
        )
      }
      // If loading is complete but no scores returned, show message box advising of no results.
      else if (this.state.scores.length === 0) {
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
            <Alert color="warning">
              No results were found.
            </Alert>
          </div>
        )
      } else {
        // Return main UI elements.
        // Includes Navbar, Average of sentiment values, total tweets grabbed, bar graph of sentiments
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
                  <Col xs="3" sm="3" />
                  <Col xs="6" sm="6">
                    <br />
                    <h2> Average Score: { this.state.scoreAVG}</h2>
                    <h3> Total Tweets Fetched: { this.state.scores.length}</h3>
                    <h4>Sentiment Graph</h4>
                    <Bar data={this.state.roundedscore} />
                  </Col>
                  <Col xs="5" sm="5" />
                </Row>
              </Container>
            </div>
          );
      }
    }
    
  }

  async fetchTweets() {;
    let search = window.location.search;
    let parameters = new URLSearchParams(search);  // Get params from the URL for later.
    // Send request to the backend API for new tweets and save to variable.
    const mkeys = await fetch(process.env.REACT_APP_SERVER + '/scores?query=' + parameters.get('query'));
    if (mkeys.status !== 200) {
      // Early check for non-200 error codes and force the function to end early. Fixes issues when the server returns a CORS error or doesn't return results.
      this.setState({loading: false, status: mkeys.status});
    }
    // Convert result to JSON for later use.
    const key2 = await mkeys.json();
    var roundedvals = [];
    var totals = 0;
    key2.forEach(async (element) => {
      // For each sentiment score, convert the string to float and round to two places.
      totals += parseFloat(element)
      roundedvals.push(parseFloat(element).toFixed(2));
    })
    const twColl = collect(roundedvals);
    const twDup = twColl.countBy(); // Get frequency of sentiment values.
    const twFinal = twDup.all();
    const sorted = json.sort(twFinal, false); // Perform two JSON sorts on the final array
    const sorted2 = json.sort(twFinal);       // One in acending and another decending
    var barPositive = []; // Variables for holding temp data for bar graph.
    var barNegative = [];
    var barLabels = [];
    var barData = [];

    // Two for loops required to put items in proper order.
    // This keeps data in the format (-0.5 ... 0 .. 0.5), instead of (-0.1 ... -0.5, 0 .. 0.5)
    for (const key in sorted2) {
      // For the ascending array, if the value is higher or equal to 0, push to the positive array.
      if (parseFloat(key) >= 0) {
        barPositive.push([key, twFinal[key]])
    }
  }
    for (const key in sorted) {
      // For the descending array, if the value is less, push to the negative array.
      if (parseFloat(key) < 0) {
        barNegative.push([key, twFinal[key]])
    }
  }

    // Get the data and frequency from both positive and negative arrays and push them to the bar graph arrays in order.
    barNegative.forEach(async (element) => {
      barLabels.push(element[0]);
      barData.push(element[1])
    })
    barPositive.forEach(async (element) => {
      barLabels.push(element[0]);
      barData.push(element[1])
    })

    // Construct JSON object for the bar graph, including labels and colours.
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
    var finalAVG = totals / key2.length;

    // Push variables to state.
    this.setState({scores: key2, roundedscore: barMeta, scoreAVG: finalAVG, loading: false, status: mkeys.status});
  }
}