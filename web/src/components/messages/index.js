import React from 'react';
import classname from 'classname';
import { API } from 'constants/config';
import { socketClient } from '../../socket/socket';

class Messages extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      messages: null,
      message: ''
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
      userId: '1'
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
      this.fetchMessage(props.conversationId).then(data => { if (data) this.setState({ messages: data }); })
  }
  handleChange = (event) => {
    this.setState({ message: event.target.value });
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
                  { this.state.messages.map(mes => ( <li key={mes._id}><span>{mes.content}</span></li>))}
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