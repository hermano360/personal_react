import React from 'react'
import { Panel, Button, Textarea} from 'react-blur-admin'
import { Row, Col } from 'react-grid-system'
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts'
import StarRatingComponent from 'react-star-rating-component'
import styles from './style.css'
import { PhotoModals } from './PhotoModals'


export class UserProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      customerId: false,
      customerRec: false
    }
    this.openModal = this.openModal.bind(this)
  }

  openModal(modal) {
    this.setState({
      [modal]: true
    })
  }

  renderUserProfile (customers, selectedUser, feedback, selectedOrder) {
    if (selectedUser !== 0) {
      let customer = customers[selectedUser]
      let { IdPhotoLink, buzzwords, customerFirstName, customerLastName, pricePoints, recPhotoLink} = customer
      return (
        <Row>
          <Col md={4} lg={3} style={{textAlign: 'center'}}>
            {userInformation(selectedOrder, customerFirstName, customerLastName, this.openModal)}
          </Col>
          <Col lg={9} md={8} className="center" >
            <Col sm={6} md={12}lg={6} style={{marginTop: '20px'}}>
              <h2>Price Points</h2>
              <Button type='warning' size='xs' title={`Min: $${pricePoints[0].min}`} isIconHidden />
              <Button type='danger' size='xs' title={`Max: $${pricePoints[0].max}`} isIconHidden />
            </Col>
            <Col sm={6} md={12} lg={6} style={{marginTop: '20px'}}>
              <h2>Buzzwords</h2>
              {renderBuzzwords(buzzwords)}
            </Col>
          </Col>

          <Col lg={9} >
            <Panel>
              <div style={{maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden', border: '1px solid black', textAlign: 'center'}}>
                {customerInfoTable(feedback)}
              </div>
            </Panel>
          </Col>
        </Row>
      )
    } else {
      return <div />
    }
  }

  render () {
    const {customers, selectedUser, feedback, selectedOrder} = this.props
    if(selectedUser !== 0 ){
      const {customerFirstName, customerLastName} = customers[selectedUser]
    }
    const {customerRec, customerId} = this.state
    return (
      <Panel title='Customer Information'>
        <PhotoModals title={'Customer Rec'} type={'warning'}
          photoUrl={'Customer Rec Photo'} open={customerRec} toggleState={() => { this.setState({customerRec: false}) }} />
        <PhotoModals title={'Customer ID'} type={'info'}
          photoUrl={'Customer ID Photo'} open={customerId} toggleState={() => { this.setState({customerId: false}) }} />

        {this.renderUserProfile(customers, selectedUser, feedback, selectedOrder)}


      </Panel>
    )
  }
}




const userInformation = (selectedOrder, firstName, lastName, openModal) => {
  return (
    <div>
    <h4>{` Order ${selectedOrder}`}</h4>
    <img src='/assets/images/headshot.jpg' alt='Herminio Garcia' height='150' width='105' />
    <h4>{`${firstName} ${lastName}`}</h4>
    <Button type='warning'
      ize='mm' title='Customer Recs'
      isIconHidden onClick={() => openModal('customerRec') } />
    <Button type='info' size='mm' title='Customer ID' isIconHidden
      isIconHidden onClick={() => openModal('customerId') } />
    </div>
  )
}

const customerInfoTable = (feedback) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return feedback.map((order, i) => {
    const orderTimeFormatted = new Date(order.orderTime)
    return (
      <Row key={i} style={{borderBottom: '.5px solid white'}}>
        <Col sm={3}>
          <a href={order.strainUrl} target='_blank'>
            <h4>{order.strainName}</h4>
            <h5>{order.dispensaryName}</h5>
          </a>
        </Col>
        <Col sm={3}>
          <h3>{clockTime(orderTimeFormatted)}</h3>
          <h5>{`${dayNames[orderTimeFormatted.getDay()]} ${monthNames[orderTimeFormatted.getMonth()]} ${orderTimeFormatted.getDate()}`}</h5>
          <StarRatingComponent
            name='rate2'
            editing={false}
            starCount={5}
            value={order.totalRating / 2}
            />
        </Col>
        <Col sm={6} xs={12}>
          <Textarea
            name='textarea'
            value={order.feedback}
            onChange={() => {}}
            readOnly />
        </Col>
      </Row>
    )
  })
}

// Stateless components

const renderBuzzwords = (buzzwords) => {
  return buzzwords.map((buzzword) => {
    return <Button key={buzzword.word} type={buzzword.category === 'effect' ? 'info' : 'add'} size='xs' title={buzzword.word} isIconHidden />
  })
}

// Helper Functions

const capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const clockTime = (time) => {
  let hours = time.getHours() % 12 == 0 ? 12 : time.getHours() % 12
  let minutes = time.getMinutes()
  let dayPhase = time.getHours() >= 12 ? 'PM' : 'AM'
  return `${hours}:${minutes} ${dayPhase}`
}

// Radar with cannabis ratings for later

{/* <Col md={3}  style={{textAlign:'center'}}>
 <RadarChart cx={90} cy={80} outerRadius={50} width={200} height={150} data={data} style={{textAlign:'center'}}>
  <PolarGrid  tick={false} />
  <PolarAngleAxis dataKey="subject"/>
  <PolarRadiusAxis domain={[0, 10]}  axisLine={false}/>
  <Radar name={customer.customerFirstName} dataKey="A" stroke="#98BEA6" fill="#98BEA6" fillOpacity={0.6} isAnimationActive={true}/>
</RadarChart>
</Col> */}

// For when we actually start using web sockets

{/* <EventSource url="http://d1b65084.fanoutcdn.com/api/v0/events/?channel=customer_1">
    { events => {
      console.log('react')
      console.log(events) }}
  </EventSource> */}
