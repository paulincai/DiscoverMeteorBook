import { Errors } from '../imports/api/collections/errors'
import { Chapters } from '../imports/api/collections/chapters'

const s3Url = 'https://s3.amazonaws.com/discovermeteor/photos/large/'

const slugify = text => {
  return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
}

const ownsDocument = (userId, doc) => {
  return doc && doc.userId === userId
}

const sum = (a, b) => {
  return a + b
}

const logError = (error, type) => {
  console.log('Error! \n', error.message)
  error.type = type
  Errors.insert(error)
}

const Helpers = {}

Helpers.prevChapter = currentChapter => {
  return Chapters.findOne({ number: { $lt: currentChapter.number } }, { sort: { number: -1 } })
}

Helpers.nextChapter = currentChapter => {
  return Chapters.findOne({ number: { $gt: currentChapter.number } }, { sort: { number: 1 } })
}

Helpers.getPrevChapter = (currentChapter, chapters) => {
  const chapterPosition = _.indexOf(_.pluck(chapters, 'slug'), currentChapter.slug)
  return chapters[chapterPosition - 1]
}

Helpers.getNextChapter = (currentChapter, chapters) => {
  const chapterPosition = _.indexOf(_.pluck(chapters, 'slug'), currentChapter.slug)
  return chapters[chapterPosition + 1]
}

const loadFonts = () => {
  // Google Webfont Loader
  if (typeof WebFontConfig === 'undefined') {
  /* eslint no-undef:0 */
    WebFontConfig = {
      typekit: { id: 'rcr2ohz' }
    };
    (function () {
      var wf = document.createElement('script');
      wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
      wf.type = 'text/javascript'
      wf.async = 'true'
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(wf, s)
    })()
  }
}

// copied from oauth/oauth_client.js -- return the secret without removing it
const _retrieveCredentialSecret = token => {
  const secret = OAuth._retrieveCredentialSecret(token)
  OAuth._handleCredentialSecret(token, secret)
  return secret
}

const getGumroadCode = (currentLevel, targetLevel) => {
  if (currentLevel === 'free' || currentLevel === 'starter') {
    if (targetLevel === 'book') return 'eDzA'
    if (targetLevel === 'full') return 'ZjlD'
    if (targetLevel === 'premium') return 'OwKC'
  }
  if (currentLevel === 'book') {
    if (targetLevel === 'full') return 'Bqld'
    if (targetLevel === 'premium') return 'zIux'
  }
  if (currentLevel === 'full') {
    if (targetLevel === 'premium') return 'GPah'
  }
}

export {
  s3Url,
  Helpers,
  slugify,
  ownsDocument,
  sum,
  logError,
  loadFonts,
  _retrieveCredentialSecret,
  getGumroadCode
}
