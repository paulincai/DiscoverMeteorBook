import React, { Component } from 'react'

export default class Vocabulary extends Component {

  getVocabulary () {
    return {
      __html: parseMarkdown(this.props.vocabularyChapter.text)
    }
  }
  
  componentDidMount() {
    $('.vocabulary .sidebar-content p').hide()
    $('.vocabulary h4').click(e => {
      e.preventDefault()
      $(e.currentTarget).toggleClass('active').next().slideToggle('fast')
    })
  }

  handleToggleClick(e) {
    e.preventDefault()
    $('body').toggleClass('vocabulary-open sidebar-open')
  }

  render() {
    return (
      <div className="vocabulary sidebar">
        <a href="#" className="sidebar-toggle" onClick={this.handleToggleClick}>Toggle Vocabulary</a>
        <div className="sidebar-inner">
          <div className="sidebar-content">
            <h3>Vocabulary</h3>
            <div className="vocabulary-content" dangerouslySetInnerHTML={this.getVocabulary()}></div>
          </div>
        </div>
      </div>
    )
  }
}
