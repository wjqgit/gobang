import React from 'react';

import Title from './Header/Title'

export default class Header extends React.Component {
    handleChange(e) {
      const name = e.target.value;
      this.props.changeName(name);
    }

    render() {
        return <div>
          <header>header</header>
          <Title name={this.props.name}/>
          <input value={this.props.name} onChange={this.handleChange.bind(this)}/>
        </div>;
    }
}
