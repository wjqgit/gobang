import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './pages/Layout'
import Todos from './pages/Todos'
import Favorites from './pages/Favorites'
import Setting from './pages/Setting'

const app = document.getElementById('app');

ReactDOM.render( <Router history={hashHistory}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Todos}></IndexRoute>
      <Route path="favorites" component={Favorites}></Route>
      <Route path="setting" component={Setting}></Route>
    </Route>
  </Router>, app);
