import React from 'react';
import Conversations from './conversations';

class Main extends React.Component {
  componentDidMount() {
  }
  componentWillReceiveProps(props) {
    console.log('====> props index components', props);
  }
  render() {
    return (
      <div>
        <Conversations />
      </div>
    );
  }
}

export default Main;