import React from 'react'

export default function ChaptersTOC () {
  return (
    <div className="toc sidebar">
      <a href="#" className="sidebar-toggle" onClick={() =>  $('body').toggleClass('toc-open sidebar-open')}>Toggle Table of Contents</a>
      <div className="sidebar-inner">
        <ul>
          {this.props.chapters.map((chapter, index) => {
            return (
              <li key={index} className={chapter.slug === this.props.chapter.slug ? "active" : ""}>
                <span className="number">{chapter.number}</span>
                <a href={FlowRouter.path("chapter", {slug: chapter.slug})}>{chapter.title}</a>
              </li>
            )
          })
          }
        </ul>
      </div>
    </div>
  )
}
