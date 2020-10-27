import React, { Component, PropTypes } from 'react';
import { withRouter } from "react-router-dom";
import { createBrowserHistory } from 'history';
import {Navbar, NavbarBrand, Nav, NavItem, NavLink, Input, Container, Row, Col, ButtonGroup, Button} from 'reactstrap';
export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
        }
    }

    componentDidMount() {

    }

    handleSearchUpdate = (value) => {
        this.setState({query: value.target.value})
    }

    getNewTweets = () => {
        this.props.history.push("/sentiment?query=" + this.state.query)
    }

    getHistSentiment = () => {
        this.props.history.push("/scores?query=" + this.state.query)
    }

    getHistTweets = () => {
        this.props.history.push("/historical?query=" + this.state.query)
    }

    render() {

        return (
                <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/">Twitter Search</NavbarBrand>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="/">Search</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <br />
                <Container fluid>
                    <Row>
                        <Col xs="3" sm="3"></Col>
                        <Col xs="6" sm="6">
                            <Input type="text" placeholder="Search Query" id="search01" name="Search" value={this.state.query} onChange={this.handleSearchUpdate} ></Input><br />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4" sm="4"></Col>
                        <Col>
                            <ButtonGroup>
                                <Button color="primary" onClick={this.getNewTweets}>Get New Tweets</Button>
                                <Button color="primary" onClick={this.getHistSentiment}>View Historical Sentiment</Button>
                                <Button color="primary" onClick={this.getHistTweets}>View Historical Tweets</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Container>
                </div>
        )
    }

}
export default withRouter(Home)