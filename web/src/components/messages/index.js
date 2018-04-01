import React from 'react';
import classname from 'classname';
import { API } from 'constants/config';
import { socketClient } from '../../socket/socket';
import ReactChatView from './ReactChatView';
import Message from './Message';
import { getUser } from 'util/storage';

class Messages extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      messages: null,
      message: '',
      user: getUser()
    };
  }

  fetchMessage = (conversationId) => {
    return fetch(`${API}/${conversationId}/messages`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      });
  };
  createMessage = (conversationId, content) => {
    const data = {
      conversationId,
      content,
      createdOn: new Date(),
      userId: this.state.user ? this.state.user.id : getUser().id
    };
    if (socketClient) socketClient.emit('notification', data);
    this.props.conv.text = content;
    this.props.onChangeConv(this.props.conv);
    fetch(`${API}/messages`,{ method: 'POST', body: JSON.stringify(data) })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      });
  }
  componentWillReceiveProps(props) {
    if (props.conversationId)
      {
        this.fetchMessage(props.conversationId).then(data => {  if (data) this.setState({ messages: data }); })
      }
  }
  handleChange = (event) => {
    this.setState({ message: event.target.value });
    const data = {
      conversationId : this.props.conversationId,
      isTyping : event.target.value ? true : false,
      userTyping : getUser().name,
      content : event.target.value,
      socketId : socketClient.id
    }
    if (socketClient) socketClient.emit('notification-typing', data);
  }
  handleKeyPress = (event) => {
    if (event.nativeEvent.keyCode === 13
      && !event.shiftKey
      && this.state.message !== null && this.state.message.trim() !== '') {
      event.preventDefault();
      this.createMessage(this.props.conversationId, this.state.message);
      this.setState({
        message: ''
      });
      $('#fb_info_message').focus();
      const data = {
        conversationId : this.props.conversationId,
        isTyping : false,
      }
      if (socketClient) socketClient.emit('notification-typing', data);
    }
  };
  render() {
    return (
      <div>
        <div className="list-mes">
          {
            this.state.messages ?
              (
                <div>
                  <div className="infor-conversation">
                    <span className="title">{this.props.conv.title}</span>
                  </div>
                  <ReactChatView className="message-list"
                    flipped={true}
                    scrollLoadThreshold={0}
                  >
                    {
                      this.state.messages.sort((a, b) => {
                        return (new Date(b.createdOn))- new Date(a.createdOn);
                      }).map(mes => (
                        <Message
                          myself={this.state.user && mes.userId === this.state.user.id}
                          mes={mes}
                          key={mes._id}
                          user={this.state.user}
                        />
                      ))
                    }
                  </ReactChatView>
                </div>
              )
              :
              (
                <div className="no-people-choose-chat">
                  <span>Please select a chat to start messaging</span>
                </div>
              )
          }
        </div>
        {
          this.props.conversationId ?
            <div className="write_chat">
              <form>
                <div className="input_chat">
                  <textarea className="input-msg"
                    id="fb_info_message" name="input_message"
                    placeholder="Nhập nội dung tại đây..."
                    value={this.state.message.replace(/<br\s?\/?>/g, '\n')}
                    autoComplete="on"
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                  />
                </div>
              </form>
            </div>
            : ''
        }
      </div>
    );
  }
}

export default Messages;