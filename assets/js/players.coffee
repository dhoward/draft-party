class Players
  constructor: (@$el) ->
    @$el.on 'click', '.player', @updateState
    $('body').on 'Players.highlight', @onHighlight
    $('body').on 'Players.lowlight', @onLowlight
    $('body').on 'Players.hide', @onHide
    $('[name=tooltipToggle]').on 'change', @updateTooltips

    @hidePlayers = false
    @highlightClass = null

  updateTooltips: =>
    activate = $('[name=tooltipToggle]').prop('checked')
    if activate then @activateTooltips() else @deactivateTooltips()

  activateTooltips: =>
    @$el.find('.player').each (i, player) =>
      stats = @getStats $(player).attr('data-position')
      return unless stats.length

      $(player).popover
        html : true
        container: 'body'
        trigger: 'hover'
        content: => @tooltipHtml(stats, $(player).attr('data-id'))
        title: -> 'Projected Stats'

  deactivateTooltips: ->
    $('.player').popover('destroy')

  getStats: (pos) ->
    stats = []
    if pos is 'qb' then stats = ['Pass Yards', 'Pass TD', 'INT', 'Rush Yards', 'Rush TD']
    else if pos is 'rb' then stats = ['Rush Yards', 'Rush TD', 'Rec Yards', 'Rec TD']
    else if pos is 'wr' then stats = ['Rec Yards', 'Rec TD']
    else if pos is 'te' then stats = ['Rec Yards', 'Rec TD']
    stats

  tooltipHtml: (stats, id) ->
    $html = $('<table><tbody></tbody></table>')
    player = _.findWhere window.allPlayers, { Id: id }
    for stat in stats
      $html.append("<tr><td><div style='width:100px'>#{stat}</div></td><td>#{player[stat]}</td></tr>")
    $html

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

