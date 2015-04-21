var Register = React.createClass({

  getInitialState: function() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {}
    }
  },

  nameChanged: function(e) {
    this.setState({name: e.target.value});
  },

  emailChanged: function(e) {
    this.setState({email: e.target.value});
  },

  passwordChanged: function(e) {
    this.setState({password: e.target.value});
  },

  confirmPasswordChanged: function(e) {
    this.setState({confirmPassword: e.target.value});
  },

  validateForm: function() {
    var errors = {};
    var valid = true;

    if(this.state.name === "") {
      errors.name = "Name cannot be blank";
      valid = false;
    }

    if(this.state.email === "") {
      errors.email = "Email cannot be blank";
      valid = false;
    }

    if(this.state.password === "") {
      errors.password = "Password cannot be blank";
      valid = false;
    }

    if(this.state.password !== this.state.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if(valid == false) {
      this.setState({ errors: errors })
    }

    return valid;
  },

  submit: function() {
    if(!this.validateForm()) {
      return;
    }

    $.post('/register', this.state, this.handleResponse);
  },

  handleResponse: function(response) {
    if(response.errors != null) {
      this.setState({ errors: {email: response.errors[0].email} });
    }
    else {
      location.reload();
    }
  },

  render: function() {
    return (
      <div id="register">
        <div className="modal-header">
          <h3 className="modal-title">Register</h3>
        </div>

        <div className="modal-body">
          <form className="form-horizontal">
            <fieldset>

              <div className="form-group">
                <label htmlFor="name" className="col-lg-3 col-md-3 control-label">First Name</label>
                <div className="col-lg-9 col-md-9">
                  <input type="text" name="name" className="form-control" onChange={this.nameChanged}/>
                </div>
              </div>

              <div className="col-xs-12 form-group form-error">
                <div className="pull-right">{this.state.errors.name}</div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="col-lg-3 col-md-3 control-label">Email</label>
                <div className="col-lg-9 col-md-9">
                  <input type="text" name="email" className="form-control" onChange={this.emailChanged}/>
                </div>
              </div>

              <div className="col-xs-12 form-group form-error">
                <div className="pull-right">{this.state.errors.email}</div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="col-lg-3 col-md-3 control-label">Password</label>
                <div className="col-lg-9 col-md-9">
                  <input type="password" className="form-control password" onChange={this.passwordChanged}/>
                </div>
              </div>

              <div className="col-xs-12 form-group form-error">
                <div className="pull-right">{this.state.errors.password}</div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="col-lg-3 col-md-3 control-label">Confirm Password</label>
                <div className="col-lg-9 col-md-9">
                  <input type="password" className="form-control password" onChange={this.confirmPasswordChanged}/>
                </div>
              </div>

              <div className="col-xs-12 form-group form-error">
                <div className="pull-right">{this.state.errors.confirmPassword}</div>
              </div>

              <div className="form-group">
                <label htmlFor="security" className="col-lg-3 col-md-3 control-label">Security Question</label>
                <div className="col-lg-9 col-md-9"><span className="help-block">In your opinion, who was the best Batman?</span>
                  <select className="form-control">
                    <option>Michael Keaton</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <div className="col-lg-12 buttons">
                  <input onClick={this.submit} value="Register" className="btn btn-info pull-right" readOnly/><span data-dismiss="modal" className="btn btn-default pull-right">Cancel</span>
                </div>
              </div>

            </fieldset>
          </form>
        </div>
      </div>
    )
  }
});