var UserMenu = React.createClass({

  getInitialState: function() {
    return {
      newUser: false,
      user: null,
      error: null
    }
  },

  showInstructions: function() {
    var e = new CustomEvent('DT.showInstructions', {bubbles: true});
    this.getDOMNode().dispatchEvent(e);
  },

  showSettings: function() {
    var e = new CustomEvent('DT.showSettings', {bubbles: true});
    this.getDOMNode().dispatchEvent(e);
  },

  userMenu: function() {
    return (
      <div className="pull-right user-dropdown">
        <div className="dropdown-holder pull-right">
          <div className="nav-button dropdown pull-right login" data-toggle="dropdown" href="#">
            {this.props.user.name}
            <span className="caret"></span>
          </div>
          <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
            <li>
              <a className="resetButton" href="#" onClick={this.showInstructions}>Help</a>
            </li>
            <li>
              <a className="resetButton" href="#" onClick={this.showSettings}>Settings</a>
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
    if(this.props.user !== null) {
      return this.userMenu();
    } else {
      return (
        <span className="nav-button login" onClick={this.showLogin}>Log In</span>
      )
    }
  }

});
