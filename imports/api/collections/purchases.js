/* globals Billing, mixpanel */

import SimpleSchema from 'simpl-schema'
import { subscribeUser } from '../../../server/newsletter'
import { trackEvent } from '../../../lib/analytics'
import { Products } from './products'

const Purchases = new Mongo.Collection('purchases')

Purchases.Schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  email: { type: String, optional: true },
  productKey: { type: String },
  codeKey: { type: String, optional: true },
  fromLevelKey: { type: String, optional: true },
  toLevelKey: { type: String },
  price: { type: Number },
  undiscountedPrice: { type: Number, optional: true },
  createdAt: { type: Date },
  stripeCharge: { type: Object, blackbox: true, optional: true },
  gumroadCharge: { type: Object, blackbox: true, optional: true }
})

Meteor.methods({
  'Purchases.mutate.insertFromKeys': function (email, productKey, levelKey) {
    check(email, String)
    check(productKey, String)
    check(levelKey, String)

    const user = Meteor.user()
    if (!user || !user.isAdmin()) {
      throw new Meteor.Error('forbidden', "You can't do that!")
    }
    return Purchases.mutate.insertFromKeys(email, productKey, levelKey)
  }
})

Purchases.mutate = {
  insertFromKeys: function (email, productKey, levelKey) {
    // FIXME: we need to scope this by site too..
    const product = Products.findOne({ key: productKey })
    const user = Meteor.users.findOneByEmail(email)
    const purchase = Billing.createPurchase(user, product, levelKey)
    console.log(purchase)
    return Purchases.mutate.insert(purchase)
  },

  insert: function (purchase) {
    purchase.createdAt = new Date()

    check(purchase, Purchases.Schema)
    const user = Meteor.users.findOne(purchase.userId)

    if (!user) {
      throw new Meteor.Error('no-user', "Can't find a user with that id")
    }

    const purchaseId = Purchases.insert(purchase)

    // Update the user that they've bought the product
    const updated = Meteor.users.update({
      _id: user._id,
      'productLevels.productKey': purchase.productKey
    }, { $set: { 'productLevels.$.levelKey': purchase.toLevelKey } })

    if (updated === 0) {
      Meteor.users.update(user._id, {
        $push: {
          productLevels: {
            productKey: purchase.productKey,
            levelKey: purchase.toLevelKey
          }
        }
      })
    }

    // subscribe user to MailChimp mailing list, or update their group
    subscribeUser(user, purchase.productKey, purchase.toLevelKey)

    // add distinct_id to purchase for Mixpanel
    purchase.distinct_id = purchaseId

    if (purchase.manualUpgrade) {
      const s1 = purchase.productKey + ' ' + purchase.toLevelKey + ' manually upgraded'
      trackEvent('Manual Upgrade', s1, s1, 0, purchase) // undefined function
    } else {
      const priceInUsd = parseInt(purchase.price) / 100
      const s2 = purchase.productKey + ' ' + purchase.toLevelKey + ' purchased'
      trackEvent('Purchase', s2, s2, priceInUsd, purchase) // undefined function
      mixpanel.people.track_charge(purchase.userId, priceInUsd)
    }

    return purchaseId
  }
}

export { Purchases }
