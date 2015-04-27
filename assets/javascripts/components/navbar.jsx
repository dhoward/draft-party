var NavBar = React.createClass({

  componentDidMount: function() {
    $('.editRankings').tooltip();
  },

  render: function() {

    var highlightClass = DT.util.classNames({
      "nav-button first highlight yellow": true,
      "on": this.props.highlighting
    });

    var lowlightClass = DT.util.classNames({
      "nav-button lowlight red": true,
      "on": this.props.lowlighting
    });

    var draftedClass = DT.util.classNames({
      "nav-button hidden-xs drafted": true,
      "on": DT.hidingDrafted
    });

    var projectionsClass = DT.util.classNames({
      "nav-button hidden-xs drafted": true,
      "on": DT.showProjections
    });

    return (

      <div className="row navbar">

        {/*<div className="col-sm-2 col-xs-12 logo">
          <img src="/images/logo-rainbow.png" />
        </div>*/}

        <div className="col-sm-10 col-xs-12 pull-right">
          <div className="pull-right hidden-xs">

            <div className={highlightClass} onClick={this.props.onHighlight} >
              <i className="fa fa-pencil" />
            </div>

            <div className={lowlightClass} onClick={this.props.onLowlight} >
              <i className="fa fa-pencil" />
            </div>

            <span className={draftedClass} onClick={this.props.onDraftedToggle}>Hide drafted</span>

            <span className={projectionsClass} onClick={this.props.onProjectionsToggle}>Show projections</span>

            {
              this.props.user !== null ?
                <span className="nav-button editRankings hidden-xs">Edit Rankings</span>
              :
                <span className="nav-button editRankings disabled hidden-xs" data-toggle="tooltip" data-placement="bottom" title="Gotta log in to do this">Edit Rankings</span>
            }

            <UserMenu user={this.props.user}/>

          </div>
        </div>

      </div>
    )
  }
});