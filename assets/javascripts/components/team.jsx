var Team = React.createClass({

  positionRows: function(label, players, max) {
    rows = [];
    for(var i=0; i< max; i++) {
      rows.push( <Player key={i} label={label} player={players[i]} showAnnotations={false} draggable={false} /> );
    }
    return rows;
  },

  qbRows: function() {
    team = this.props.team;
    return this.positionRows("QB", team.quarterbacks, team.MAX_QBS);
  },

  rbRows: function() {
    team = this.props.team;
    return this.positionRows("RB", team.runningbacks, team.MAX_RBS);
  },

  wrRows: function() {
    team = this.props.team;
    return this.positionRows("WR", team.widereceivers, team.MAX_WRS);
  },

  teRows: function() {
    team = this.props.team;
    return this.positionRows("TE", team.tightends, team.MAX_TES);
  },

  flxRows: function() {
    team = this.props.team;
    return this.positionRows("FLX", team.flex, team.MAX_FLX);
  },

  kRows: function() {
    team = this.props.team;
    return this.positionRows("K", team.kickers, team.MAX_KS);
  },

  defRows: function() {
    team = this.props.team;
    return this.positionRows("DEF", team.defenses, team.MAX_DEFS);
  },

  benchRows: function() {
    team = this.props.team;
    return this.positionRows("BN", team.bench, team.MAX_BENCH);
  },

  render: function() {
    return (
      <div className="col-md-2 col-xs-12 my-team">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th colSpan="2">
                Your Team
              </th>
            </tr>
          </thead>

          <tbody>
            {this.qbRows()}
            {this.rbRows()}
            {this.wrRows()}
            {this.teRows()}
            {this.flxRows()}
            {this.kRows()}
            {this.defRows()}
            {this.benchRows()}
          </tbody>
        </table>
      </div>
    );
  }
});

