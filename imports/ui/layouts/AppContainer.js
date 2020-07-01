import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import App from './App'

SITE_KEY = 'dm'
BOOK_KEY = 'dmBook'

export default createContainer(() => {
  const handles = [
    Meteor.subscribe('site', SITE_KEY),
    Meteor.subscribe('toc'),
    Meteor.subscribe('chapters', BOOK_KEY),
    Meteor.subscribe('interviews', BOOK_KEY),
    Meteor.subscribe('videos', BOOK_KEY),
    Meteor.subscribe('thisUser'),
    Meteor.subscribe('pages')
  ]

  console.log(handles.map(handle => handle.ready()))

  return {
    user: Meteor.user(),
    ready: _.every(handles, handle => { return handle.ready() })
  }
}, App)
