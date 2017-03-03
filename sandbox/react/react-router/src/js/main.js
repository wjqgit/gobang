import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './pages/Layout'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Setting from './pages/Setting'

const app = document.getElementById('app');

ReactDOM.render( <Router history={hashHistory}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Gallery}></IndexRoute>
      <Route path="about(/:aspect)" component={About}></Route>
      <Route path="setting" component={Setting}></Route>
    </Route>
  </Router>, app);
