const options = Meteor.isServer ? { connection: null } : {}
const Chapters = new Meteor.Collection('chapters', options)
export { Chapters }
