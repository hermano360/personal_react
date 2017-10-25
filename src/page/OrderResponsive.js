import React from 'react'
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select, eventBus, Modal } from 'react-blur-admin'
import { Row, Col, ClearFix } from 'react-grid-system'
import styles from './style.css'
import axios from 'axios'

export class OrderResponsive extends React.Component {
  constructor () {
    super()
    this.state = {
      driverOptions: [],
      selectedDriver: null,
      selectedStrain: null
    }

    this.updateOrder = this.updateOrder.bind(this)
    this.cancelOrder = this.cancelOrder.bind(this)
  }
  componentWillMount () {

  }

  getDrivers (order) {
    let {orderNumber, userID, dispensaryID} = order
    const url = `api/v0/order/driver/?order_id=${orderNumber}&dispensary_id=${dispensaryID}&customer_id=${userID}`
    axios.get(`https://demo1956799.mockable.io/${url}`)
    .then((res) => {
      let driverOptions = res.data.availableDrivers.map((driver) => {
        const label = `${driver.driverName} - ${driver.driverTime} min`
        return {value: driver.driverId, label, time: driver.driverTime, name: driver.driverName}
      })
      this.setState({
        driverOptions
      })
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  updateOrder () {
    let {orderNumber, dispensaryID} = this.props.order
    if (this.state.selectedDriver && this.state.selectedStrain) {
      this.props.updateOrder('Delivery', this.state.selectedDriver.value, this.state.selectedStrain, orderNumber, dispensaryID)
    }
  }

  cancelOrder () {
    let {orderNumber, dispensaryID} = this.props.order
    this.props.updateOrder('Cancelled', this.state.selectedDriver, this.state.selectedStrain, orderNumber, dispensaryID)
  }

  render () {
    console.log(this.props)
    const {customerFirstName, customerLastName,
      customerPhone, dispensaryName, dispensaryPhone,
      orderDate, orderNumber, strainOptions, userID, orderStatus} = this.props.order
    const strainOptionsSelect = strainOptions.map((option) => { return {value: option, label: option} })

    let getCustomerInfo = () => {
      this.props.getCustomerInfo(userID, customerFirstName, customerLastName, orderNumber)
    }

    return (
      <Col md={12} style={{borderTop: '1px solid white', paddingTop: '15px', marginBottom: '15px'}}>
        <Row>
          <Col md={4} style={{textAlign: 'center', paddingBottom: '20px'}}>
            <Col xs={3} style={{textAlign: 'center'}}>
              <Button type='info' size='mm' title={`${orderNumber}`} isIconHidden onClick={getCustomerInfo} />
            </Col>
            <Col xs={3} sm={4} style={{textAlign: 'center', padding: '0'}}>
              <div style={{padding: '5px 3px', fontSize: '13px', textAlign: 'center', border: '1px solid white', borderRadius: '5px'}}>Oct 9th, 2017</div>
            </Col>
            <Col xs={5} sm={5} offset={{xs: 1, sm: 0}} style={{textAlign: 'center'}}>
              <div style={{textAlign: 'center'}}>
                <div>{customerFirstName} {customerLastName}</div>
                <div>{customerPhone}</div>
              </div>
            </Col>
          </Col>

          <Col md={2} sm={12} lg={3} style={{textAlign: 'center', paddingBottom: '20px'}} className='orderSmall'>
            <Col lg={6} md={12} xs={6} offset={{xs: 0, md: 0}}>
              <div style={{display: 'inline-block', border: '1px solid white', padding: '5px 13px', borderRadius: '5px'}}>
                {dispensaryName}<br />{dispensaryPhone}
              </div>
            </Col>
            <Col lg={6} md={12} xs={4} offset={{xs: 1, sm: 1, md: 0}} style={{textAlign: 'center'}}>
              <Button type='add' size='mm' title={orderStatus} isIconHidden />
            </Col>
          </Col>

          <Col md={3} lg={3} sm={6} xs={12} style={{textAlign: 'center', paddingBottom: '20px'}} className='orderSmall'>
            <Col xs={6} >
              <Select
                placeholder='Strain'
                isSearchable
                options={strainOptionsSelect}
                onChange={(e) => {
                  console.log(e)
                  this.setState({ selectedStrain: e})
                }}

                disabled={orderStatus !== 'Delivery'}
             />
            </Col>
            <Col xs={6}>
              <Select
                placeholder='Driver'
                isSearchable={false}
                options={this.state.driverOptions}
                onToggleOpen={(e) => { this.getDrivers(this.props.order) }}
                onChange={(e) => {
                  this.setState({ selectedDriver: this.state.driverOptions[e - 1]})
                }}
                disabled={orderStatus !== 'Delivery'}
             />
            </Col>
          </Col>

          {orderStatus !== 'Delivery' && <Col xs={12} sm={6} md={3} lg={2} style={{textAlign: 'center', paddingBottom: '20px'}} className='orderSmall'>
            <Col xs={3} lg={6} sm={6} offset={{xs: 2, sm: 0}} >
              <Button type='success' size='mm' title='Update'
                isIconHidden
                disabled={this.state.selectedDriver === null || this.state.selectedStrain === null}
                onClick={() => { this.updateOrder() }} />
            </Col>
            <Col xs={3} lg={6} sm={6} offset={{xs: 2, sm: 0}}>
              <Button type='danger' size='mm' title='Cancel' isIconHidden
                onClick={() => { this.cancelOrder() }} />
            </Col>
          </Col>
        }
          {orderStatus === 'Delivery' && <Col xs={12} sm={6} md={3} lg={2} style={{textAlign: 'center', paddingBottom: '20px'}} className='orderSmall'>
            <Col xs={6} >
              <Button type='success' size='mm' title='Out For Delivery' />
            </Col>
          </Col>
        }

        </Row>
      </Col>
    )
  }
}
