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

  onHighlight: function(highlighting) {
    var newState = DT.toggleHighlighting();
    this.setState(newState);
  },

  onLowlight: function(lowlighting) {
    var newState = DT.toggleLowlighting();
    this.setState(newState);
  },

  toggleDrafted: function() {
    console.log("toggle drafted");
    DT.toggleDrafted();
    this.forceUpdate();
  },

  render: function() {
    rankings = DT.rankings;

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
            <div className="positional">
              <PositionRanking label="QB" players={rankings.getPosition("QB")} />
              <PositionRanking label="RB" players={rankings.getPosition("RB")} />
              <PositionRanking label="WR" players={rankings.getPosition("WR")} />
              <PositionRanking label="TE" players={rankings.getPosition("TE")} />
              <PositionRanking label="K" players={rankings.getPosition("K")} />
              <PositionRanking label="DEF" players={rankings.getPosition("DEF")} />
            </div>
          </div>
        </div>

        <Team />

        <Instructions user={this.state.user}/>

        <UserDialog />

      </div>
    )
  }
})