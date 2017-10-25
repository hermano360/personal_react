import React from 'react'
import { Router, Route, Redirect, browserHistory } from 'react-router'

import AppLayout from 'src/layout/app'
import  Login  from 'src/page/Login'

/* Demos */
import { Dashboard } from 'src/page/Dashboard'
/* End Demos */

// Redirect is got GH pages and can be deleted for forked projects
const redirectInitial = () => {
  let redirectURL = localStorage.getItem('authToken') == null ? '/login' : '/dashboard'
  return (
    <Redirect from='/' to={redirectURL} />
  )
}

const redirectLoggedIn = () => {
  return  localStorage.getItem('authToken') !== null ? <Redirect from='/login' to='/dashboard' /> : <div />
}

const redirectNotLoggedIn = () => {
  return localStorage.getItem('authToken') === null ? <Redirect from='/dashboard' to='/login' /> : <div/>
}

export const AppRouter = (
  <Router history={browserHistory}>
    <Route component={AppLayout}>
      {redirectInitial()}
      {redirectLoggedIn()}
      {redirectNotLoggedIn()}
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/login' component={Login} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>

)
