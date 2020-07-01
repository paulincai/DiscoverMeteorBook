/* globals GAnalytics, mixpanel */

const trackPageview = url => {
  mixpanel.track_pageview(url)
  GAnalytics.pageview(url)
}

const trackEvent = (category, action, label, value, properties) => {
  properties.label = label
  properties.value = value

  if (Meteor.absoluteUrl().indexOf('localhost') != -1 || Meteor.isServer) { // always log on server
    console.log('// trackEvent //')
    console.log(category)
    console.log(action)
    console.log(label)
    console.log(value)
    console.log(properties || {})
  }

  GAnalytics.event(category, action, label || null, value || null)

  mixpanel.track(action, properties)
}

export { trackPageview, trackEvent }
