import React from 'react';
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow } from 'react-blur-admin';
import { Row, Col } from 'react-grid-system';
// import { GMap } from 'src/layout/components/gmap';
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import StarRatingComponent from 'react-star-rating-component';

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
        "orders": [
          {
            orderTime:1507430040000,
            strain: "Orange Crush",
            type: 'sativa',
            rating: 3,
            high: "head",
            harshness: "smooth",
            feedback: "Orange Crush is known for its dank earthy scent and citrus flavor.",
            orderBuzzwords: [" citrus", "earthy", " citrus", "earthy", " citrus", "earthy"]
          },
          {
            orderTime:1507170420000,
            strain: "Maui Wowie",
            type:'indica',
            rating: 4,
            high: "body",
            harshness: "harsh",
            feedback: "Lightweight sativa effects allow your mind to drift away to creative escapes, while Maui Wowie’s motivating, active effects may be all you need to get outside and enjoy the sun.",
            orderBuzzwords: ["earthy", " citrus", "earthy", " citrus", "earthy"]
          },
          {
            orderTime:1506800040000,
            strain: "Panama Red",
            type:'indica',
            rating: 2,
            high: "head",
            harshness: "harsh",
            feedback: "Panama Red is a Sativa strain that first gained popularity back in the 1960s and was widely loved up through the nineties. ",
            orderBuzzwords: [" citrus", "earthy", " citrus", "earthy", " citrus", "earthy"]
          },
          {
            orderTime:1505468040000,
            strain: "Malawi Gold",
            type:'sativa',
            rating: 5,
            high: "body",
            harshness: "harsh",
            feedback: "Southern African nation Malawi is one of the most prolific grower of cannabis in its region.",
            orderBuzzwords: ["earthy", " citrus", "earthy"]
          },
          {
            orderTime:1505045880000,
            strain: "Jesus OG",
            type: 'hybrid',
            rating: 4,
            high: "body",
            harshness: "smooth",
            feedback: "Call it blasphemous, but Jesus OG is one hybrid with the unique ability to elevate both body and mind. ",
            orderBuzzwords: ["earthy", " citrus", "earthy", " citrus", "earthy", " citrus", "earthy"]
          },
        ]
      }}

    }
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
    const monthNames= ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
    const orderNumbers = orders.map((order,i) => {
      return (
        <TableRow>
          <td>
          <Button
          type={selectedOrder === i ? 'warning' : 'info'}
          size='sm'
          title={`${monthNames[new Date(order.orderTime).getMonth()]} ${new Date(order.orderTime).getDate()}`}
          isIconHidden={true}
          onClick={()=>{this.setState({selectedOrder: i})}}></Button></td>
        </TableRow>
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
              <Button size='sm' title={'order'} body={'hello'} isIconHidden={true}>Hello</Button>
            </Panel>
          </Col>
          <Col md={9}>
            <Panel title='Customer Information'>
            <Row>
              <Col md={3} style={{textAlign:'center'}}>
              <img src="/assets/images/headshot.jpg" alt="Herminio Garcia" height="150" width="105"/>
              <h4>{selectedCustomer}</h4>
              </Col>
              <Col md={6}>
              <RadarChart cx={130} cy={130} outerRadius={100} width={300} height={250} data={data} >
                <PolarGrid  tick={false} />
                <PolarAngleAxis dataKey="subject"/>
                <PolarRadiusAxis domain={[0, 10]} tickCount={10} axisLine={false}/>
                <Radar name={selectedCustomer} dataKey="A" stroke="#98BEA6" fill="#98BEA6" fillOpacity={0.6} isAnimationActive={true}/>
              </RadarChart>
              </Col>
              <Col md={3}>
              <h2>Price Point</h2>
              <Button type='info' size='sm' title={`Min: $${pricePoints[0]}`} isIconHidden={true}/>
              <Button type='add' size='sm' title={`Max: $${pricePoints[1]}`} isIconHidden={true}/>
              </Col>

              <Col md={3}>
              <h2>Buzzwords</h2>
              {buzzwordsCustomer}
              </Col>

            </Row>
            <Row>

            <Panel>
              <Col md={2} style={{textAlign:'center'}}>
              <h3>Orders</h3>
              <div style={{maxHeight:'150px', overflowY: 'scroll'}}>
              <Table >
                <TableBody>
                  {orderNumbers}
                </TableBody>
              </Table>
              </div>
              </Col>
              <Col md={4} style={{textAlign:'center'}}>
              <h3>Details</h3>
              <Panel>
              <h4>{orders[selectedOrder].strain}</h4>
              <h5>{`${orders[selectedOrder].type.charAt(0).toUpperCase()}${orders[selectedOrder].type.slice(1)}`}</h5>
              <StarRatingComponent
                name="rate2"
                editing={false}
                starCount={5}
                value={orders[selectedOrder].rating}
                />
              <h4>{clockTime()}</h4>
              <Button type='info' size='sm' title={orders[selectedOrder].high} isIconHidden={true}></Button>
              <Button type='add' size='sm' title={orders[selectedOrder].harshness} isIconHidden={true}></Button>
              </Panel>
              </Col>
              <Col md={6} style={{textAlign:'center'}}>
              <h3>Feedback</h3>
                <br/>
                <Textarea
                  name='textarea'
                  value={orders[selectedOrder].feedback}/>
                  {customerBuzzwords()}
              </Col>
            </Panel>
            </Row>

            </Panel>
          </Col>
        </Row>

        <h2>More Panels</h2>
        <Row>
          <Col >
            <Panel>
              This is a paragraph. This is a paragraph. This is a paragraph. This is a paragraph.
            </Panel>
          </Col>
          <Col >
            <Panel title='Yellow paragraph'>
              <div className='yellow-text'>
                This is a paragraph
              </div>
            </Panel>
          </Col>
          <Col >
            <Panel title='Blue paragraph'>
              <div className='blue-text'>
                This is a paragraph
              </div>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col >
            <Panel title='Google Map Component'>

            </Panel>
          </Col>
        </Row>
      </Page>
    );
  }
}
