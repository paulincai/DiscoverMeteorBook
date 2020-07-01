import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Layout (props) {
  return (
    <div className='layout'>
      <Header />
      <div className='main' id='main'>
        <div className='row'>
          {props.children}
        </div>
      </div>
      <Footer />
    </div>
  )
}
