import SimpleSchema from 'simpl-schema'
const Codes = new Mongo.Collection('codes')

Codes.Schema = new SimpleSchema({
  siteKey: String,
  key: String,
  discount: Number
})

export { Codes }
