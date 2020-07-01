import AppContainer from './layouts/AppContainer'

async function main () {
  const [
    { Meteor },
    React,
    ReactDOM,
    { default: AppContainer },
    { createBrowserHistory }
  ] = await Promise.all([
    import('meteor/meteor'),
    import('react'),
    import('react-dom'),
    import('./layouts/AppContainer'),
    import('history')
  ])

  Meteor.startup(() => {
    const history = createBrowserHistory()
    ReactDOM.render(<AppContainer history={history} />, document.getElementById('app'))
  })
}

main()
