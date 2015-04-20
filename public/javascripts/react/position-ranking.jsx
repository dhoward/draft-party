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
      rows.push(<Player key={i} label={players[i]["Rank"]} player={players[i]} onUpdate={this.props.onUpdate} onMouseDown={this.startDragPlayer} />)
    }
    return rows;
  },

  startDragPlayer: function(player) {
    this.draggedPlayer = player;
    $("body").on("mousemove", this.dragPlayer);
    $("body").on("mouseup", this.dropPlayer);
  },

  dragPlayer: function(event) {
    var _this = this;
    var players = _this.props.players;
    var draggedPlayer = _this.draggedPlayer;

    $(this.getDOMNode()).find("[data-rank]").each(function(index){
      var $row = $(this);
      var top = $row.offset().top;
      var bottom = top + $row.height();
      if(event.pageY > top && event.pageY < bottom) {
        players.splice(players.indexOf(draggedPlayer), 1);
        players.splice(index, 0, draggedPlayer);
        _this.forceUpdate();
        return false;
      }
    })
  },

  dropPlayer: function(player) {
    var index = this.props.players.indexOf(this.draggedPlayer);
    var newRank;

    if(index === 0) {
      newRank = this.props.players[1]["Rank"] - 1;
    } else {
      newRank = this.props.players[index-1]["Rank"] + 1;
    }

    newRank = Math.max(newRank, 1);
    DT.rankPlayer(this.draggedPlayer, newRank);

    this.draggedPlayer = null;
    $("body").off("mousemove");
    $("body").off("mouseup");
  },

  render: function() {
    return (
      <div className="col-md-2 col-sm-6 position-column">
        <table ref="table" className="table table-bordered">
          <tbody>
            <tr>
              <th colSpan="2">
                {this.props.label}
              </th>
            </tr>
            {this.playerRows()}
          </tbody>
        </table>
      </div>
    )
  }
});