import React from 'react';
import classname from 'classname';
import moment from 'moment';
import { getUser } from 'util/storage';

export default class Message extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const classNames = 'message' + (this.props.myself ? ' sent-message' : ' received-message');
    return (
      <div className={classNames}>
        {
          this.props.mes ?
            <div className="line-chat">
              <div className="img-user-chat">
                {
                  this.props.mes.userId == this.props.user.id
                    ?
                    ''
                    :
                    <img src="/images/no-image-post.png" alt="avatar" />
                }
              </div>
              <div className="line-chat-detail">
                <span className="user-chat">{this.props.mes.userId == this.props.user.id ? this.props.user.name : 'người lạ'}</span>
                <span className="text-chat">{this.props.mes.content}</span>
                <time className="time-chat">{moment(this.props.mes.createdOn).format('HH:mm')}</time>
              </div>
            </div>
            : ''
        }
      </div>
    );

  }
}