import React from 'react'
import { observer } from 'mobx-react'

@observer
export default class Panel extends React.Component {
  render() {
    const { position } = this.props.store
    return <div className='panel'>
      <p>x: {Math.round(position.x)}</p>
      <p>y: {Math.round(position.y)}</p>
      <p>z: {Math.round(position.z)}</p>
    </div>;
  }
}
