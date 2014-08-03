class PlayerToggle
  constructor: (@$el) ->
    @$el.on 'change', @updatePlayers

  updatePlayers: =>
    hide = @$el.prop 'checked'
    $('.player.taken').toggle !hide