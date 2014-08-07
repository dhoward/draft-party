class Players
  constructor: (@$el) ->
    @$el.on 'click', '.player', @updateState
    $('body').on 'Players.highlight', @onHighlight
    $('body').on 'Players.lowlight', @onLowlight
    $('body').on 'Players.hide', @onHide
    $('.resetButton').on 'click', @resetPlayers

    @hidePlayers = false
    @highlightClass = null

  resetPlayers: () ->
    $players = $('.positional .player')
    $players.removeClass('taken').removeClass('mine').show()
    $.getJSON '/resetPlayers', (response) ->
      window.allPlayers = response.players

  updateState: (e) =>

    #TODO: make this rely on an event rather that a class on positional
    return if $('.positional').hasClass('edit');

    $player = $(e.currentTarget)
    name = $player.find('.name').text()
    id = $player.attr 'data-id'
    position = $player.attr 'data-position'
    taken = $player.hasClass 'taken'
    mine = $player.hasClass 'mine'
    $cells = $("[data-id='#{id}']")

    if @highlightPlayer($player) then return

    if mine
      $cells.removeClass('taken').removeClass('mine')
      @updatePlayerObject $player.attr('data-id'), 'state', null, false
    else if taken
      $cells.addClass 'mine'
      @updatePlayerObject $player.attr('data-id'), 'state', 'mine', true
    else
      $cells.addClass 'taken'
      @updatePlayerObject $player.attr('data-id'), 'state', 'taken', true

    mine = $player.hasClass 'mine'
    @cancelHidePlayer id
    @hidePlayer($cells, id) if @hidePlayers and $player.hasClass('taken')

    $player.trigger 'Team.update', {name, id, position, mine}
    $player.trigger 'Pick.update'

  onHide: (e, hide) =>
    @hidePlayers = hide

  cancelHidePlayer: (id) =>
    timeout = "timeout#{id}"
    clearTimeout this[timeout] if this[timeout]?

  hidePlayer: ($player, id) =>
    timeout = "timeout#{id}"
    clearTimeout this[timeout] if this[timeout]?
    this[timeout] = setTimeout (->
      $player.fadeOut()
      return
    ), 3000

  highlightPlayer: ($player) =>
    return false unless @highlightClass?
    activate = !$player.hasClass(@highlightClass)
    $player.removeClass('highlighted').removeClass('lowlighted')
    $player.toggleClass @highlightClass, activate
    @updatePlayerObject $player.attr('data-id'), 'annotation', @highlightClass, activate
    return true

  onHighlight: (e, activate) =>
    @highlightClass = if activate then 'highlighted' else null

  onLowlight: (e, activate) =>
    @highlightClass = if activate then 'lowlighted' else null

  updatePlayerObject: (id, key, value, activate) =>
    player = _.findWhere window.allPlayers, { Id: id }
    if !activate
      delete player[key]
    else
      player[key] = value

    if App.loggedIn
      @savePlayerUpdate id, key, value, activate

  savePlayerUpdate: (id, key, value, activate) =>
    data =
      playerId: id
      key: key
    if activate then data.value = value

    $.post '/updatePlayer', data, (response) ->
      #TODO: actually handle response
      console.log response
