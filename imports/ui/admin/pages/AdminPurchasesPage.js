import React, { Component } from 'react'
import PurchaseId from '../components/PurchaseId'
import { Purchases } from '../../../api/collections/purchases'
import CreatedAt from '../components/CreatedAt'
import AdminLayout from '../layouts/AdminLayout'
import MeteorGriddle from '../components/MeteorGriddle'

export default class AdminPurchasesPage extends Component {
  render () {
    const columns = ['createdAt', '_id', 'email', 'productKey', 'price', 'toLevelKey']
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
        customComponent: PurchaseId
      },
      {
        columnName: 'email',
        order: 3
      },
      {
        columnName: 'productKey',
        order: 4
      },
      {
        columnName: 'price',
        order: 5
      },
      {
        columnName: 'toLevelKey',
        order: 6
      }
    ]

    return (
      <AdminLayout>
        <MeteorGriddle
          publication='adminPurchases'
          collection={Purchases}
          matchingResultsCount='matching-purchases'
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
