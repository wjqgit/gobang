import React from 'react';

import Footer from './Footer'
import Header from './Header'

export default class Layout extends React.Component {
    constructor() {
        super()
        this.state = {name: 'mia'}
    }

    changeName(name) {
      this.setState({name})
    }

    render() {
        // setTimeout(() => {
        //   this.setState({name: 'marley'})
        // }, 1000)

        const title = "Welcome mia"

        return <div>
          <Header changeName={this.changeName.bind(this)} name={this.state.name} />
          {this.state.name}
          <Footer />
        </div>;
    }
}
