var Settings = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return this.props.settings;
  },

  componentDidMount: function() {
    _this = this;

    window.addEventListener('DT.showSettings', function () {
      $(_this.refs.modal.getDOMNode()).modal();
    });
  },

  submit: function() {
    DT.updateSettings(this.state);
    $(_this.refs.modal.getDOMNode()).modal('hide');

    var e = new CustomEvent('DT.update', { bubbles: true });
    this.getDOMNode().dispatchEvent(e);
  },

  render: function() {
    return (
      <div id="settings" className="modal fade" ref="modal">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div id="settings">
              <div className="modal-header">
                <h3 className="modal-title">Settings</h3>
              </div>

              <div className="modal-body">
                <form className="form-horizontal">
                  <fieldset>

                    <div className="form-group">
                      <label htmlFor="name" className="col-lg-8 col-md-8 control-label">Show drafted players</label>
                      <div className="col-lg-4 col-md-4">
                        <input type="checkbox" name="name" className="form-control" checkedLink={this.linkState('showDrafted')} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="col-lg-8 col-md-8 control-label">Show player projections</label>
                      <div className="col-lg-4 col-md-4">
                        <input type="checkbox" name="email" className="form-control" checkedLink={this.linkState('showProjections')} />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="col-lg-12 buttons">
                        <input onClick={this.submit} value="Save" className="btn btn-info pull-right" readOnly/>
                      </div>
                    </div>

                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});