import { Meteor } from 'meteor/meteor'

const options = Meteor.isServer ? { connection: null } : {}
const Interviews = new Meteor.Collection('interviews', options)

export { Interviews }
