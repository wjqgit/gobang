import React from 'react';
import { Link } from 'react-router';

import Nav from '../components/layout/Nav'
import Footer from '../components/layout/Footer'

export default class Layout extends React.Component {
    navigate() {
      console.log(this.props);

      this.props.router.push('/')
    }


    render() {
        const { children } = this.props
        const containerStyle = {
          marginTop: "60px"
        }
        return <div>
          <Nav />

          <div class="container" style={containerStyle}>
            <div class="row">
              <div class="col-lg-12">
                <h1>miamarley.me</h1>
                {children}
              </div>
            </div>

            <Footer />
          </div>

        </div>;
    }
}
