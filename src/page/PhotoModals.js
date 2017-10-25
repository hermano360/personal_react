import React from 'react'
import { Page, Panel, Button, Textarea, Table, TableHead, TableBody, TableRow, Select, eventBus, Modal } from 'react-blur-admin'
import { Row, Col, ClearFix } from 'react-grid-system'
import styles from './style.css'
import axios from 'axios'

export class PhotoModals extends React.Component {
  render () {
    const {type, title, photoUrl, open, toggleState} = this.props
    return (
      <Modal type={this.props.type} title={this.props.title} buttonText='OK'
        isOpen={open} onClose={toggleState}
        shouldCloseOnOverlayClick >
        {`Put this as a url ${photoUrl}`}
      </Modal>
    )
  }
}
