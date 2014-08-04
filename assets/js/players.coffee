class Players
  constructor: (@$el) ->
    @$el.on 'click', '.player', @updateState
    $('body').on 'Players.highlight', @onHighlight
    $('body').on 'Players.lowlight', @onLowlight
    $('body').on 'Players.hide', @onHide
    @hidePlayers = false
    @highlightClass = null

  updateState: (e) =>
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
    else if taken
      $cells.addClass 'mine'
    else
      $cells.addClass 'taken'

    mine = $player.hasClass 'mine'
    @hidePlayer($player, id) if @hidePlayers and $player.hasClass('taken')

    $player.trigger 'Team.update', {name, id, position, mine}
    $player.trigger 'Pick.update'

  onHide: (e, hide) =>
    @hidePlayers = hide

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
    return true

  onHighlight: (e, activate) =>
    @highlightClass = if activate then 'highlighted' else null

  onLowlight: (e, activate) =>
    @highlightClass = if activate then 'lowlighted' else null
