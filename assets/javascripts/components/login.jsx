var Login = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      username: "",
      password: "",
      loginError: null,
      newUser: false
    }
  },

  submit: function() {
    this.setState({ loginError: null });
    $.post('/login', this.state, this.handleResponse);
  },

  handleResponse: function(response) {
    if(response.errors != null) {
      this.setState({loginError: response.errors[0]});
    }
    else {
      location.reload();
    }
  },

  FBstatusChangeCallback: function(response) {
    _this = this;

    if (response.status === 'connected') { // Logged into DT and FB
      FB.api('/me', function(response) {

        var loginObj = {
          email: response.email,
          name: response.first_name,
          facebookId: response.id
        };

        $.post('/login/facebook', loginObj, _this.handleResponse);

      });
    }
  },

  handleFBLogin: function() {
    FB.login(this.FBstatusChangeCallback);
  },

  render: function() {
    return (
      <div>
        <div className="modal-header">
          <h3 className="modal-title">Login</h3>
        </div>

        <div className="modal-body">
          <form className="form-horizontal">
            <fieldset>

              <div className="form-group">
                <div className="col-xs-12">
                  <a href="#" onClick={this.handleFBLogin} className="btn btn-info pull-right" readOnly>
                    <i className="fa fa-facebook"></i> Login with Facebook
                  </a>
                </div>
              </div>

              <div className="form-group">
                <hr/>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="col-lg-3 col-md-3 control-label">Email</label>
                <div className="col-lg-9 col-md-9">
                  <input type="text" name="email" className="form-control" valueLink={this.linkState('username')} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="col-lg-3 col-md-3 control-label">Password</label>
                <div className="col-lg-9 col-md-9">
                  <input type="password" className="form-control password" valueLink={this.linkState('password')} />
                </div>
              </div>

              <div className="form-group form-error">
                {this.state.loginError}
              </div>

              <div className="form-group">
                <div className="col-lg-12 buttons">

                  <input onClick={this.submit} value="Login" className="btn btn-info pull-right" readOnly/>

                  <div className="register-link pull-right">
                    <a href="#" onClick={this.props.onRegister}>Not a member yet, clown? Register here</a>
                  </div>

                </div>
              </div>

            </fieldset>
          </form>
        </div>
      </div>
    )
  }
});