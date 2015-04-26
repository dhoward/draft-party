var Draft = React.createClass({

  getInitialState: function() {
    return {
      user: DT_GLOBALS.user,
      highlighting: false,
      lowLighting: false,
      editing: false,
      hidingDrafted: false
    }
  },

  componentDidMount: function() {
    window.addEventListener('DT.update', this.onUpdate);
    window.addEventListener('DT.team.addPlayer', this.addPlayerToTeam);
    window.addEventListener('DT.team.removePlayer', this.removePlayerFromTeam);
  },

  addPlayerToTeam: function(e) {
    DT.team.addPlayer(e.detail.player);
    this.onUpdate();
  },

  removePlayerFromTeam: function(e) {
    DT.team.removePlayer(e.detail.player);
    this.onUpdate();
  },

  onUpdate: function() {
    this.forceUpdate();
  },

  onHighlight: function(highlighting) {
    var newState = DT.toggleHighlighting();
    this.setState(newState);
  },

  onLowlight: function(lowlighting) {
    var newState = DT.toggleLowlighting();
    this.setState(newState);
  },

  toggleDrafted: function() {
    DT.toggleDrafted();
    this.forceUpdate();
  },

  render: function() {
    rankings = DT.rankings;
    nextPick = rankings.getNextPick();

    return (
      <div className="container-fluid main-content">

        <div className="row">
          <NavBar user={this.state.user}
                  highlighting={this.state.highlighting} lowlighting={this.state.lowlighting}
                  onHighlight={this.onHighlight} onLowlight={this.onLowlight}
                  onDraftedToggle={this.toggleDrafted} onEditRankings={this.onEditRankings} />
        </div>

        <div className="row players">
          <div className="col-md-12">
            Now picking: { nextPick }
          </div>
        </div>

        <div className="row players">
          <div className="col-md-12">
            <div className="positional">

              <div className="col-md-2 col-sm-6 position-column">
                <PositionRanking label="QB" players={rankings.getPosition("QB")} />
              </div>

              <div className="col-md-2 col-sm-6 position-column">
                <PositionRanking label="RB" players={rankings.getPosition("RB")} />
              </div>

              <div className="col-md-2 col-sm-6 position-column">
                <PositionRanking label="WR" players={rankings.getPosition("WR")} />
              </div>

              <div className="col-md-2 col-sm-6 position-column">
                <PositionRanking label="TE" players={rankings.getPosition("TE")} />
              </div>

              <div className="col-md-2 col-sm-6 position-column">
                <PositionRanking label="K" players={rankings.getPosition("K")} />
                <PositionRanking label="DEF" players={rankings.getPosition("DEF")} />
              </div>

              <Team team={DT.team} />

            </div>
          </div>
        </div>

        <Instructions user={this.state.user}/>

        <UserDialog />

      </div>
    )
  }
})