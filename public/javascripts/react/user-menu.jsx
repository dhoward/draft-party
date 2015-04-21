var UserMenu = React.createClass({

  getInitialState: function() {
    return {
      newUser: false,
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

  showLogin: function() {
    var login = new CustomEvent('DT.showLogin', {bubbles: true});
    this.getDOMNode().dispatchEvent(login);
  },

  render: function() {
    // if(this.state.user !== null) {
    //   return this.userMenu();
    // } else {
    //   return this.loginForm();
    // }
    return (
      <input className="btn btn-info" value="Log In" readOnly onClick={this.showLogin} />
    )
  }

});
