import React from 'react';
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select, eventBus, Modal } from 'react-blur-admin';
import { Row, Col, ClearFix } from 'react-grid-system';
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import StarRatingComponent from 'react-star-rating-component';
import styles from "./style.css";
import EventSource from 'react-eventsource'
import axios from 'axios'
import { Order } from './Order.js'
import { OrderResponsive } from './OrderResponsive.js'
import { UserProfile } from './UserProfile.js'
import { OrderStatus } from './OrderStatus.js'
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
      selectedCustomer:"Herminio Garcia",
      selectedOrder:0,
      token:`Token ${localStorage.getItem('authToken')}`,
      orderStatuses:[],
      customerRecOpen: false,
      customerIdOpen: false,
      "customerInformation":{
      "Herminio Garcia": {
        "categoryScores":[5,6,3,2,9], //Hybrid, Sativa Hybrid, Sativa, Indica, Indica Hybrid
        "pricePoints":[45, 65],
        "buzzwords": ["citrus", "earthy", " citrus", "earthy", " citrus", "earthy", " citrus", "earthy"],
        "imageSrc": "/assets/images/headshot.jpg",
        "name": "Herminio Garcia",
        "phone": '+17655436533',
        "orders": [
          {
            orderTime:1507430040000,
            strain: "Orange Crush",
            type: 'sativa',
            rating: 3,
            high: "head",
            harshness: "smooth",
            feedback: "Orange Crush is known for its dank earthy scent and citrus flavor.",
            orderBuzzwords: ["citrus", "earthy", " citrus", "earthy", " citrus", "earthy"],
            dispensary: "Hollywood High Grade"
          },
          {
            orderTime:1507170420000,
            strain: "Maui Wowie",
            type:'indica',
            rating: 4,
            high: "body",
            harshness: "harsh",
            feedback: "Lightweight sativa effects allow your mind to drift away to creative escapes, while Maui Wowie’s motivating, active effects may be all you need to get outside and enjoy the sun.",
            orderBuzzwords: ["earthy", " citrus", "earthy", " citrus", "earthy"],
            dispensary: "La Brea Compassionate Caregivers"
          },
          {
            orderTime:1506800040000,
            strain: "Panama Red",
            type:'indica',
            rating: 2,
            high: "head",
            harshness: "harsh",
            feedback: "Panama Red is a Sativa strain that first gained popularity back in the 1960s and was widely loved up through the nineties. ",
            orderBuzzwords: [" citrus", "earthy", " citrus", "earthy", " citrus", "earthy"],
            dispensary: 'The Green Easy'
          },
          {
            orderTime:1505468040000,
            strain: "Malawi",
            type:'sativa',
            rating: 5,
            high: "body",
            harshness: "harsh",
            feedback: "Southern African nation Malawi is one of the most prolific grower of cannabis in its region.",
            orderBuzzwords: ["earthy", " citrus", "earthy"],
            dispensary: "La Brea Compassionate Caregivers"
          },
          {
            orderTime:1505045880000,
            strain: "Jesus OG",
            type: 'hybrid',
            rating: 4,
            high: "body",
            harshness: "smooth",
            feedback: "Call it blasphemous, but Jesus OG is one hybrid with the unique ability to elevate both body and mind. ",
            orderBuzzwords: ["earthy", " citrus", "earthy", " citrus", "earthy", " citrus", "earthy"],
            dispensary: "Herbarium"
          },
        ]
      }}

    }
    this.customerModals = this.customerModals.bind(this)
    this.getCustomerInfo = this.getCustomerInfo.bind(this)
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
        <OrderResponsive key={i} order={order} getCustomerInfo={this.getCustomerInfo}/>
      )
    })
  }

  getCustomerInfo(userID, customerFirstName, customerLastName) {
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
          selectedUser: userID
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
      console.log(res.data)
    }).catch(err=>console.log(err))

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

  componentWillMount() {
    // let csrftoken = Cookies.get('csrftoken');
    // function csrfSafeMethod(method) {
    //   // these HTTP methods do not require CSRF protection
    //   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    // }
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
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const {customerInformation, selectedOrder, selectedCustomer} = this.state
    const {categoryScores, pricePoints, orders, imageSrc, buzzwords} = customerInformation[selectedCustomer]
    const data = [
        { subject: 'Hybrid', A: categoryScores[0]},
        { subject: 'Sativa Hybrid', A: categoryScores[1]},
        { subject: 'Sativa', A: categoryScores[2]},
        { subject: 'Indica', A: categoryScores[3]},
        { subject: 'Indica Hybrid', A: categoryScores[4]},
    ];
    const buzzwordsCustomer = buzzwords.map((buzzword, i) => {
      return (
        <Button type={i % 2 ==0 ? 'info': 'add'} size='sm' title={buzzword} isIconHidden={true}></Button>
      )
    })

    const individualOrderTime = new Date(orders[selectedOrder].orderTime)
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
            <Panel title="Drivers, Dispensary Data">
              <h5><i className="fa fa-fw fa-truck"></i> Order 392 shipped <Button size='sm' title={'23 min'} type="info" isIconHidden={true}/></h5>
            </Panel>
          </Col>
          <Col md={9}>
            <UserProfile customers={this.state.customers} selectedUser={this.state.selectedUser}/>
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
