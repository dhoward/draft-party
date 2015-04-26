var Player = React.createClass({

  getDefaultProps: function() {
    return {
      player: {}
    }
  },

  updateState: function() {
    this.props.player.updateState();

    this.checkAdded();
    this.checkRemoved();

    var e = new CustomEvent('DT.update', { bubbles: true });
    this.getDOMNode().dispatchEvent(e);
  },

  checkAdded: function() {
    player = this.props.player;
    if(player.Owner === "me") {
      var e = new CustomEvent('DT.team.addPlayer', { detail: { player: player }, bubbles: true });
      this.getDOMNode().dispatchEvent(e);
    }
  },

  checkRemoved: function() {
    player = this.props.player;
    if(player.Owner === null) {
      var e = new CustomEvent('DT.team.removePlayer', { detail: { player: player }, bubbles: true });
      this.getDOMNode().dispatchEvent(e);
    }
  },

  handleMouseDown: function() {
    this.props.onMouseDown(this.props.player);
  },

  render: function() {

    var cx = React.addons.classSet;
    var classes = cx({
      'taken': this.props.player.Owner !== null && typeof this.props.player.Owner !== "undefined",
      'mine': this.props.player.Owner === "me",
      'highlighted': this.props.player.Attribution == "highlighted",
      'lowlighted': this.props.player.Attribution == "lowlighted"
    });

    if(this.props.player.Owner != null && DT.hidingDrafted) {
      return null;
    }

    return (
      <tr
        data-id={this.props.player["Id"]}
        data-rank={this.props.player["Rank"]}
        className={classes}>
        <td className="col-md-1 rank" onMouseDown={this.handleMouseDown}>{this.props.label}</td>
        <td className="name" data-position={this.props.code} onClick={this.updateState}>{this.props.player['Player Name']}</td>
      </tr>
    );
  }
});