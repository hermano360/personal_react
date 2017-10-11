import React from 'react';
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select } from 'react-blur-admin';
import { Row, Col, ClearFix } from 'react-grid-system';
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import StarRatingComponent from 'react-star-rating-component';
import styles from "./style.css";
import EventSource from 'react-eventsource'
import axios from 'axios'

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

const renderEvent = event => <div>{ event }</div>

export class Welcome extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedCustomer:"Herminio Garcia",
      selectedOrder:0,
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
            orderBuzzwords: [" citrus", "earthy", " citrus", "earthy", " citrus", "earthy"],
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
  }

  componentWillMount(){

//     var client = new Faye.Client('http://d1b65084.fanoutcdn.com/bayeux');
// client.subscribe('/test', function (data) {
//     $('#output').text(data);
// });


    axios.get('http://d1b65084.fanoutcdn.com/api/v0/events/?channel=customer_1').then((result) => { console.log('cwm',result)}).catch((err)=>{console.log('err', err)})
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
          <Button type={i%2==0 ? 'info' : 'add'} size='sm' title={buzzword} isIconHidden={true}/>
        )
      })
    }

    return (
      <Page title="Dashboard - Order Overview">
        <Row>
          <Col md={3}>
            <Panel title="Drivers, Dispensary Data">
              <h5><i className="fa fa-fw fa-truck"></i> Order 392 shipped <Button size='sm' title={'23 min'} type="info" isIconHidden={true}/></h5>
            </Panel>
          </Col>
          <Col md={9}>
            <Panel title='Customer Information'>
            <Row>
              <Col md={3} style={{textAlign:'center'}}>
              <img src="/assets/images/headshot.jpg" alt="Herminio Garcia" height="150" width="105"/>
              <h4>{selectedCustomer}</h4>
              <Button type='warning' size='mm' title='Customer Recs' isIconHidden={true} style={{background:'red'}}/>
              <Button type='info' size='mm' title='Customer ID' isIconHidden={true} style={{background:'red'}}/>

              </Col>
              <Col md={6}>
              <RadarChart cx={90} cy={80} outerRadius={50} width={200} height={150} data={data} >
                <PolarGrid  tick={false} />
                <PolarAngleAxis dataKey="subject"/>
                <PolarRadiusAxis domain={[0, 10]}  axisLine={false}/>
                <Radar name={selectedCustomer} dataKey="A" stroke="#98BEA6" fill="#98BEA6" fillOpacity={0.6} isAnimationActive={true}/>
              </RadarChart>
              </Col>
              <Col md={3}>
              <h2>Price Point</h2>
              <Button type='warning' size='sm' title={`Min: $${pricePoints[0]}`} isIconHidden={true}/>
              <Button type='danger' size='sm' title={`Max: $${pricePoints[1]}`} isIconHidden={true} style={{background:'red'}}/>
              </Col>

              <Col md={3}>
              <h2>Buzzwords</h2>
              {buzzwordsCustomer}
              </Col>

            </Row>
            <Row>
            <Panel>
              <div style={{maxHeight:'300px', overflowY:'scroll', border:'1px solid black', textAlign:'center'}}>
              <Table>
              {customerInfoTable(orders)}
              </Table>
              </div>
            </Panel>
            </Row>
            </Panel>
          </Col>
          <Col>
              <Table noTopBorder={false}>
              <TableHead>
              <td style={{textAlign:'center'}}>#</td>
              <td style={{textAlign:'center'}}>Order Date</td>
              <td style={{textAlign:'center'}}>Customer</td>
              <td style={{textAlign:'center'}}>Address</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Order Status</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Dispensary</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Strain</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Driver</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Status</td>
              </TableHead>
              <TableBody>
              <TableRow style={{borderTop:'1px solid white'}}>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>{6}</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>Oct 9th 2017</td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
              Mohib Hassan<br/>
              +16179828728
              </td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
              <div style={{margin:'10px auto 10px auto'}}>
              727 W 7th Street<br/>
              Los Angeles, California 90017 <br/>
              United States
              <br/>
              </div>
              </td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
                <Button type='add' size='mm' title='Requested' isIconHidden={true}/>
              </td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
              Herbarium <br/>
              747-543-7642
              </td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
                <Select
                  placeholder='Strain'
                  isSearchable={true}
                  options={[
                    { value: 1, label: 'One' },
                    { value: 2, label: 'Two' },
                    { value: 3, label: 'Three' },
                    { value: 4, label: 'Four' },
                    { value: 5, label: 'Five' },
                    { value: 6, label: 'Six' },
                  ]}
                   />
              </td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
              <Select
                placeholder='Driver'
                isSearchable={true}
                options={[
                  { value: 1, label: 'One' },
                  { value: 2, label: 'Two' },
                  { value: 3, label: 'Three' },
                  { value: 4, label: 'Four' },
                  { value: 5, label: 'Five' },
                  { value: 6, label: 'Six' },
                ]}
                 />
              </td>
              <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
                <Button type='success' size='m' title='Update' isIconHidden={true}/>
                <Button type='danger' size='m' title='Cancel' isIconHidden={true}/>
              </td>
              </TableRow>
              </TableBody>
              </Table>
          </Col>
        </Row>
      </Page>
    );
  }
}

const customerInfoTable = (orders) => {
  const monthNames= ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames= ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return orders.map((order, i) => {
    return (
      <TableRow noTopBorder={false}>
        <td style={{verticalAlign:'middle'}}>
          <a href={urlDatabase(order.strain)} target="_blank">
            <h4>{order.strain}</h4>
            <h5>{capitalizeWord(order.type)}</h5>
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
            <EventSource url="http://d1b65084.fanoutcdn.com/api/v0/events/?channel=customer_1">
              { events => {
                console.log('react')
                console.log(events) }}
            </EventSource>
        </td>
      <td>
      <Textarea
        name='textarea'
        value={order.feedback}/>
      </td>
    </TableRow>
    )
  })
}
