import React, { Component } from 'react'
import Header from '../components/Header'
import FormFooter from '../components/FormFooter'
import PhotoBackground from '../components/PhotoBackground'
import { Chapters } from '../../../api/collections/chapters'

export default class FormLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      randomChapter: []
    }
  }

  componentDidMount () {
    // get a random chapter
    const chapters = Chapters.find({ published: { $ne: false }, appendix: { $ne: true }}, { sort: { number: 1 } }).fetch()
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)]
    this.setState({ randomChapter })
  }

  render() {
    const { randomChapter } = this.state
    return (
      <div className="layout photo-layout form-layout">
        <PhotoBackground chapter={randomChapter}/>
        <Header />
        <div className='main' id='main'>
          <div className='row'>
            {this.props.children}
          </div>
        </div>
        <FormFooter />
      </div>
    )
  }
}

// TODO

// Template.formPageLayout.rendered = function(){
//   loadFonts();
//   // workaround for iPad not recalculating the value of '100vh' when content of div changes
//   $('.form-layout').css('min-height', $(window).height()+'px');
//   Meteor.setTimeout(function(){
//     $('.form-layout').css('min-height', '100vh');
//   }, 100);
// }
