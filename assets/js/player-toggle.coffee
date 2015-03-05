class PlayerToggle
  constructor: (@$el) ->
    @$el.on 'click', @updatePlayers

  updatePlayers: =>
    @$el.toggleClass('on')
    hide = @$el.hasClass 'on'
    $('.player.taken').toggle !hide
    @$el.trigger 'Players.hide', hide