import React, { Component } from 'react';
import {Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
export class Home extends Component {
    state = {}

    componentDidMount() {

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
                
                <form action="/sentiment" method="get">
                    <label for="query">Query &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type='text' placeholder='Search Query' name='query' /> <br />
                    <label for="count">Count &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type='text' placeholder='Search Count' name='count' /> <br />
                    <input type="submit" value="Submit" />
                </form>
                </div>
        )
    }

}