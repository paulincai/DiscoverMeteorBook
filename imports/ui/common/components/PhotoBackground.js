import React, { Component } from 'react'

export default class PhotoBackground extends Component {
  
  // propTypes: {
    // chapter: React.PropTypes.object.isRequired
  // }

  componentDidMount() {
    console.log('What do I have here? ', this.props)
    const { chapter } = this.props
    const imgUrl = s3Url+chapter.slug+'.jpg'
    $('.photo-overlay').removeClass('overlay-hidden')
    $('<img/>').attr('src', imgUrl).load(function() {
      $(this).remove() // prevent memory leaks as @benweet suggested
      $('.photo-background').css('background-image', 'url('+imgUrl+')')
      $('.photo-overlay').addClass('overlay-hidden')
      $('.refresh').removeClass('loading')
    })
  }

  render() {
    return (
      <div className="photo-background-wrapper">
        <div className="photo-background" />
        <div className="photo-overlay" />
        <div className="photo-credit">
          Photo credit: <a href={this.props.chapter.photoUrl}>{this.props.chapter.photoAuthor}</a>
        </div>
      </div>
    )
  }
}
