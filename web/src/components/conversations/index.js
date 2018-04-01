import React from 'react';
import classname from 'classname';
import { API } from 'constants/config';
import Messages from '../messages';
import { socketClient } from '../../socket/socket';
import { storage, getUser, setUser } from 'util/storage';
import { randomString } from 'util/index';
import { stringify } from 'querystring';
import Modal from './Modal';

class Conversations extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      conversations: null,
      conversationId: null,
      conv: null,
      modalUser: false,
      modalConv: false,
      isOpen: false,
      nameNewConv: '',
      userName: ''
    };
  }
  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  showModalUser = () => {
    this.setState({ modalUser: true });
  }
  showModalConv = () => {
    this.setState({ modalConv: true });
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
  createUser = (userName) => {
    console.log('username', userName);
    if (userName === undefined || userName === '') return;
    this.toggleModal();
    this.setState({ userName: '', modalUser: false });
    let user = getUser();
    user.hasName = true;
    user.name = userName;
    setUser(user);
  }
  createNewConv = (nameConv) => {
    if (nameConv === undefined || nameConv === '') {
      this.toggleModal();
      return;
    };
    const data = {
      title: nameConv,
      modified: new Date()
    }
    fetch(`${API}/conversations`, { method: 'POST', body: JSON.stringify(data) })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      }).then(json => { this.state.conversations.push(json); this.setState({ conversations: this.state.conversations })});
    this.toggleModal();
    this.setState({ nameNewConv: '', modalConv: false });
  }
  updateConv = (convId, data) => {
    fetch(`${API}/conversations/${convId}`, { method: 'PUT', body: JSON.stringify(data) })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      });
  }
  componentWillReceiveProps(props) {
  }
  saveUser = () => {

  }
  componentDidMount() {
    if (!getUser().hasName) {
      this.showModalUser();
    }
    socketClient.on('notification', (data) => {
      this.state.conversations.map(c => {
        if (c._id === data.conversationId) {
          c.text = data.content;
          c.modified = data.createdOn;
          this.updateConv(data.conversationId, c);
        }
      });
      this.setState({ conversations: this.state.conversations });
    });
    socketClient.on('notification-typing', (data) => {
      if (data.socketId === socketClient.id) return;
      this.state.conversations.map(c => {
        if (c._id === data.conversationId) {
          c.typing = data.isTyping ?  (data.userTyping + ' is typing ...'): '';
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
  handleChange = (event) => {
    this.setState({ nameNewConv: event.target.value, userName: event.target.value });
  }
  render() {
    return (
      <div className="container">
        <div className="header">
          <i className="fa fa-bars fa-customs" aria-hidden="true" />
          <span>WebChat</span>
        </div>
        <div className="conversations clearfix">
          <div className="box-search">
            <input className="form-control input-search-left" placeholder="Search" />
            {/* <i className="fa fa-plus fa-plus-customs" aria-hidden="true" /> */}
            <span className="add-conversation" onClick={() => this.showModalConv()}>Thêm mới</span>
          </div>
          <ul className="people">
            { this.state.conversations ?
              this.state.conversations.sort((a, b) => {
                return (new Date(b.modified)) - new Date(a.modified);
              }).map(conv => (
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
                      {
                        conv.typing ?
                          <span className="other-typing">{conv.typing}</span>
                          : ''
                      }
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
        <Modal show={this.state.modalConv}
          onClose={() => this.toggleModal()}
          showClose={true}
          create={() => this.createNewConv(this.state.nameNewConv)}
        >
          <div className="new-conv">
            <div className="img-new-conv">
              <img src="/images/no-image-post.png" alt="avatar"/>
            </div>
            <div className="main-new-conv">
              <label>Name</label>
              <input placeholder="" className="input-new-conv" value={this.state.nameNewConv} onChange={this.handleChange} />
            </div>
          </div>
        </Modal>
        <Modal show={this.state.modalUser}
          onClose={() => this.toggleModal()}
          showClose={false}
          create={() => this.createUser(this.state.userName)}
        >
          <div className="new-conv">
            <div className="img-new-conv">
              <img src="/images/no-image-post.png" alt="avatar"/>
            </div>
            <div className="main-new-conv">
              <label>Name</label>
              <input placeholder="" className="input-new-conv" value={this.state.nameNewConv} onChange={this.handleChange} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Conversations;