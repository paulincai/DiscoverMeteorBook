/* globals Counts */
import React, { Component } from 'react'
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions'
import PropTypes from 'prop-types'
import { _ } from 'meteor/underscore'
import Griddle from 'griddle-react'

checkNpmVersions({
  'griddle-react': '0.5.x',
  'react-addons-pure-render-mixin': '15.x'
}, 'utilities:meteor-griddle')

export default class MeteorGriddle extends Component {
  // mixins: [ReactMeteorData],

  getDefaultProps () {
    return {
      useExternal: false,
      externalFilterDebounceWait: 300,
      externalResultsPerPage: 10
    }
  }

  getInitialState () {
    return {
      currentPage: 0,
      maxPages: 0,
      externalResultsPerPage: this.props.externalResultsPerPage,
      externalSortColumn: this.props.externalSortColumn,
      externalSortAscending: this.props.externalSortAscending,
      query: {}
    }
  }

  UNSAFE_componentWillMount () {
    this.applyQuery = _.debounce((query) => {
      this.setState({ query })
    }, this.props.externalFilterDebounceWait)
  }

  getMeteorData () {
    // Get a count of the number of items matching the current filter.
    // If no filter is set it will return the total number of items in the
    // collection.
    const matchingResults = Counts.get(this.props.matchingResultsCount)

    const options = {}
    let skip
    if (this.props.useExternal) {
      options.limit = this.state.externalResultsPerPage
      if (!_.isEmpty(this.state.query) && !!matchingResults) {
        // if necessary, limit the cursor to number of matching results to avoid
        // displaying results from other publications
        options.limit = _.min([options.limit, matchingResults])
      }
      options.sort = {
        [this.state.externalSortColumn]:
          (this.state.externalSortAscending ? 1 : -1)
      }
      skip = this.state.currentPage * this.state.externalResultsPerPage
    }

    let pubHandle

    if (this.props.subsManager) {
      pubHandle = this.props.subsManager.subscribe(
        this.props.publication,
        this.state.query,
        _.extend({ skip }, options)
      )
    } else {
      pubHandle = Meteor.subscribe(
        this.props.publication,
        this.state.query,
        _.extend({ skip }, options)
      )
    }

    const results =
      this.props.collection.find(this.state.query, options).fetch()

    return {
      loading: !pubHandle.ready(),
      results: results,
      matchingResults: matchingResults
    }
  }

  resetQuery () {
    this.setState({
      query: {}
    })
  }

  // what page is currently viewed
  setPage (index) {
    this.setState({ currentPage: index })
  }

  // this changes whether data is sorted in ascending or descending order
  changeSort (sort, sortAscending) {
    this.setState({ externalSortColumn: sort, externalSortAscending: sortAscending })
  }

  setFilter (filter) {
    if (filter) {
      const filteredFields = this.props.filteredFields || this.props.columns
      const orArray = filteredFields.map((field) => {
        const filterItem = {}
        filterItem[field] = { $regex: filter, $options: 'i' }
        return filterItem
      })
      this.applyQuery({ $or: orArray })
    } else {
      this.resetQuery()
    }
  }

  // this method handles determining the page size
  setPageSize (size) {
    this.setState({ externalResultsPerPage: size })
  }

  render () {
    // figure out how many pages we have based on the number of total results
    // matching the cursor
    const maxPages = Math.ceil(this.data.matchingResults / this.state.externalResultsPerPage)

    // The Griddle externalIsLoading property is managed internally to line
    // up with the subscription ready state, so we're removing this property
    // if it's passed in.
    const allProps = this.props
    delete allProps.externalIsLoading

    return (
      <Griddle
        {...allProps}
        tableClassName="table"
        results={this.data.results}
        columnMetadata={this.props.columnMetadata}
        externalSetPage={this.setPage}
        externalChangeSort={this.changeSort}
        externalSetFilter={this.setFilter}
        externalSetPageSize={this.setPageSize}
        externalMaxPage={maxPages}
        externalCurrentPage={this.state.currentPage}
        resultsPerPage={this.state.externalResultsPerPage}
        externalSortColumn={this.state.externalSortColumn}
        externalSortAscending={this.state.externalSortAscending}
        externalIsLoading={this.data.loading}
      />
    )
  }
}

MeteorGriddle.propTypes = {
  publication: PropTypes.string, // the publication that will provide the data
  collection: PropTypes.object, // the collection to display
  matchingResultsCount: PropTypes.string, // the name of the matching results counter
  filteredFields: PropTypes.array, // an array of fields to search through when filtering
  subsManager: PropTypes.object
  // plus regular Griddle props
}
