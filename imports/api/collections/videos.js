import { Meteor } from 'meteor/meteor'
import { videosContent } from '../../../server/content/videos'

const Videos = new Meteor.Collection('videos')

if (Meteor.isServer) {
  Meteor.startup(() => {
    Videos.remove({})
    videosContent.map(video => Videos.insert(video))
  })
}

export { Videos }
