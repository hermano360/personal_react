import React from 'react';
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select, eventBus, Modal } from 'react-blur-admin';
import { Row, Col, ClearFix } from 'react-grid-system';
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import StarRatingComponent from 'react-star-rating-component';
import styles from "./style.css";
import axios from 'axios'


const capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const clockTime = (time) => {
  let hours = time.getHours() % 12 == 0 ? 12 : time.getHours() % 12
  let minutes = time.getMinutes()
  let dayPhase = time.getHours() >= 12 ? 'PM' : 'AM'
  return `${hours}:${minutes} ${dayPhase}`
}

const customerInfoTable = (feedback) => {
  const monthNames= ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames= ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return feedback.map((order, i) => {
    const orderTimeFormatted = new Date(order.orderTime)
    return (
      <Row key={i} style={{borderBottom:'.5px solid white', textAlign:'center'}}>
        <Col sm={3}>
          <a href={order.strainUrl} target="_blank">
            <h4>{order.strainName}</h4>
            <h5>{order.dispensaryName}</h5>
          </a>
        </Col>
        <Col sm={3}>
          <h3>{clockTime(orderTimeFormatted)}</h3>
          <h5>{`${dayNames[orderTimeFormatted.getDay()]} ${monthNames[orderTimeFormatted.getMonth()]} ${orderTimeFormatted.getDate()}`}</h5>
          <StarRatingComponent
            name="rate2"
            editing={false}
            starCount={5}
            value={order.totalRating/2}
            />
            {/*<EventSource url="http://d1b65084.fanoutcdn.com/api/v0/events/?channel=customer_1">
              { events => {
                console.log('react')
                console.log(events) }}
            </EventSource>*/}
        </Col>
        <Col sm={6} xs={12}>
          <Textarea
            name='textarea'
            value={order.feedback}
            onChange={()=>{}}
            readOnly={true}/>
        </Col>
      </Row>
    )
  })
}


export class UserProfile extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }
  componentWillMount() {

  }
  renderUserProfile(customers, selectedUser, feedback, selectedOrder) {

    if(selectedUser !== 0) {
      let customer = customers[selectedUser]
      let { IdPhotoLink, buzzwords, customerFirstName, customerLastName, pricePoints, recPhotoLink} = customer
      // let {cannabisTypeScores, pricePoints, buzzwords} = customer
      // const data = [
      //     { subject: 'Hybrid', A: cannabisTypeScores[0]},
      //     { subject: 'Sativa Hybrid', A: cannabisTypeScores[1]},
      //     { subject: 'Sativa', A: cannabisTypeScores[2]},
      //     { subject: 'Indica', A: cannabisTypeScores[3]},
      //     { subject: 'Indica Hybrid', A: cannabisTypeScores[4]},
      // ];
      return (
        <Row>
          <Col md={4} lg={3}  style={{textAlign:'center'}}>
          <h4>{` Order ${selectedOrder}`}</h4>
            <img src="/assets/images/headshot.jpg" alt="Herminio Garcia" height="150" width="105"/>
            <h4>{`${customerFirstName} ${customerLastName}`}</h4>
            <Button type='warning'
            ize='mm' title='Customer Recs'
            isIconHidden={true} />
            <Button type='info' size='mm' title='Customer ID' isIconHidden={true}  />
          </Col>
          <Col  lg={9} md={8}  style={{textAlign:'center'}} >
            <Col sm={6} md={12}lg={6} style={{marginTop:'20px'}}>
              <h2>Price Points</h2>
              <Button type='warning' size='xs' title={`Min: $${pricePoints[0].min}`} isIconHidden={true}/>
              <Button type='danger' size='xs' title={`Max: $${pricePoints[0].max}`} isIconHidden={true}/>
            </Col>
            <Col sm={6} md={12} lg={6} style={{marginTop:'20px'}}>
              <h2>Buzzwords</h2>
              {this.renderBuzzwords(buzzwords)}
            </Col>
          </Col>

          <Col lg={9} >
          <Panel>
            <div style={{maxHeight:'300px', overflowY:'scroll', overflowX:'hidden', border:'1px solid black', textAlign:'center'}}>
            {customerInfoTable(feedback)}
            </div>
          </Panel>
          </Col>






          {/* <Col md={3}  style={{textAlign:'center'}}>
           <RadarChart cx={90} cy={80} outerRadius={50} width={200} height={150} data={data} style={{textAlign:'center'}}>
            <PolarGrid  tick={false} />
            <PolarAngleAxis dataKey="subject"/>
            <PolarRadiusAxis domain={[0, 10]}  axisLine={false}/>
            <Radar name={customer.customerFirstName} dataKey="A" stroke="#98BEA6" fill="#98BEA6" fillOpacity={0.6} isAnimationActive={true}/>
          </RadarChart>
          </Col> */}

        </Row>
      )
    } else {
      return <div></div>
    }

  }

  renderBuzzwords(buzzwords) {
    return buzzwords.map((buzzword) => {
      return <Button key={buzzword.word} type={buzzword.category === 'effect' ? 'info': 'add'} size='xs' title={buzzword.word} isIconHidden={true}></Button>
    })
  }
  render() {
    const {customers, selectedUser, feedback, selectedOrder} = this.props
    return (
      <Panel title='Customer Information'>
      {this.renderUserProfile(customers, selectedUser, feedback, selectedOrder)}
      </Panel>
    );
  }
}
