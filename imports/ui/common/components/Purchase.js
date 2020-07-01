/* globals Billing */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import parseMarkdown from '../../helpers/markdown'

export default class Purchase extends Component {
  renderPrice (levelKey, index) {
    const purchase = Billing.createPurchase(this.props.user, this.props.product, levelKey, this.props.code)
    return (
      <span className="price">
        {purchase.undiscountedPrice ? <span className="strike">${purchase.undiscountedPrice}</span> : ''}
        ${purchase.price}
      </span>
    )
  }

  render () {
    const purchaseUrl = this.props.product.gumroadPurchaseUrl(this.props.level, this.props.user)
    const description = {
      __html: parseMarkdown(this.props.level.description)
    }

    return (
      <div className='prompt-option' key={this.props.index}>
        <h3>{this.props.level.name}</h3>
        <div className='prompt-contents' dangerouslySetInnerHTML={description}></div>
        <a href={purchaseUrl} target='_blank' rel='noreferrer' className='button simple-button' data-category='Click' data-action='{{code}} clicked' data-label='{{code}} clicked (upgrade page)'>
          {this.props.user ? 'Upgrade' : 'Buy'} ({this.renderPrice(this.props.level.key)})
        </a>
        <p className='prompt-more-info'><a href='https://www.discovermeteor.com/packages' target='_blank' rel='noreferrer'>More info…</a></p>
      </div>
    )
  }
}

Purchase.propTypes = {
  product: PropTypes.object.isRequired,
  level: PropTypes.object.isRequired,
  user: PropTypes.object, // if a user is provided, then we know this is an upgrade
  key: PropTypes.number,
  code: PropTypes.string
}
