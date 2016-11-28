import React from 'react'
import { connect } from 'react-redux'

import Footer from './Footer'
import Header from './Header'

import { fetchUser } from '../actions/userActions'
import { fetchTweets } from '../actions/tweetsActions'

@connect((store) => {
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    tweets: store.tweets.tweets
  }
})
export default class Layout extends React.Component {
    componentWillMount() {
      this.props.dispatch(fetchUser())
    }

    fetchTweets() {
      this.props.dispatch(fetchTweets())
    }

    render() {
        const { user, tweets } = this.props

        if (!tweets.length) {
          return <button class="btn btn-primary" onClick={this.fetchTweets.bind(this)}>Fetch Tweets</button>
        }

        const mappedTweets = tweets.filter(tweet => tweet.text).map(tweet => <li key={tweet.id}>{tweet.text}</li>)

        return <div>
          <h1>{user.name}</h1>
          <ul>{mappedTweets}</ul>
          <Footer />
        </div>;
    }
}
