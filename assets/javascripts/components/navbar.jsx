var NavBar = React.createClass({

  componentDidMount: function() {
    $('.editRankings').tooltip();
  },

  render: function() {

    var nextPick = rankings.getNextPick();

    var highlightClass = DT.util.classNames({
      "nav-button first highlight yellow": true,
      "on": this.props.highlighting
    });

    var lowlightClass = DT.util.classNames({
      "nav-button lowlight red": true,
      "on": this.props.lowlighting
    });

    return (

      <div className="row navbar">

        <div className="col-sm-2 col-xs-12 logo">
          Draft Party
        </div>

        <div className="col-sm-2 hidden-xs picker">
          Picking: { nextPick }
        </div>

        <div className="col-sm-8 col-xs-12 pull-right">
          <div className="pull-right hidden-xs">

            <div className={highlightClass} onClick={this.props.onHighlight} >
              <i className="fa fa-pencil" />
            </div>

            <div className={lowlightClass} onClick={this.props.onLowlight} >
              <i className="fa fa-pencil" />
            </div>

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