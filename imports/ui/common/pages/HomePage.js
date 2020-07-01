/* globals FlowRouter */
import React, { Component } from 'react'
import { Interviews } from '../../../api/collections/interviews'
import { Chapters } from '../../../api/collections/chapters'
import { Products } from '../../../api/collections/products'
import { Positions } from '../../../api/collections/positions'
import { Videos } from '../../../api/collections/videos'
import Layout from '../layouts/Layout'
import { formats } from '../../../../lib/content/formats'

import Purchase from '../components/Purchase'

export default class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      chapters: [],
      changelogChapter: {},
      screencasts: [],
      caseStudies: [],
      interviews: [],
      user: Meteor.user(),
      product: {},
      position: {},
      lastChapter: ''
    }
  }

  componentDidMount () {
    const chapters = Chapters.find({ published: { $ne: false }, appendix: { $ne: true } }, { sort: { number: 1 } }).fetch()
    const changelogChapter = Chapters.findOne({ slug: 'changelog' })
    const screencasts = Videos.find({ type: 'Screencast' }).fetch()
    const caseStudies = Videos.find({ type: 'Case Study' }).fetch()
    const interviews = Interviews.find().fetch()
    const product = Products.findOne({ key: BOOK_KEY })
    const position = Positions.findOne()
    const lastChapter = position && Chapters.findOne({ slug: position?.slug })

    this.setState({ chapters, changelogChapter, screencasts, caseStudies, interviews, product, position, lastChapter })
  }

  renderChapter (chapter, index) {
    return (
      <li key={index} className={chapter.text ? 'chapter-available' : 'chapter-unavailable'}>
        <a href={FlowRouter.path('chapter', { slug: chapter.slug })}>{chapter.title}</a>
        {chapter.extra ? <span className='marker special-marker'>Extra</span> : ''}
        <span className='chapter-number'>{chapter.number}</span>
      </li>
    )
  }

  renderLastPosition () {
    if (this.state.lastChapter) {
      return (
        <a href={FlowRouter.path('chapter', { slug: this.state.lastChapter?.slug })} className='last-position-link'>Go back to: {this.state.lastChapter?.title}</a>
      )
    }
  }

  renderNote () {
    if (!this.state.user || this.state.user.hasPermission(this.state.product, 'book')) {
      // don't show anything
    } else if (this.state.user.hasPermission(this.state.product, 'starter')) {
      return (
        <div className='note'>
          This is a starter edition of the first eight chapters (plus sidebars) of <em>Discover Meteor</em>.
          To purchase the full book, please use the upgrade links on the right.
        </div>
      )
    } else {
      return (
        <div className='note'>
          This is a preview version of the first three chapters (plus a sidebar) of <em>Discover Meteor</em>. If you like the book, be sure to check out the <a href='https://www.discovermeteor.com/packages'>full version</a>!
        </div>
      )
    }
  }

  renderSpecialNote () {
    return (
      <div className='sidebar-block note'>
        <p>
          We&apos;ve just completely rewritten this app&apos;s front-end to use React.
          If you encounter any bugs, please <a href='https://github.com/DiscoverMeteor/book/issues'>let us know!</a>
        </p>
      </div>
    )
  }

  renderSidebarNote () {
    if (this.state.user) {
      const productLevel = this.state.user.productLevel(this.state.product)
      return (
        <div className='sidebar-block'>
          <p>Welcome to the Discover Meteor members area. Your package: <strong>{productLevel && productLevel.name}</strong>.</p>
          <p><a href={FlowRouter.path('accountPage')}>My Account</a></p>
        </div>
      )
    } else {
      return (
        <div className='sidebar-block'>
          <p>Already purchased the book? <a href={FlowRouter.path('loginPage')}>Log in</a> to access your account.</p>
        </div>
      )
    }
  }
/*
  renderLinks () {
    const links = []
    if (this.state.user && this.state.user.isAdmin()) {
      links.push({ name: 'Users', link: FlowRouter.path('adminUsersPage') })
      links.push({ name: 'Purchases', link: FlowRouter.path('adminPurchasesPage') })
    }
    links.push({ name: 'Changelog', link: FlowRouter.path('changelogPage') })

    return (
      <div className='sidebar-block useful-links'>
        <h3>Links</h3>
        <ul>
          {links.map((link, index) => <li key={index}><a href={link.link}>{link.name}</a></li>)}
        </ul>
      </div>
    )
  }
*/

  renderDownloads () {
    if (this.state.user && this.state.user.hasPermission(this.state.product, 'book')) {
      return (
        <div className='sidebar-block full-book'>
          <h3>Download the Book</h3>
          <ul>
            {formats.map((format, index) => <li key={index}><a target='_blank' rel='noreferrer' download href={'/download/' + format.title} className={format.title} data-category='Download' data-action={format.title + ' downloaded'} data-label={format.title + ' downloaded'}>{format.title}</a></li>)}
          </ul>
          <p className='small'>
            {this.state.user.hasPermission(this.state.product, 'full')? <span>Note: does not contain extra chapters. </span> : ''}
            Last updated on {this.state.changelogChapter.updated}
          </p>
        </div>
      )
    }
  }

  renderScreencasts () {
    if (this.state.user && this.state.user.hasPermission(this.state.product, 'full')) {
      return (
        <div className='extra-content-blocks'>
          <div className='sidebar-block screencasts'>
            <h3>Screencasts</h3>
            <ul>
              {this.state.screencasts.map((screencast, index) => <li key={index}><a href={FlowRouter.path('videoPage', {slug: screencast.slug})}>{screencast.title}</a></li>)}
            </ul>
          </div>
          <div className='sidebar-block casestudies'>
            <h3>Case Studies</h3>
            <ul>
              {this.state.caseStudies.map((study, index) => <li key={index}><a href={FlowRouter.path('videoPage', {slug: study.slug})}>{study.title}</a></li>)}
            </ul>
          </div>
          <div className='sidebar-block interviews'>
            <h3>Interviews</h3>
            <ul>
              {this.state.interviews.map((interview, index) => <li key={index}><a href={FlowRouter.path('interviewPage', {slug: interview.slug})}>{interview.title}</a></li>)}
            </ul>
          </div>
        </div>
      )
    }
  }

  renderPurchases () {
    const user = this.state.user
    const book = this.state.product

    if (user) {
      const upgrades = user && user.availableUpgradeLevels(book)
      if (upgrades.length) {
        return (
          <div className='sidebar-block upgrade'>
            <h3>Upgrade</h3>
            {upgrades.map((level, index) => <Purchase product={this.state.product} level={level} user={this.state.user} key={index}/>)}
          </div>
        )
      }
    } else {
      const purchases = _.filter(book.levels, function (level) {
        return level.price > 0 && !level.disabled
      })
      return (
        <div className='sidebar-block purchase'>
          <h3>Buy the Book</h3>
          {purchases.map((level, index) => <Purchase product={this.state.product} level={level} key={index}/>)}
        </div>
      )
    }
  }

  renderNewsletter () {
    if (!this.state.user) {
      return (
        <div className='sidebar-block newsletter'>
          <h3>Newsletter</h3>
          <p>Join our newsletter to start receiving Meteor tips and news:</p>
          <form className='newsletter-form normal-style' action='https://telesc.us2.list-manage.com/subscribe/post?u=b5af47765edbd2fc173dbf27a&ampampid=ed0fb4ac61' method='post' name='mc-embedded-subscribe-form' noalidate='' target='_blank'>
            <div className='control-group'>
              <input className='email text' name='EMAIL' placeholder='Your email' type='email'/>
              <input id='landing' name='LANDING' type='hidden' value='members-area-homepage'/>
              <input id='origin' name='ORIGIN' type='hidden' value='members-area'/>
            </div>
            <div className='form-actions'>
              <button className='submit button simple-button newsletter-submit' data-category='Click' data-action='newsletter clicked' data-label='newsletter clicked (homepage)' name='subscribe' type='submit'>Join</button>
            </div>
          </form>
        </div>
      )
    }
  }

  render () {
    return (
      <Layout>
        {this.renderLastPosition()}

        {this.renderNote()}

        <section className='chapters'>
          <h2>Table of Contents</h2>
          <ul>
            {this.state.chapters.map(this.renderChapter)}
          </ul>
        </section>

        <section className='links home-sidebar'>
          {this.renderSpecialNote()}
          {this.renderSidebarNote()}
          {/*this.renderLinks()*/}
          {this.renderDownloads()}
          {this.renderScreencasts()}
          {this.renderPurchases()}
          {this.renderNewsletter()}
        </section>

      </Layout>
    )
  }
}

// Template.homepage.rendered = function () {
//   $('body').removeClass('toc-open sidebar-open comments-open')
// }

// Template.homepage.events({
//   'click [data-category]:not([data-category=''])': function (e) {
//     var $a = $(e.target)
//     trackEvent($a.data('category'),$a.data('action'),$a.data('label'))
//   }
// })
