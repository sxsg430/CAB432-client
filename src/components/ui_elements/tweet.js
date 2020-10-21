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