import React, { Component } from 'react';
import {Card, CardSubtitle, CardText, CardBody, CardTitle} from 'reactstrap';

export class Tweet extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        // Basic Reactstrap card to hold tweet data. Takes in a tweet JSON object from the props and converts it into a card for display.
        // Uses the Tweet's post date, sentiment score and text body.
        return (
            <div>
                <Card>
                    <CardTitle><h5>{this.props.tweet.date}</h5></CardTitle>
                    <CardBody>
                        <CardText><h6>Sentiment: {this.props.tweet.score}</h6><br />{this.props.tweet.text}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
        
    }


}
export default Tweet;