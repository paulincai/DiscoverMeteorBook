/* globals Billing */

// TODO: I'm not sure how to avoid hardcoding this stuff here -- how to
//   properly annotate all *combinations* of levels with GR codes?
import { Products } from '../imports/api/collections/products'
import { Purchases } from '../imports/api/collections/purchases'

const PRODUCT_CODE = 'dmBook'
const CODES_TO_LEVEL_KEYS = {
  eDzA: { to: 'book' },
  ZjlD: { to: 'full' },
  OwKC: { to: 'premium' },
  Bqld: { from: 'book', to: 'full' },
  zIux: { from: 'book', to: 'premium' },
  GPah: { from: 'full', to: 'premium' },
  vOhG: { from: 'starter', to: 'book' },
  XiZOm: { from: 'starter', to: 'full' },
  aWgr: { from: 'starter', to: 'premium' }
}

const Gumroad = {
  // Create a purchase from the set of data posted to us from gumroad
  createPurchaseFromParams: function (user, params) {
    // params is the set of data posted to us by GR
    //   all we need is the permalink
    check(params, Match.ObjectIncluding({
      permalink: String,
      offer_code: Match.Optional(String)
    }))

    const book = Products.findOne({ key: PRODUCT_CODE })

    const levelKeys = CODES_TO_LEVEL_KEYS[params.permalink]
    if (!levelKeys) {
      throw new Meteor.Error('unknown-code', 'Unknown code ' + params.permalink)
    }

    // TODO -- find the offer
    const purchase = Billing.createPurchase(user, book, levelKeys.to)

    if (purchase.fromLevelKey !== levelKeys.from) {
      // Special case -- we treat free + starter as interchangeable in terms of upgrades,
      //   because it's just so common that people get it the wrong way around.
      if ((!purchase.fromLevelKey && levelKeys.from === 'starter') ||
        (purchase.fromLevelKey === 'starter' && !levelKeys.from)) {
        console.log('Treating purchase from ' + levelKeys.from + ' as ' + purchase.fromLevelKey)
      } else {
        throw new Meteor.Error('wrong-upgrade', "You can't upgrade from that level")
      }
    }

    // store for posterity
    purchase.gumroadCharge = params

    return Purchases.mutate.insert(purchase)
  },

  handleWebhook: function (params) {
    console.log('=========================== Receiving Webhook ===========================')
    console.log('--------- params: ---------')
    console.log(params)
    console.log('---------------------------')

    check(params, Match.ObjectIncluding({
      email: String
    }))

    if (!params.email) {
      throw new Meteor.Error('no-email', 'Can\'t make a gumroad purchase without an email')
    }

    if (params.email === 'hello@discovermeteor.com' || params.email === 'hello%40discovermeteor.com') {
      console.log('-> Detected Gumroad test')
      return 'http://book.discovermeteor.com/test'
    }

    let user = Meteor.users.findOneByEmail(params.email)
    let url

    if (user) {
      console.log('-> Upgrading user (' + params.email + ')')

      // We just send the user back to the site, assuming they can login
      url = Meteor.absoluteUrl()
    } else {
      console.log('-> Creating new user (' + params.email + ')')

      const userId = Meteor.users.mutate.insert({ email: params.email })
      user = Meteor.users.findOne(userId)

      url = user.finishSignupUrl()
    }

    Gumroad.createPurchaseFromParams(user, params)

    return url
  }
}

export { Gumroad }
