var PositionRanking = React.createClass({

  getDefaultProps: function() {
    return {
      label: "",
      players: []
    }
  },

  playerRows: function() {
    var players = this.props.players;
    var rows = [];
    for(var i=0; i < players.length; i++) {
      rows.push(<Player label={players[i]["Rank"]} player={players[i]} onUpdate={this.props.onUpdate} />)
    }
    return rows;
  },

  render: function() {
    return (
      <div className="col-md-2 col-sm-6 position-column">
        <table className="table table-bordered">
          <tr>
            <th colSpan="2">
              {this.props.label}
            </th>
          </tr>
          {this.playerRows()}
        </table>
      </div>
    )
  }
});