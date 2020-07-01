import React, { Component } from 'react'
import { Chapters } from '../../../api/collections/chapters'

export default class ChapterPage extends Component {
  
  // propTypes: {
    // slug: React.PropTypes.string.isRequired
  // },

  // mixins: [ReactMeteorData],

  constructor (props) {
    super(props)
    this.state = {
      chapter: {},
      chapters: [],
      vocabularyChapter: {}
    }
  }

  componentDidMount () {
    const chapter = Chapters.findOne({ slug: this.props.slug })
    const chapters = Chapters.find({ published: {$ne: false }, appendix: { $ne: true }}, { sort: { number: 1 }}).fetch()
    const vocabularyChapter = Chapters.findOne({ slug: 'meteor-vocabulary' })
    this.setState({ chapter, chapters, vocabularyChapter })
  }

  render() {
    return (
      <ChapterLayout {...this.state}>
        <Chapter chapter={this.data.chapter}/>
      </ChapterLayout>
    )
  }

}

// Template.chapterPage.onCreated(function() {
//   Meteor.Keybindings.add({
//     'esc' : function () {
//       $('body').removeClass('toc-open comments-open sidebar-open vocabulary-open')
//     }
//   });

//   Session.set('currentChapterSlug', FlowRouter.getParam("slug"));
//   Meteor.call('updateLastPosition', FlowRouter.getParam("slug"));
// });
