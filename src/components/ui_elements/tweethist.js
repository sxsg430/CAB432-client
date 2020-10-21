import React, { Component } from 'react';
import {Card, CardSubtitle, CardText, CardBody, CardTitle} from 'reactstrap';

export class TweetHist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tweet: {}
        };
    }

    componentDidMount() {
        this.fetchTweets();
    }

    render() {
        return (
            <div>
                <Card>
                    <CardTitle><h5>{this.state.tweet.date}</h5></CardTitle>
                    <CardBody>
                        <CardText><h6>Sentiment: {this.state.tweet.score}</h6><br />{this.state.tweet.text}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
        
    }

    async fetchTweets() {
        let getUrl = window.location;
        let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
        let search = window.location.search;
        let parameters = new URLSearchParams(search);
        const mkeys = await fetch('http://localhost:3405/historicaltweet?key=' + this.props.tweet); // Hardcoded address
        const key2 = await mkeys.json();
        this.setState({tweet: JSON.parse(key2)});
      }


}
export default TweetHist;