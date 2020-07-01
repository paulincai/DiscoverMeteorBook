import SimpleSchema from 'simpl-schema'
import { Utils } from '../../../lib/utils'
import { Purchases } from './purchases'
import { getGumroadCode } from '../../../lib/helpers'

const Products = new Mongo.Collection('products')

Products.Schema = new SimpleSchema({
  siteKey: String,
  key: String,
  name: String,
  levels: { type: Array },
  'levels.$': { type: Object, blackbox: true },
  'levels.$.key': String,
  'levels.$.name': String,
  'levels.$.description': String,
  'levels.$.price': { type: Number },
  'levels.$.disabled': { type: Boolean, optional: true }
})

Products.helpers({
  purchases: Utils.cursor(function (query, where) {
    where.productKey = this.key
    return Purchases.find(query, where)
  }),

  highestLevel: function () {
    return this.levels[this.levels.length - 1]
  },

  // TODO: Should this code be moved to billings and tested?
  levelIndex: function (levelKey) {
    // basically _.findIndex (which doesn't seem to exist in this version)
    let i = 0
    let result = -1
    _.find(this.levels, function (l) {
      const match = (l.key === levelKey)
      if (!match) {
        i += 1
      } else {
        result = i
      }
      return match
    })
    return result
  },

  // empty if levelKey doesn't exist
  levelsUpTo: function (levelKey) {
    const index = this.levelIndex(levelKey)
    return this.levels.slice(0, index + 1)
  },

  gumroadPurchaseUrl: function(level, user, code) {

    const product = this
    const userLevel = user ? user.productLevel(product).key : 'free'
    const gumroadCode = getGumroadCode(userLevel, level.key)
    let url = 'https://gumroad.com/a/460731507/' + gumroadCode

    if (user) {
      url += '?email=' + user.getEmail()
    }
    return url
  }
})

Products.mutate = {
  insert: function (doc) {
    // TODO check on this validation
    // check(doc, Products.Schema)
    return Products.insert(doc)
  },

  remove: function (id) {
    return Products.remove(id)
  }
}
export { Products }
