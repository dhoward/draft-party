var Instructions = React.createClass({

  componentDidMount: function() {
    if(this.props.user === null) {
      this.showModal();
    }

    window.addEventListener('DT.showInstructions', this.showModal);
  },

  showModal: function() {
    $("#instructions").modal();
  },

  render: function() {
    return (
      <div id="instructions" className="modal fade">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h3 className="modal-title">Welcome to the <span className="logo">Draft Party!</span></h3>
            </div>
            <div className="modal-body">

              <h4 className="highlighted">Drag and drop players to customize your rankings</h4>
              <p>Or double-click a ranking to enter a new one manually. Either way, they&apos;ll be saved if you&apos;re logged in.</p>

              <h4 className="highlighted">During the draft, click on a player to mark him as taken</h4>
              <p>Or double-click him to mark him as yours. He&apos;ll show up in your team on the right hand side.</p>

              <h4 className="highlighted">Use the pencil icons to highlight players in yellow or red</h4>
              <p>If you&apos;re still not happy there are more settings in the main menu.</p>

            </div>
            <div className="modal-footer">
              <button className="btn btn-default" type="button" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
