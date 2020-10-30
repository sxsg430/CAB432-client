import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import './index.css';
import { Sentiment } from './components/sentiment';
import { Home } from './components/home';
import {Historical} from './components/historical'
import {Scores } from './components/scores'
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');


ReactDOM.render(
    <BrowserRouter>
      <Route exact path='/' component={Home} />
      <Route path='/sentiment' component={Sentiment} />
      <Route path='/historical' component={Historical} />
      <Route path='/scores' component={Scores} />
    </BrowserRouter>,
    rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
