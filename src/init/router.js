import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import AppLayout from 'src/layout/app';
import Login from 'src/page/Login.js';

/* Demos */
import { Welcome } from 'src/page/welcome';
import { About } from 'src/page/about';
import { ProgressBars } from 'src/page/progress-bars';
import { TableDemo } from 'src/page/table-demo';
import { ButtonDemo } from 'src/page/button-demo';
import { ModalDemo } from 'src/page/modal-demo';
import { TabsDemo } from 'src/page/tabs-demo';
import { InputDemo } from 'src/page/input-demo';
import { NotificationsDemo } from 'src/page/notifications-demo';
/* End Demos */

import { NotFound } from 'src/page/not-found';

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
    <Route path='/about' component={About} />
    <Route path='/progress-bars' component={ProgressBars} />
    <Route path='/button-demo' component={ButtonDemo} />
    <Route path='/modal-demo' component={ModalDemo} />
    <Route path='/login' component={Login} />
    <Route path='/table-demo' component={TableDemo} />
    <Route path='/tabs-demo' component={TabsDemo} />
    <Route path='/input-demo' component={InputDemo} />
    <Route path='/notifications-demo' component={NotificationsDemo} />
    <Route path="*" component={NotFound}/>
    </Route>
  </Router>

);
