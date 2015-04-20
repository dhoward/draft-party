var Draft = React.createClass({

  getInitialState: function() {
    return {
      highlighting: false,
      lowLighting: false,
      editing: false,
      hidingDrafted: false
    }
  },

  onUpdate: function() {
    this.forceUpdate();
  },

  componentDidMount: function() {
    DT.rankings.setUpdateCallback(this.onUpdate);
    // console.log(this.state.rankings);
  },

  onPlayerUpdate: function(player) {
    // console.log("updated!");
    // console.log(player);
    // this.forceUpdate();
  },

  onRankingsReorder: function() {

  },

  onRankingsUpdate: function() {

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
          <NavBar highlighting={this.state.highlighting} lowlighting={this.state.lowlighting}
                  onHighlight={this.onHighlight} onLowlight={this.onLowlight}
                  onDraftedToggle={this.toggleDrafted} onEditRankings={this.onEditRankings} />
        </div>


        <div className="row players">
          <div className="col-md-12">
            <div className="positional">
              <PositionRanking label="QB" players={rankings.getPosition("QB")} onUpdate={this.onPlayerUpdate} />
              <PositionRanking label="RB" players={rankings.getPosition("RB")} onUpdate={this.onPlayerUpdate} />
              <PositionRanking label="WR" players={rankings.getPosition("WR")} onUpdate={this.onPlayerUpdate} />
              <PositionRanking label="TE" players={rankings.getPosition("TE")} onUpdate={this.onPlayerUpdate} />
              <PositionRanking label="K" players={rankings.getPosition("K")} onUpdate={this.onPlayerUpdate} />
              <PositionRanking label="DEF" players={rankings.getPosition("DEF")} onUpdate={this.onPlayerUpdate} />
            </div>
          </div>
        </div>

        <Team />

        <Instructions />

      </div>
    )
  }
})