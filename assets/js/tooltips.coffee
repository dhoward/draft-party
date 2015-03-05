class Tooltips
  constructor: (@$el) ->
    @toggleButton = $('form .projections')
    @toggleButton.on 'click', @toggleTooltips
    $('body').on 'Players.rendered', @updateTooltips

  toggleTooltips: =>
    @toggleButton.toggleClass('on')
    @updateTooltips()

  updateTooltips: =>
    activate = @toggleButton.hasClass 'on'
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