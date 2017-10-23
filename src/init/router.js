import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import AppLayout from 'src/layout/app';
import {Login} from 'src/page/Login.js';

/* Demos */
import { Welcome } from 'src/page/welcome';
/* End Demos */


// Redirect is got GH pages and can be deleted for forked projects
const redirect = () =>  {
  console.log(localStorage.getItem('authToken') === null)
  let redirectURL = localStorage.getItem('authToken') == null ? '/login' : '/dashboard'
  console.log(redirectURL)
  return (
    <Redirect from="/" to={redirectURL} />
  )
}

export const AppRouter = (
  <Router history={browserHistory}>
    <Route path='/login' component={Login}/>
    <Route  component={AppLayout}>
    {redirect()}
    <Route path='/dashboard' component={Welcome} />
    <Route path='/login' component={Login} />
    <Redirect from="*" to='/' />
    </Route>
  </Router>

);
