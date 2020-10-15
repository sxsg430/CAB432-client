import React, { Component } from 'react';

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


    /* this.callBackendAPI()
      .then(res => this.setState({ tweets: res.array,totalScore: res.totalScore , sentiment: res.sentiment}))
        
      .catch(err => console.log(err)); */
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  /* callBackendAPI = async () => {
    
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  }; */

  render() {
    return (
      <div className="App">
        <h1> { this.state.sentiment}</h1>
        <h2> avrage score : { this.state.totalScore}</h2>
        <h3> total tweets fetched : { this.state.tweets.length}</h3>
       {this.state.tweets.map(tweet => (
         <div>
         
           <div> {tweet.text}</div>
           <div> {tweet.score}</div>
          
         </div>

       ))}
      </div>
    );
  }
}