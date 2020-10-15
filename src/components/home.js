import React, { Component } from 'react';

export class Home extends Component {
    state = {}

    componentDidMount() {

    }

    render() {

        return (
            <main>
                <form action="/sentiment" method="get">
                    <label for="query">Query &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type='text' placeholder='Search Query' name='query' /> <br />
                    <label for="count">Count &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type='text' placeholder='Search Count' name='count' /> <br />
                    <input type="submit" value="Submit" />
                </form>
            </main>
        )
    }

}