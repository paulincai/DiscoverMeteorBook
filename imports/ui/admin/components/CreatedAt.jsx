import React, { Component } from 'react'

export default class CreatedAt extends Component {
  render () {
    return (
      <span>{moment(this.props.rowData.createdAt).fromNow()}</span>
    )
  }
}
