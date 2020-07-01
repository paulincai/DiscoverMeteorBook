import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Griddle from 'griddle-react'
import CreatedAt from '../../admin/components/CreatedAt'

export default class UserPurchases extends Component {
  // mixins: [ReactMeteorData]
  
  getMeteorData() {

    Meteor.subscribe("userPurchases", this.props.userId);

    return {
      purchases: Purchases.find({userId: this.props.userId}).fetch()
    }
  }

  render() {
    const showTableHeading = _.isUndefined(this.props.showTableHeading) ? true : this.props.showTableHeading
    const columnMetadata = [
      {
        columnName: "createdAt",
        order: 1,
        displayName: "date",
        customComponent: CreatedAt
      },
      {
        columnName: "toLevelKey",
        order: 2,
        displayName: "level"
      },
      {
        columnName: "price",
        order: 3,
      }
    ];

    return (
      <Griddle
        tableClassName="table"
        results={this.data.purchases}
        columns={['createdAt', 'toLevelKey', 'price']}
        columnMetadata={columnMetadata}
        showPager={false}
        showTableHeading={showTableHeading}
      />
    )
  }
}

UserPurchases.propTypes = {
  userId: PropTypes.string.isRequired,
  showTableHeading: PropTypes.bool
}