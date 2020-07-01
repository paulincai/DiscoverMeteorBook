import React, { Component } from 'react'
import { Chapters } from '../../../api/collections/chapters'
import parseMarkdown from '../../helpers/markdown'
import Layout from '../layouts/Layout'

export default class ChangelogPage extends Component {
  // mixins: [ReactMeteorData],

  getMeteorData () {
    return {
      changelog: Chapters.findOne({ slug: 'changelog' })
    }
  }

  getText () {
    return {
      __html: parseMarkdown(this.data.changelog.text)
    }
  }

  render () {
    return (
      <Layout>
        <h2>Changelog</h2>
        <div className="post-content" dangerouslySetInnerHTML={this.getText()}></div>
      </Layout>
    )
  }
}
