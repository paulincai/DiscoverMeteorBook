import React, { Component } from 'react'
export default  class PurchaseId extends Component {
  render() {
    return (
      <a href={FlowRouter.path("adminPurchasePage", this.props.rowData)}>{this.props.rowData._id}</a>
    )
  }
}
