import React from 'react';
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select, eventBus, Modal } from 'react-blur-admin';
import { Row, Col, ClearFix } from 'react-grid-system';
import styles from "./style.css";
import axios from 'axios'

export class OrderData extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }
  componentWillMount() {

  }


  render() {
    console.log(this.props)
    let { order, driverInformation } = this.props
    console.log(driverInformation)
    let {time: driverTime = '', name: driverName = '', value: driverId = ''} = driverInformation
    let orderIcon = chooseOrderIcon(order.orderStatus)

    return (
      <div style={{textAlign:'center', borderBottom:'1px white solid'}}>
      <h5><i className="fa fa-fw fa-truck"></i> Order {order.orderNumber} </h5>
        <h5> {order.orderStatus} - {order.orderStatus==='Delivery' && <Button size='sm' title={`${driverTime} min`} type="info" isIconHidden={true}/>}
        </h5>
      </div>
    );
  }
}

const chooseOrderIcon = (orderStatus) => {
  switch(orderStatus){
    case 'Requested':
      return 'fa-bell'
      break
    case 'Shipping':
      return 'fa-truck'
      break
    case 'Cancelled':
      return 'fa-ban-circle'
      break
  }
}
