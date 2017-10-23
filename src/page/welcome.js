import React from 'react';
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select, Modal } from 'react-blur-admin';
import { Row, Col, ClearFix } from 'react-grid-system';
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import StarRatingComponent from 'react-star-rating-component';
import styles from "./style.css";
import EventSource from 'react-eventsource'
import axios from 'axios'
import { Order } from './Order'
import { OrderResponsive } from './OrderResponsive'
import { UserProfile } from './UserProfile'
import { OrderStatus } from './OrderStatus'
import { OrderData } from './OrderData'
require('./cookie.js')

const urlDatabase = (strain) => {
  switch (strain) {
    case 'Orange Crush':
      return 'https://www.leafly.com/hybrid/orange-crush'
    case 'Maui Wowie':
      return 'https://www.leafly.com/sativa/maui-wowie'
    case 'Panama Red':
      return 'https://www.leafly.com/sativa/panama-red'
    case 'Malawi':
      return 'https://www.leafly.com/sativa/malawi'
    case 'Jesus OG':
      return 'https://www.leafly.com/sativa/jesus-og'
    default:
      return ''
  }
}

const clockTime = (time) => {
  let hours = time.getHours() % 12 == 0 ? 12 : time.getHours() % 12
  let minutes = time.getMinutes()
  let dayPhase = time.getHours() >= 12 ? 'PM' : 'AM'
  return `${hours}:${minutes} ${dayPhase}`
}
const capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
const orderBuzzwords = (order) => {
    return order.orderBuzzwords.map((buzzword,i) => {
      return (
        <Button type={ i % 2 ==0 ? 'info' : 'add' } size='xs' title={buzzword} isIconHidden={true}/>
      )
    })
}

const organizeOrders = (orders) => {
  let newOrders = orders.map((order)=>{return order})
  for(let i = 1; i < newOrders.length; i++){
    for(let j= i - 1; j >= 0; j--){
      if(newOrders[j].orderNumber > newOrders[j+1].orderNumber){
        let temp = newOrders[j]
        newOrders[j] = newOrders[j+1]
        newOrders[j+1] = temp
      }
    }
  }
  return newOrders
}



const renderEvent = event => <div>{ event }</div>



export class Welcome extends React.Component {
  constructor() {
    super()
    this.state = {
      orders: [],
      customers: {},
      selectedUser:0,
      selectedOrder:0,
      token:`Token ${localStorage.getItem('authToken')}`,
      orderStatuses:[],
      feedbackEntries:[],
      customerRecOpen: false,
      customerIdOpen: false,
      driverInformation:{}

    }
    this.customerModals = this.customerModals.bind(this)
    this.getCustomerInfo = this.getCustomerInfo.bind(this)
    this.renderOrderData = this.renderOrderData.bind(this)
    this.updateOrder = this.updateOrder.bind(this)
    this.cancelOrder = this.cancelOrder.bind(this)
    this.getUpdatedOrders = this.getUpdatedOrders.bind(this)
  }

  renderOrders(orders) {
    return orders.map((order,i)=> {
      return (
        <Order key={i} order={order} getCustomerInfo={this.getCustomerInfo}/>
      )
    })
  }

  renderOrdersResponsive(orders) {
    let orderedOrders = organizeOrders(orders)
    return orderedOrders.map((order,i)=> {
      return (
        <OrderResponsive key={i} order={order} updateOrder={this.updateOrder} getCustomerInfo={this.getCustomerInfo}/>
      )
    })
  }

  getCustomerInfo(userID, customerFirstName, customerLastName, orderNumber) {
    console.log(userID)
    const preferencesUrl = `/dashboard/customer_preferences/${userID}/`
    axios.get(`https://demo1956799.mockable.io${preferencesUrl}`)
      .then( (res) => {
        this.setState({
          customers: {
            ...this.state.customers,
            [userID] : {
              ...res.data,
              customerFirstName,
              customerLastName
            }
          },
          selectedUser: userID,
          selectedOrder: orderNumber
        })
      })
      .catch(error => {
        console.log(error);
      });
      const feedbackUrl = `/dashboard/customer_feedback/${userID}/`
      console.log(`Token ${localStorage.getItem('authToken')}`)
    axios({
      url:`http://127.0.0.1:8000/dashboard/customer_feedback/1/`,
      method:'get',
      headers: {
      'Authorization' : `Token ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    }}).then(res=>{
      let {feedbackEntries} = res.data
      this.setState({feedbackEntries})
    }).catch(err=>console.log(err))

  }

  renderOrderData(){
    const { orders, driverInformation } = this.state

    return orders.map((order,i)=> {
      return (
        <OrderData key={order.orderNumber} order={order} driverInformation={driverInformation}/>
      )
    })
  }

  updateOrder(order_status, driverID, strainName, orderID, dispensaryID){
    if(driverID===null) driverID = 0
    if(strainName===null) strainName = "strain"
    axios({
      url:`http://127.0.0.1:8000/dashboard/update_order/`,
      method:'put',
      headers: {
      'Authorization' : `Token ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    data: {
      orderID,
      driverID,
      dispensaryID,
      strainName:'strain 1',
      order_status
    }
    }).then(res=>{
      console.log(res.status)
      this.getUpdatedOrders()
    }).catch(err=>console.log(err))
  }

  cancelOrder(driverInformation, strainName, orderID, dispensaryID){
    let driverID = driverInformation.value
    axios({
      url:`http://127.0.0.1:8000/dashboard/update_order/`,
      method:'put',
      headers: {
      'Authorization' : `Token ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    data: {
      orderID,
      driverID,
      dispensaryID,
      strainName:'strain 1',
      order_status: 'Cancelled'
    }
    }).then(res=>{
      this.getUpdatedOrders()
    }).catch(err=>console.log(err))
    this.setState({driverInformation})
  }

  customerModals() {
    return (
    <div>
    <Modal type='warning' title='Customer Rec' buttonText='OK'
    isOpen={this.state.customerRecOpen} onClose={() => { this.setState({customerRecOpen: false})}}
    shouldCloseOnOverlayClick={true}>
      <Row>
        <Col>
          Customer Rec Photo
        </Col>
      </Row>
    </Modal>
    <Modal type='info' title='Customer Rec' buttonText='OK'
    isOpen={this.state.customerIdOpen} onClose={() => { this.setState({customerIdOpen: false})}}
    shouldCloseOnOverlayClick={true}>
      <Row>
        <Col>
          Customer ID
        </Col>
      </Row>
    </Modal>
    </div>
    )
  }

  getUpdatedOrders(){
    axios.get('http://127.0.0.1:8000/dashboard/payload/', {
      headers:
      {
        "Authorization" : `Token ${localStorage.getItem('authToken')}`,
        "Content-Type": "application/json"
      }
    })
      .then( (response) => {
        this.setState({
          orders: response.data.orders
        })
      })
      .catch((error) => {
        this.setState({
          orders: []
        })
      });
  }

  componentWillMount() {
    this.getUpdatedOrders()
  }

  render() {
    const {selectedOrder} = this.state
    const clockTime = () => {
      let hours = individualOrderTime.getHours() % 12 == 0 ? 12 : individualOrderTime.getHours() % 12
      let minutes = individualOrderTime.getMinutes()
      let dayPhase = individualOrderTime.getHours() >= 12 ? 'PM' : 'AM'
      return `${hours}:${minutes} ${dayPhase}`
    }
    const customerBuzzwords = () => {
      return orders[selectedOrder].orderBuzzwords.map((buzzword,i) => {
        return (
          <Button key={i} type={i%2==0 ? 'info' : 'add'} size='sm' title={buzzword} isIconHidden={true}/>
        )
      })
    }

    return (
      <Page title="Dashboard - Order Overview" >
      {this.customerModals()}
        <Row>
          <Col md={3}>
            <Panel title="Orders">
            {this.renderOrderData()}
            </Panel>
          </Col>
          <Col md={9}>
            <UserProfile customers={this.state.customers} feedback={this.state.feedbackEntries} selectedUser={this.state.selectedUser} selectedOrder={selectedOrder}/>
          </Col>


          <Col>
              <Table noTopBorder={false} style={{display:'none'}}>
              <TableHead>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>#</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Order Date</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Customer</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Address</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Order Status</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Dispensary</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Strain</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Driver</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Status</td>
              </TableHead>
              <TableBody>
                {this.renderOrders(this.state.orders)}
              </TableBody>
              </Table>
          </Col>
            <Col md={12} className="removeSmall">
              <Row>
                <Col md={4}>
                  <Col xs={3} lg={3} style={{textAlign:'center'}}>
                  #
                  </Col>
                  <Col  sm={4} xs={3} style={{textAlign:'center'}}>
                  Date
                  </Col>
                  <Col  xs={5} style={{textAlign:'center'}}>
                  Customer
                  </Col>
                </Col>
                <Col md={2} lg={3} style={{textAlign:'center'}}>
                  <Col lg={6}>
                  Dispensary
                  </Col>
                  <Col lg={6}>
                  Order_Status
                  </Col>
                </Col>
                <Col md={3} lg={3} style={{textAlign:'center'}}>
                  <Col xs={6}>
                  Strain
                  </Col>
                  <Col xs={6}>
                  Driver
                  </Col>
                </Col>
                <Col md={3} lg={2} style={{textAlign:'center'}}>
                  Update Status
                </Col>
              </Row>
            </Col>
            <Col>
            <h2 className="addSmall" style={{textAlign:'center'}}>
            Order Information
            </h2>

            </Col>

          {this.renderOrdersResponsive(this.state.orders)}
        </Row>
      </Page>
    );
  }
}

const customerInfoTable = (orders) => {
  const monthNames= ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames= ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return orders.map((order, i) => {
    let orderColor = 'white'
    switch (order.type){
      case 'sativa':
        orderColor = 'green'
        break
      case 'indica':
        orderColor = 'purple'
        break
      case 'hybrid':
        orderColor = 'red'
        break
      }
    return (
      <TableRow noTopBorder={false}>
        <td style={{verticalAlign:'middle'}}>
          <a href={urlDatabase(order.strain)} target="_blank">
            <h4>{order.strain}</h4>
            <h5 style={{color : orderColor}}>{capitalizeWord(order.type)}</h5>
            <h5>{order.dispensary}</h5>
          </a>
        </td>
        <td>
          <h3>{clockTime(new Date(order.orderTime))}</h3>
          <h5>{`${dayNames[new Date(order.orderTime).getDay()]} ${monthNames[new Date(order.orderTime).getMonth()]} ${new Date(order.orderTime).getDate()}`}</h5>
          <StarRatingComponent
            name="rate2"
            editing={false}
            starCount={5}
            value={order.rating}
            />
            {/*<EventSource url="http://d1b65084.fanoutcdn.com/api/v0/events/?channel=customer_1">
              { events => {
                console.log('react')
                console.log(events) }}
            </EventSource>*/}
        </td>
      <td>
      <Textarea
        name='textarea'
        value={order.feedback}
        onChange={()=>{}}
        readOnly={true}/>
      </td>
    </TableRow>
    )
  })
}
