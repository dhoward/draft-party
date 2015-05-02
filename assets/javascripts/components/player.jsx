var Player = React.createClass({

  getDefaultProps: function() {
    return {
      player: {},
      showAnnotations: true
    }
  },

  componentDidUpdate: function() {
    var _this = this;
    console.log("updating");
    if(DT.showProjections) {
      this.activateTooltip();
    } else {
      this.deactivateTooltip();
    }
  },

  activateTooltip: function() {
    $(this.getDOMNode()).popover({
      html : true,
      container: 'body',
      trigger: 'hover',
      content: this.statsHTML,
      title: function() { return 'Projected Stats' }
    })
  },

  deactivateTooltip: function() {
    $(this.getDOMNode()).popover('destroy');
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

  statsHTML: function() {
    rows = "";
    player = this.props.player;

    for (var stat in player.Stats) {
      if (player.Stats.hasOwnProperty(stat)) {
        rows += "<tr key={stat}><td><div style='width:100px'>"+stat+"</div></td><td>"+player.Stats[stat]+"</td></tr>";
      }
    }

    return "<table><tbody>" + rows + "</tbody></table>";
  },

  handleMouseDown: function() {
    this.props.onMouseDown(this.props.player);
  },

  render: function() {

    var classes = "";
    var player = this.props.player;

    if(this.props.showAnnotations) {
      classes = DT.util.classNames({
        'taken': player.Owner !== null && typeof player.Owner !== "undefined",
        'mine': player.Owner === "me",
        'highlighted': player.Attribution == "highlighted",
        'lowlighted': player.Attribution == "lowlighted",
        'dragging': player.dragging
      });
    }

    if(player.Owner != null && DT.hidingDrafted) {
      return null;
    }

    return (
      <tr
        data-id={player["Id"]}
        data-rank={player["Rank"]}
        className={classes}>
        <td className="col-md-1 rank" onMouseDown={this.handleMouseDown}>{this.props.label}</td>
        <td className="name" data-position={this.props.code} onClick={this.updateState}>{player['Player Name']}</td>
      </tr>
    );
  }
});