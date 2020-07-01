import React from 'react'
import Photo from '../components/Photo'
import Header from '../../common/components/Header'
import Footer from '../../common/components/Footer'

export default function ChapterLayout (props) {
  return (
    <div className="outerLayout">
      <div className="layout">
        <Photo {...this.props} />
        <Header />
        <div className='main' id='main'>
          <div className='row'>
            {this.props.children}
          </div>
        </div>
        <Footer />
      </div>
      <Sidebars {...this.props} />
    </div>
  )
}
