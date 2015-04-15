var UserMenu = React.createClass({

  getInitialState: function() {
    return {
      user: null,
      error: null
    }
  },

  userMenu: function() {
    return (
      <div className="col-xs-12 user-dropdown">
        <div className="dropdown-holder pull-right">
          <div className="metal linear dropdown pull-right" data-toggle="dropdown" href="#">
            Welcome, {this.state.user.name}
            <span className="caret"></span>
          </div>
          <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
            <li>
              <a className="resetButton" href="#">Help</a>
            </li>
            <li>
              <a className="resetButton" href="#">Reset</a>
            </li>
            <li>
              <a href="/logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    )
  },

  loginForm: function() {
    return (
      <div className="col-xs-12.login-form">
        <form className="form-inline user-form pull-right" action="/login" method="post">
          <div className="form-group">
            <div className="error text-danger pull-right">{this.state.error}</div>
          </div>
          <div className="form-group">
            <input className="form-control" type="text" name="username" placeholder="Email" />
          </div>
          <div className="form-group">
            <input className="form-control" type="password" name="password" placeholder="Password" />
          </div>
          <input className="btn btn-info" type="submit" value="Log In" />
        </form>
        <div className="col-lg-12.col-md-12.col-sm-12.col-xs-12">
          <a className="registerButton text-muted">Register</a>
        </div>
      </div>
    )
  },

  render: function() {
    if(this.state.user !== null) {
      return this.userMenu();
    } else {
      return this.loginForm();
    }
  }

});
