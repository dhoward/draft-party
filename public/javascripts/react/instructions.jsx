var Instructions = React.createClass({
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
              <h3 className="modal-title">Welcome to DraftTracker, your online cheat sheet.</h3>
            </div>
            <div className="modal-body">
              <h4 className="highlighted">First, create an account to customize your rankings</h4>
              <p>Or, you know, don't.</p>
              <h4 className="highlighted">During the draft, click on a player to mark him as taken</h4>
              <p>Or double-click him to say that he's on your team.  He'll then show up in your team on the right hand side.</p>
              <h4 className="highlighted">Drag and drop the players on your team to rearrange your lineup</h4>
              <p>Or just leave it alone and your team will autofill based on position</p>
              <h4 className="highlighted">The stuff in the toolbar is self-explanatory</h4>
              <p>Except maybe the pencil icons. You can use them to highlight players in the list, if you so choose.</p>
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
