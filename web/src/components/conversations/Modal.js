import React from 'react';

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    return (
      <div className="backdrop backdrop-custom">
        <div className="modal modal-custom">
          {this.props.children}
          {
            this.props.showClose ?
              <div className="footer">
                <button type="button" onClick={this.props.onClose} className="btn btn-cancel">
                  Close
                </button>
                <button type="button" onClick={this.props.create} className="btn btn-create">
                  Tạo
                </button>
              </div>
              :
              <div className="footer">
                <button type="button" className="btn btn-create" onClick={this.props.create}>
                  Tạo
                </button>
              </div>
          }

        </div>
      </div>
    );
  }
}

export default Modal;