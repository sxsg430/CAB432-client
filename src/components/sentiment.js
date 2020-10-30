import React, { Component } from 'react';
import {Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink, Spinner} from 'reactstrap';
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
    // Run the function to get tweets.
    this.getTweet();
  }

  render() {
    // Calculate random font size and angle for word map.
    const fontSizeMapper = word => Math.log2(word.value) * 5;
    const rotate = word => word.value % 360;
    // If no tweets in array, display loading animation.
    if (this.state.tweets.length === 0) {
      return (
        <div>
          <h2>Loading</h2>
          <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}/>
        </div>
      );
    } else {
      // Return main UI elements.
      // Includes Navbar, Average of sentiment values, total tweets grabbed, wordcloud of tweets, bar graph of sentiments
      // and the full list of tweets.
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
    let search = window.location.search;
    let parameters = new URLSearchParams(search); // Get params from the URL for later.
    let tweetTXT = [];
    let tweetSCORE = [];
    // Send request to the backend API for new tweets and save to variable.
    const resp = await fetch(process.env.REACT_APP_SERVER + '/twitter?query=' + parameters.get('query'));
    // Convert result to JSON and get tweet array from the body.
    const respdat = await resp.json();
    const resarr = await respdat.array;
    resarr.forEach(element => {
      // For each returned tweet, push their sentiment score to an array.
      tweetSCORE.push(element.score);
      // Split each tweet by space and push each word into an array.
      var splStr = element.text.split(' ');
      splStr.forEach(element2 => {
        tweetTXT.push(element2);
      })
    });
    const twColl = collect(tweetTXT); // Create a Collect object using the tweets.
    const twDup = twColl.countBy(); // Get frequency of words in the array, format: {word, frequency}
    let finalTWT = [];
    const twFinal = twDup.all(); // Get all results from frequency.
    for (const key in twFinal) {
      // For all frequencies, convert them to the structure needed by the wordcloud and push to array.
      let localJS = {text: key, value: twFinal[key]};
      finalTWT.push(localJS);
    }
    var roundedvals = [];
    tweetSCORE.forEach(async (element) => {
      // For each sentiment score, convert the string to float and round to two places.
      roundedvals.push(parseFloat(element).toFixed(2));
    });
    const sentColl = collect(roundedvals);
    const sentDump = sentColl.countBy(); // Get frequency of sentiment values.
    const sentFinal = sentDump.all();
    const sorted = json.sort(sentFinal, false); // Perform two JSON sorts on the final array
    const sorted2 = json.sort(sentFinal);       // One in acending and another decending
    var barPositive = []; // Variables for holding temp data for bar graph.
    var barNegative = [];
    var barLabels = [];
    var barData = [];

    // Two for loops required to put items in proper order.
    // This keeps data in the format (-0.5 ... 0 .. 0.5), instead of (-0.1 ... -0.5, 0 .. 0.5)
    for (const key in sorted2) {
      // For the ascending array, if the value is higher or equal to 0, push to the positive array.
      if (parseFloat(key) >= 0) {
        barPositive.push([key, sentFinal[key]])
    }
  }
    for (const key in sorted) {
      // For the descending array, if the value is less, push to the negative array.
      if (parseFloat(key) < 0) {
        barNegative.push([key, sentFinal[key]])
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
  // Push variables to state.
  this.setState({tweets: respdat.array, totalScore: respdat.totalScore, sentiment: respdat.sentiment, tweetbody: finalTWT, roundedscore: barMeta})
  }
}