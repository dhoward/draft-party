var Player = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  _hideTimer: null,

  getDefaultProps: function() {
    return {
      player: {},
      showAnnotations: true,
      onMouseDown: function(){}
    }
  },

  getInitialState: function() {
    return {
      editing: false,
      newRank: null
    }
  },

  componentDidMount: function() {
    this.checkProjections();
    this.checkHide(this.props.hideIfTaken);
  },

  componentDidUpdate: function() {
    console.log("updating");
    this.checkProjections();
  },

  componentWillReceiveProps: function(newProps) {
    if(this.props.hideIfTaken != newProps.hideIfTaken) {
      this.checkHide(newProps.hideIfTaken);
    }
  },

  checkProjections: function() {
    if(DT.shouldShowProjections()) {
      this.activateTooltip();
    } else {
      this.deactivateTooltip();
    }
  },

  activateTooltip: function() {
    if(this.props.player.Stats) {
      $(this.getDOMNode()).popover({
        html : true,
        container: 'body',
        trigger: 'hover',
        content: this.statsHTML,
        title: function() { return 'Projected Stats' }
      });
    }
  },

  deactivateTooltip: function() {
    $(this.getDOMNode()).popover('destroy');
  },

  updateState: function() {
    this.props.player.updateState();

    this.dontHide();
    this.checkHide(this.props.hideIfTaken);

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

  promptRerank: function() {
    this.setState({ editing: true });
  },

  onEdit: function(e) {
    if(e.key === "Enter") {
      this.setState({ editing: false });

      var rank = parseInt(this.state.newRank, 10);
      DT.rankings.rankPlayer(this.props.player, rank);

      var e = new CustomEvent('DT.update', { bubbles: true });
      this.getDOMNode().dispatchEvent(e);
    }
  },

  checkHide: function(shouldHide) {
    if(this.props.player.isTaken && this.props.player.isTaken() && shouldHide) {
      this.prepareToHide();
    } else {
      this.dontHide();
    };
  },

  prepareToHide: function(){
    this._hideTimer != null ? clearTimeout(this._hideTimer) : null;

    var _this = this;
    this._hideTimer = setTimeout(function(){
      _this.setState({ hiding: true });
      _this._hideTimer = setTimeout(function(){
        _this.setState({ hidden: true });
      }, 500);
    }, 3000);
  },

  dontHide: function() {
    this.setState({ hiding: false, hidden: false });
    this._hideTimer != null ? clearTimeout(this._hideTimer) : null;
  },

  tableData: function(ref, html) {
    return <div className="player-td" ref={ref}><div className="player-padding">{html}</div></div>
  },

  render: function() {

    var classes = "";
    var player = this.props.player;

    if(this.props.showAnnotations) {
      classes = DT.util.classNames({
        'taken': player.isTaken(),
        'mine': player.isMine(),
        'highlighted': player.isHighlighted(),
        'lowlighted': player.isLowlighted(),
        'dragging': player.dragging,
        'hiding': this.state.hiding,
        'hidden': this.state.hidden
      });
    };

    return (
      <tr
        data-id={player["Id"]}
        data-rank={player["Rank"]}
        className={classes}>

        { this.state.editing ?
          <td className="col-md-1 rank">
            <div className="player-td">
              <input className="rankingInput" valueLink={this.linkState('newRank')} onKeyDown={this.onEdit} />
            </div>
          </td>
          :
          <td className="col-md-1 rank" onDoubleClick={this.promptRerank} onMouseDown={this.handleMouseDown}>{this.tableData('data1', this.props.label)}</td>
        }

        <td className="name" data-position={this.props.code} onClick={this.updateState}>{this.tableData('data2', player['Player Name'])}</td>

      </tr>
    );
  }
});