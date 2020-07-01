import Handlebars from 'meteor/blaze'
import parseMarkdown from './markdown'

Handlebars.registerHelper('highlightWithMarkdown', function (text) {
  if (text) {
    return new Handlebars.SafeString(parseMarkdown(text))
  }
})
