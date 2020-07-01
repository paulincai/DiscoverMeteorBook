import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Upgrade from '../containers/Upgrade'

export default class Chapter extends Component {
  getChapterContent() {
   return {
      __html: parseMarkdown(this.props.chapter.text)
    }
  }

  renderChapterContent() {
    return (
      <div className="post-content" id="content">
        <div dangerouslySetInnerHTML={this.getChapterContent()}></div>
        <ShareProgress chapter={this.props.chapter}/>
      </div>
    )
  }

  render() {
    return (
      <div className="post">
        {this.props.chapter.text ? this.renderChapterContent() : <Upgrade />}
        {<ChapterNav chapter={this.props.chapter}/>}
      </div>
    )
  }

}

Chapter.propTypes = {
  chapter: PropTypes.object.isRequired
}
