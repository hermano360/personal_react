import React from 'react'
import { Page, Panel } from 'react-blur-admin'
import { Row, Col} from 'react-grid-system'
import styles from './style.css'
// import EventSource from 'react-eventsource'
import axios from 'axios'
import { OrderResponsive } from './OrderResponsive'
import { UserProfile } from './UserProfile'
import { OrderData } from './OrderData'

// For when we eventually do web sockets
// const renderEvent = event => <div>{ event }</div>

export class Dashboard extends React.Component {
  constructor () {
    super()
    this.state = {
      orders: [],
      customers: {},
      selectedUser: 0,
      selectedOrder: 0,
      token: `Token ${localStorage.getItem('authToken')}`,
      orderStatuses: [],
      feedbackEntries: [],
      driverInformation: {}
    }

    this.getCustomerInfo = this.getCustomerInfo.bind(this)
    this.updateOrder = this.updateOrder.bind(this)
    this.getUpdatedOrders = this.getUpdatedOrders.bind(this)
    this.updateStateFromAPI = this.updateStateFromAPI.bind(this)
  }


  updateStateFromAPI(parameter, value){
    this.setState({
      [parameter]: value
    })
  }

  getCustomerInfo (userID, customerFirstName, customerLastName, orderNumber) {
    const preferencesUrl = `/dashboard/customer_preferences/${userID}/`
    const feedbackUrl = `/dashboard/customer_feedback/${userID}/`
    axios.all([
      axios.get(`https://demo1956799.mockable.io${preferencesUrl}`),
      axios({
        url: `http://127.0.0.1:8000/dashboard/customer_feedback/1/`,
        method: 'get',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }})
      ])
      .then(axios.spread((preferences, feedbackEntries)=>{
        this.setState({
          customers:{
            ...this.state.customers,
            [userID]: {
              ...preferences.data,
              customerFirstName,
              customerLastName
            }
          },
          selectedUser: userID,
          selectedOrder: orderNumber,
          feedbackEntries:feedbackEntries.data.feedbackEntries

        })
      }))
      .catch(error=>console.log(error))
  }

  updateOrder (order_status, driverID, strainName, orderID, dispensaryID) {
    if (driverID === null) driverID = 0
    if (strainName === null) strainName = 'strain'
    let authorization = localStorage.getItem('authToken')
    axios({
      url: `http://127.0.0.1:8000/dashboard/update_order/`,
      method: 'put',
      headers: {
        'Authorization': `Token ${authorization}`,
        'Content-Type': 'application/json'
      },
      data: {
        orderID,
        driverID,
        dispensaryID,
        strainName: 'strain 1',
        order_status
      }
    }).then(res => {
      this.getUpdatedOrders()
    }).catch(err => console.log(err))
  }

  getUpdatedOrders () {
    let authorization = localStorage.getItem('authToken')
    axios.get('http://127.0.0.1:8000/dashboard/payload/', {
      headers:
      {
        'Authorization': `Token ${authorization}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        this.setState({
          orders: response.data.orders,
          toke: authorization
        })
      })
      .catch((error) => {
        this.setState({
          orders: []
        })
      })
  }

  componentDidMount () {
    this.getUpdatedOrders()
  }

  render () {
    const {selectedOrder, orders, customers, feedbackEntries, selectedUser, driverInformation} = this.state
    const token = localStorage.getItem('authToken')

    return (
       <Page title='Dashboard - Order Overview' token={token} >
        <Row>
          <Col md={3}>
            {renderOrderData(orders, driverInformation, token)}
          </Col>
          <Col md={9}>
            <UserProfile customers={customers} feedback={feedbackEntries} selectedUser={selectedUser} selectedOrder={selectedOrder} />
          </Col>
          {renderOrderHeads(token)}
          {renderOrdersResponsive(orders, this.updateOrder, this.getCustomerInfo, token)}
        </Row>
      </Page>
    )

  }
}

// Rendering stateless components

const renderOrderData = (orders, driverInformation,token) => {
  console.log(orders, driverInformation,typeof token)

  const individualOrders = () => {
    return orders.map((order, i) => {
      return (
        <OrderData key={order.orderNumber} order={order} driverInformation={driverInformation} token={token} />
      )
    })
  }
  return (
    <Panel title='Orders'>
      {individualOrders()}
    </Panel>
  )
}

const renderOrderHeads = () => {
  return (
    <div>
      <Col md={12} className='removeSmall'>
        <Row>
          <Col md={4}>
            <Col xs={3} lg={3} style={{textAlign: 'center'}}>
              #
              </Col>
            <Col sm={4} xs={3} style={{textAlign: 'center'}}>
              Date
              </Col>
            <Col xs={5} style={{textAlign: 'center'}}>
              Customer
              </Col>
          </Col>
          <Col md={2} lg={3} style={{textAlign: 'center'}}>
            <Col lg={6}>
              Dispensary
              </Col>
            <Col lg={6}>
              Order_Status
              </Col>
          </Col>
          <Col md={3} lg={3} style={{textAlign: 'center'}}>
            <Col xs={6}>
              Strain
              </Col>
            <Col xs={6}>
              Driver
              </Col>
          </Col>
          <Col md={3} lg={2} style={{textAlign: 'center'}}>
              Update Status
            </Col>
        </Row>
      </Col>
      <Col>
        <h2 className='addSmall' style={{textAlign: 'center'}}>
        Order Information
        </h2>
      </Col>
    </div>
  )
}

const renderOrdersResponsive = (orders, updateOrder, getCustomerInfo, token) => {
  let orderedOrders = organizeOrders(orders)
  return orderedOrders.map((order, i) => {
    return (
      <OrderResponsive key={i} order={order} updateOrder={updateOrder} getCustomerInfo={getCustomerInfo} token={token}/>
    )
  })
}

// Helper functions

// organizes orders in numerical order

const organizeOrders = (orders) => {
  let newOrders = orders.map((order) => { return order })
  for (let i = 1; i < newOrders.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (newOrders[j].orderNumber > newOrders[j + 1].orderNumber) {
        let temp = newOrders[j]
        newOrders[j] = newOrders[j + 1]
        newOrders[j + 1] = temp
      }
    }
  }
  return newOrders
}

// API Calls


// This is meant for the web socket we will eventually implement

{ /* <EventSource url="http://d1b65084.fanoutcdn.com/api/v0/events/?channel=customer_1">
    { events => {
      console.log('react')
      console.log(events) }}
</EventSource> */ }
