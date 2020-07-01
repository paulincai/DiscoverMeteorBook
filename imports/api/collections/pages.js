import { Meteor } from 'meteor/meteor'

const Pages = new Meteor.Collection('pages')

if (Meteor.isServer) {
  Pages.remove({})
}

export { Pages }
