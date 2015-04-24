var Player = React.createClass({

  getDefaultProps: function() {
    return {
      player: {}
    }
  },

  getInitialState: function() {
    return {
      owner: null
    }
  },

  updateState: function() {
    player = this.props.player;

    // TODO: do this in the player model and save from there
    if(DT.highlighting) {
      player.toggleHighlighted();
    } else if(DT.lowlighting) {
      player.toggleLowlighted();
    } else {
      player.updateOwner();
    }

    DT.rankings.updatePlayer(player);
  },

  handleMouseDown: function() {
    this.props.onMouseDown(this.props.player);
  },

  render: function() {

    var cx = React.addons.classSet;
    var classes = cx({
      'taken': this.props.player.owner !== null && typeof this.props.player.owner !== "undefined",
      'mine': this.props.player.owner === "me",
      'highlighted': this.props.player.Highlighted,
      'lowlighted': this.props.player.Lowlighted
    });

    if(this.props.player.owner != null && DT.hidingDrafted) {
      return null;
    }

    return (
      <tr
        onMouseDown={this.handleMouseDown}
        data-id={this.props.player["Id"]}
        data-rank={this.props.player["Rank"]}
        className={classes}>
        <td className="col-md-1 rank">{this.props.label}</td>
        <td className="name" data-position={this.props.code} onClick={this.updateState}>{this.props.player['Player Name']}</td>
      </tr>
    );
  }
});