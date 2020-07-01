import React, { Component } from 'react'
import ReactDisqusThread from 'react-disqus-thread'

const disqus_shortname = 'themeteorbook' // required: replace example with your forum shortname

export default class extends Component {
  handleToggleClick(e) {
    e.preventDefault()
    $('body').toggleClass('comments-open sidebar-open')
  }

  render() {
    const { chapter } = this.props
    return (
      <div className="comments sidebar">
        <a href="#disqus_thread" className="sidebar-toggle" data-disqus-identifier={chapter?.slug} onClick={this.handleToggleClick}></a>
        <div className="sidebar-inner">
          <div className="issues">
            <p className="mbottom">If <strong>you need support</strong>, please leave an issue on GitHub:</p>
            <a className="issue-link simple-button" href="https://github.com/DiscoverMeteor/Microscope/issues" target="_blank">Report an issue with the code</a>
            <a className="issue-link simple-button" href="https://github.com/DiscoverMeteor/book/issues" target="_blank">Report an issue with the book</a>
            <hr/>
            <p>Additionally, you can use this area for more general discussion and questions:</p>
          </div>
          <ReactDisqusThread
            shortname={disqus_shortname}
            identifier={chapter?.slug}
            title={chapter?.title}
            url={Meteor.absoluteUrl() + 'chapters/' + chapter?.slug}
          />
        </div>
      </div>
    )
  }
}
