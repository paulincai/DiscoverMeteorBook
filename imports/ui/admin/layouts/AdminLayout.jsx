import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import Header from '../../common/components/Header'
import Layout from '../../common/layouts/Layout'
import Footer from '../../common/components/Footer'

export default class AdminLayout extends Component {
  render() {
    if (!Meteor.user()) { // user is not logged in
      return <Layout><p><a href={FlowRouter.path("loginPage")}>Please log in</a></p></Layout>
    } else if (!Meteor.user().isAdmin()) {

      return <Layout><p>Sorry, you don't have the rights to view this page.</p></Layout>

    } else {
    
      return (
        <div className="layout dashboard-layout">
          <Header />
          <div className="dashboard-container">
            <ul className="dashboard-nav">
              <li><a href={FlowRouter.path("adminUsersPage")}>Users</a></li>
              <li><a href={FlowRouter.path("adminPurchasesPage")}>Purchases</a></li>
            </ul>
            {this.props.children}
          </div>
          <Footer />
        </div>
      )
    }
  }
}
