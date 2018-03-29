import React from 'react';
import classname from 'classname';
import { API } from 'constants/config';
import Messages from '../messages';
import { onNotification, socketClient } from '../../socket/socket';

class Conversations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      conversations: null,
      conversationId: null,
      conv: null
    };
  }
  fetchConversations = () => {
    return fetch(`${API}/conversations`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      });
  };
  componentWillReceiveProps(props) {
  }

  componentDidMount() {
    socketClient.on('notification', (data) => {
      this.state.conversations.map(c => {
        if (c._id === data.conversationId) {
          c.text = data.content;
        }
      });
      this.setState({ conversations: this.state.conversations });
    });
    this.fetchConversations().then(data => { this.setState({ conversations: data });})
  }
  onSelectItem = (conv) => {
    this.state.conversations.map(c => { c.active = false });
    conv.active = true;
    this.setState({ conversations: this.state.conversations, conversationId: conv._id, conv: conv });
  }
  onChangeConv = (conv) => {
    this.setState({ conversations: this.state.conversations });
  }

  render() {
    return (
      <div className="container">
        <div className="conversations clearfix">
          <ul className="people">
            { this.state.conversations ? this.state.conversations.map(conv => (
              <li key={conv._id}
                className={classname('person', {
                  'active': conv.active === true
                })}
                onClick={() => this.onSelectItem(conv)}>
                <div className="wrap_chat">
                  <div className="avatar">
                    <img src="/images/no-image-post.png" alt="avatar" />
                  </div>
                  <div className="info">
                    <span className="title" title={conv.title}><span className="name">{conv.title}</span></span>
                    <span className="live_chat" title={conv.body}>{conv.text}</span>
                  </div>
                </div>
              </li>
            )) : ''}
          </ul>
        </div>
        <div className="detail-conversation">
          <Messages
            conversationId={ this.state.conversationId}
            conv={this.state.conv}
            onChangeConv={() => this.onChangeConv(this.state.conv)}
          />
        </div>
      </div>
    );
  }
}

export default Conversations;