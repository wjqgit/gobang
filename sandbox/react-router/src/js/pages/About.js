import React from 'react';

export default class About extends React.Component {

    render() {
        console.log(this.props);
        const { aspect } = this.props.params
        const { date } = this.props.location.query
        return <div>
         <h1>About {aspect} @ {date}</h1>
        </div>;
    }
}
