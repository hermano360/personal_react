import React from 'react'
import { Page, Panel, Button, Input } from 'react-blur-admin'
import { Row, Col } from 'react-grid-system'
import styles from './style.css'
import axios from 'axios'
import { withRouter } from 'react-router'

class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      username: '',
      usernameStatus: null,
      password: '',
      passwordStatus: null
    }
    this.statusChange = this.statusChange.bind(this)
    this.login = this.login.bind(this)
  }

  login () {
    this.props.router.push('/dashboard')
    window.location.reload();
  }
  componentWillMount () {
  }

  statusChange (parameter, status) {
    this.setState(
      {
        [parameter]: status
      }
    )
  }

  render () {
    const {username, password} = this.state

    return (
      <div>
        <Page title='Welcome' >
          <Row>
            <Col style={{textAlign: 'center'}}>
              <Panel title='Login'>
                <Input
                  label='Username'
                  placeholder='User Name'
                  onChange={e => this.setState({username: e.target.value, usernameStatus: null, passwordStatus: null})}
                  value={this.state.username}
                  onValidate={e => this.state.usernameStatus}
            />
                <Input
                  label='Password'
                  type='password'
                  placeholder='Password'
                  onChange={e => this.setState({password: e.target.value, usernameStatus: null, passwordStatus: null})}
                  value={this.state.password}
                  onValidate={e => this.state.passwordStatus}
            />

                <Button type='info' size='md' title={'Submit'} isIconHidden
                  onClick={() => { submitPassword(username, password, this.statusChange, this.login) }}
            />
              </Panel>
            </Col>
          </Row>
        </Page>
      </div>
    )
  }
}

export default withRouter(Login)

const submitPassword = (username, password, statusChange, login) => {
  const url = `https://c08e5e98.ngrok.io/dashboard/auth/login/`
  console.log(username, password)
  axios.post(url, {
    username: username,
    passwrd: password })
    .then((res) => {
      localStorage.setItem('authToken', res.data.auth_token)
      login()
    })
    .catch(function (error) {
      statusChange('usernameStatus', false)
      statusChange('passwordStatus', false)
      statusChange('password', '')
      statusChange('username', '')
      console.log('error caught', error)
    })
}
