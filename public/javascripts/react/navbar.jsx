var NavBar = React.createClass({

  componentDidMount: function() {
    $('.editRankings').tooltip();
  },

  render: function() {

    var highlightClass = DT.util.classNames({
      "highlight metal yellow radial": true,
      "on": this.props.highlighting
    });

    var lowlightClass = DT.util.classNames({
      "lowlight metal red radial": true,
      "on": this.props.lowlighting
    });

    var draftedClass = DT.util.classNames({
      "hidden-xs metal linear drafted": true,
      "on": DT.hidingDrafted
    });

    return (

      <div className="row navbar">

        <div className="col-sm-2 col-xs-12 logo">
          <img src="/images/logo-rainbow.png" />
        </div>

        <div className="col-sm-10 col-xs-12">
          <div className="form form-horizontal">
            <div className="col-md-12 col-sm-12 hidden-xs">

              <div className={highlightClass} onClick={this.props.onHighlight} >
                <i className="fa fa-pencil" />
              </div>

              <div className={lowlightClass} onClick={this.props.onLowlight} >
                <i className="fa fa-pencil" />
              </div>

              <span className={draftedClass} onClick={this.props.onDraftedToggle}>Hide drafted</span>

              <span className="hidden-sm hidden-xs metal linear projections" onClick={this.props.toggleProjections}>Show projections</span>

              {
                this.props.user !== null ?
                  <span className="metal linear editRankings hidden-xs">Edit Rankings</span>
                :
                  <span className="metal linear editRankings disabled hidden-xs" data-toggle="tooltip" data-placement="bottom" title="Gotta log in to do this">Edit Rankings</span>
              }

              <UserMenu user={this.props.user}/>

            </div>
          </div>
        </div>

      </div>
    )
  }
});