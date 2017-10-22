import React from 'react';
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select, eventBus, Modal } from 'react-blur-admin';
// import { Row, Col, ClearFix } from 'react-grid-system';
// import styles from "./style.css";
import axios from 'axios'

export class Order extends React.Component {
  constructor() {
    super()
    this.state = {
      driverOptions : []
    }
    this.getDrivers = this.getDrivers.bind(this)
    this.getCustomerInfo = this.getCustomerInfo.bind(this)
  }

  getDrivers(order) {
    let {orderNumber, customerId, dispensaryID} = order
    const url = `api/v0/order/driver/?order_id=${orderNumber}&dispensary_id=${dispensaryID}&customer_id=${customerId}`
    axios.get(`https://demo1956799.mockable.io/${url}`)
    .then( (res) => {
      let driverOptions = res.data.availableDrivers.map((driver)=>{
        const label = `${driver.driverName} - ${driver.driverTime} min`
        return {value: driver.driverId, label}
      })
      this.setState({
        driverOptions
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  getCustomerInfo(){
    const { customerId, customerFirstName, customerLastName } = this.props.order
    this.props.getCustomerInfo(customerFirstName, customerLastName, customerId)
  }


  componentWillMount() {

  }


  render() {
    const {order} = this.props
    const strainOptions = order.strainOptions.map((strain)=>{
      return { value: strain, label: strain }
    })


    return (
      <TableRow key={order.orderNumber} style={{borderTop:'1px solid white'}}>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}} onClick={this.getCustomerInfo}>{order.orderNumber}</td>
        <td  style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
        <Button type='info' size='mm' title={'Oct 9th, 2017'} isIconHidden={true}/>
        </td>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
        <div>{order.customerFirstName} {order.customerLastName}<br/>
        {order.customerPhone}
        </div>
        </td>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
        {order.customerAddress}
        </td>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
        <Button type='add' size='mm' title={order.orderStatus} isIconHidden={true}/>
        </td>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
        {order.dispensaryName}<br/>
        {order.dispensaryPhone}
        </td>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
        <Select
          placeholder='Strain'
          isSearchable={true}
          options={strainOptions}
          onChange={(e)=>{console.log(e)}}
           />
        </td>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
        <Select
          placeholder='Driver'
          isSearchable={false}
          options={this.state.driverOptions}
          onToggleOpen={(e)=>{this.getDrivers(order)}}
          onChange={(e)=>{console.log(e)}}
           />
        </td>
        <td style={{textAlign:'center', lineHeight:'2rem', verticalAlign:'middle'}}>
          <Button type='success' size='mm' title='Update'
          isIconHidden={true}
          onClick={e => eventBus.addNotification('success', `Order ${order.orderNumber} Updated`)}/>
          <Button type='danger' size='mm' title='Cancel' isIconHidden={true}/>
        </td>
      </TableRow>
    )
  }
}
