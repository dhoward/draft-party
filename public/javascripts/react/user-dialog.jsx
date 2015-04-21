var UserDialog = React.createClass({

  getInitialState: function() {
    return {
      newUser: false
    }
  },

  componentDidMount: function() {
    _this = this;

    window.addEventListener('DT.showLogin', function () {
      _this.setState({newUser: false});
      $(_this.refs.modal.getDOMNode()).modal();
    });
  },

  showRegister: function() {
    this.setState({ newUser: true })
  },

  render: function() {
    return (
      <div id="login" ref="modal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              { !this.state.newUser ?
                <Login onRegister={this.showRegister} /> :
                <Register />
              }
            </div>
          </div>
      </div>
    )
  }
});