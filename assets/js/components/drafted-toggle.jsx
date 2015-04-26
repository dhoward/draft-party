var DraftedToggle = React.createClass({
  toggle: function() {
    console.log("eyyyy");

      // @$el.toggleClass('on')
      // hide = @$el.hasClass 'on'
      // $('.player.taken').toggle !hide
      // @$el.trigger 'Players.hide', hide
  },

  render: function() {
    return (
      <span className="hidden-xs metal linear drafted" onClick={this.toggle}>Hide drafted</span>
    );
  }
});
