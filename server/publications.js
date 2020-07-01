/* globals Counts */
import { Meteor } from 'meteor/meteor'
import { Sites } from '../imports/api/collections/sites'
import { Chapters } from '../imports/api/collections/chapters'
import { Products } from '../imports/api/collections/products'
import { Interviews } from '../imports/api/collections/interviews'
import { Videos } from '../imports/api/collections/videos'
import { Users } from '../imports/api/collections/users'
import { Purchases } from '../imports/api/collections/purchases'
import { Pages } from '../imports/api/collections/pages'
import { Errors } from '../imports/api/collections/errors'
import { Positions } from '../imports/api/collections/positions'

Meteor.publish('site', function (siteKey) {
  check(siteKey, String)
  const site = Sites.findOne({ key: siteKey })

  console.log('I have site: ', site)

  return [
    Sites.find({ key: siteKey }),
    site.products()
  ]
})

Meteor.publish('toc', function () {
  return Chapters.find({ published: { $ne: false } }, { sort: { number: 1 }, fields: { text: 0 } })
})

const accessibleLevelKeys = function (product, userId) {
  const user = Meteor.users.findOne(userId)
  if (typeof user === 'undefined') {
    return ['free']
  } else {
    return _.pluck(user.accessibleProductLevels(product), 'key')
  }
}

Meteor.publish('chapters', function (productKey) {
  check(productKey, String)
  const product = Products.findOne({ key: productKey })
  return Chapters.find({
    published: { $ne: false },
    level: { $in: accessibleLevelKeys(product, this.userId) }
  })
})

Meteor.publish('interviews', function (productKey) {
  check(productKey, String)
  const product = Products.findOne({ key: productKey })

  return Interviews.find({
    level: { $in: accessibleLevelKeys(product, this.userId) }
  })
})

Meteor.publish('videos', function (productKey) {
  check(productKey, String)
  const product = Products.findOne({ key: productKey })

  return Videos.find({
    level: { $in: accessibleLevelKeys(product, this.userId) }
  })
})

Meteor.publish('pages', function () {
  return Pages.find()
})

const USER_FIELDS = {
  emails: 1,
  productLevels: 1,
  billing: 1,
  profile: 1,
  createdAt: 1,
  admin: 1,
  'services.meteor-developer': 1
}

Meteor.publish('thisUser', function () {
  if (this.userId) {
    return [
      Meteor.users.find(this.userId, { fields: USER_FIELDS }),
      Purchases.find({ userId: this.userId })
    ]
  } else {
    return []
  }
})

Meteor.publish('userProfileData', function (userId) {
  // only makes other user's profiles available to admins

  if (this.userId && (this.userId === userId || Meteor.users.findOne(this.userId).isAdmin())) {
    return [
      Meteor.users.find({ _id: userId }),
      Purchases.find({ userId: userId })
    ]
  }
})

Meteor.publish('userPurchases', function (userId) {
  // only makes other user's purchases available to admins
  console.log('//userPurchases')
  console.log(userId)
  if (this.userId && (this.userId === userId || Meteor.users.findOne(this.userId).isAdmin())) {
    return [
      Purchases.find({ userId: userId })
    ]
  }
})

Meteor.publish('purchase', function (purchaseId) {
  if (this.userId && Meteor.users.findOne(this.userId).isAdmin()) {
    // only makes purchases available to admins
    const purchase = Purchases.findOne({ _id: purchaseId })
    return [
      Purchases.find({ _id: purchaseId }),
      Meteor.users.find({ _id: purchase.userId })
    ]
  }
})

Meteor.publish('errors', function () {
  if (this.userId && Meteor.users.findOne(this.userId).isAdmin()) {
    return Errors.find()
  }
})

Meteor.publish('position', function () {
  if (!this.userId) {
    return []
  }
  return Positions.find({ userId: this.userId })
})

// dashboard

Meteor.publish('adminUsers', function (query, options) {
  if (Users.isAdminById(this.userId)) {
    const users = Meteor.users.find(query, options)

    // console.log("// adminUsers")
    // console.log(query)
    // console.log(options)
    // console.log(query)
    // console.log("// found "+users.count(true)+" matching users \n")

    // can't reuse users cursor because of https://github.com/percolatestudio/publish-counts/issues/58
    Counts.publish(this, 'matching-users', Meteor.users.find(query, options))

    return users
  }
})

Meteor.publish('adminPurchases', function (query, options) {
  if (Users.isAdminById(this.userId)) {
    const purchases = Purchases.find(query, options)

    // can't reuse users cursor because of https://github.com/percolatestudio/publish-counts/issues/58
    Counts.publish(this, 'matching-purchases', Purchases.find(query, options))

    return purchases
  }
})

Meteor.publish('adminPurchase', function (purchaseId) {
  if (Users.isAdminById(this.userId)) {
    return Purchases.find({ _id: purchaseId })
  }
})
