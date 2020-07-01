import React from 'react'
import Comments from './Comments'
import ChaptersTOC from './ChaptersTOC'
import Vocabulary from './Vocabulary'


export default function Sidebars (props) {
  return (
    <div className='sidebars'>
      <Comments {...props} />
      <ChaptersTOC {...props} />
      <Vocabulary vocabularyChapter={props.vocabularyChapter} />
    </div>
  )
}
