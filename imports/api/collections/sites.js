import SimpleSchema from 'simpl-schema'
import { Utils } from '../../../lib/utils'
import { Products } from './products'
import { Codes } from './codes'

const Sites = new Meteor.Collection('sites')

Sites.Schema = new SimpleSchema({
  hostname: { type: String, regEx: SimpleSchema.RegEx.Domain },
  key: { type: String }
})

Sites.helpers({
  products: Utils.cursor(function (query, options) {
    const site = this
    query.siteKey = site.key
    return Products.find(query, options)
  }),
  codes: Utils.cursor(function (query, options) {
    query.siteKey = this.siteKey
    return Codes.find(query, options)
  })
})

Sites.mutate = {
  insert: function (doc) {
    check(doc, Sites.Schema)
    return Sites.insert(doc)
  },

  remove: function (id) {
    const site = Sites.findOne(id)
    site.products().forEach(function (p) {
      Products.mutate.remove(p._id)
    })

    site.codes().forEach(function (o) {
      Codes.mutate.remove(o._id)
    })

    return Sites.remove(id)
  }
}

export { Sites }
