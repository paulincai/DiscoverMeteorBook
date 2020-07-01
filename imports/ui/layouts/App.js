import React, { Component } from 'react'
import { loadFonts } from '../../../lib/helpers'
import Loading from '../common/components/Loading'
import Main from '../../startup/client/router'

export default class App extends Component {
  componentDidMount () {
    loadFonts()
  }

  render () {
    const { ready } = this.props

    console.log(ready)
    return ready ? <Main /> : <Loading />
  }
}
