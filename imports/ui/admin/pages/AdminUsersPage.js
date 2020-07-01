import React, { Component } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import CreatedAt from '../components/CreatedAt'
import UserPurchases from '../../users/containers/UserPurchases'
import { MeteorGriddle } from '../components/MeteorGriddle'

class UserId extends Component {
  render () {
    return (
      <a href={FlowRouter.path('profilePage', this.props.rowData)}>{this.props.rowData._id}</a>
    )
  }
}

class Username extends Component {
  render () {
    const user = Meteor.users._transform(this.props.rowData)
    return <span>{user.getUsername()}</span>
  }
}

class Enrolled extends Component {
  render () {
    const user = Meteor.users._transform(this.props.rowData)
    if (user.enrollMethod() === 'pending') {
      return <a href={user.finishSignupUrl()}>Pending</a>
    } else {
      return <span>{user.enrollMethod()}</span>
    }
  }
}

class AdminUserPurchases extends Component {
  render () {
    return <UserPurchases userId={this.props.rowData._id} showTableHeading={false}/>
  }
}

export default class AdminUsersPage extends Component {
  render () {
    const columns = ['createdAt', '_id', 'email', 'username', 'enrolled', 'purchases'];
    const columnMetadata = [
      {
        columnName: 'createdAt',
        order: 1,
        displayName: 'date',
        customComponent: CreatedAt
      },
      {
        columnName: '_id',
        order: 2,
        customComponent: UserId
      },
      {
        columnName: 'username',
        order: 3,
        customComponent: Username
      },
      {
        columnName: 'email',
        order: 4,
      },        
      {
        columnName: 'enrolled',
        order: 5,
        customComponent: Enrolled
      },
      {
        columnName: 'purchases',
        order: 6,
        customComponent: AdminUserPurchases
      }
    ]

    return (
      <AdminLayout>
        <MeteorGriddle
          publication='adminUsers'
          collection={Meteor.users}
          matchingResultsCount='matching-users'
          filteredFields={['email', 'username', 'emails.address', 'services.meteor-developer.username']}
          externalResultsPerPage={10}
          columns={columns}
          columnMetadata={columnMetadata}
          showFilter={true}
          useExternal={true}
          externalSortColumn='createdAt'
          externalSortAscending={false}
        />
      </AdminLayout>
    )
  }
}
