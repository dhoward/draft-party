class Rankings
  constructor: ->
    @$editButton = $ '.editRankings'
    @$playersHolder = $ '.positional'
    @$editButton.on 'click', @onEditClick
    @editClass = 'btn-info'
    $('body').on 'Players.renderRankings', @onRenderRankings

  onEditClick: () =>
    activateEdit = !@$editButton.hasClass(@editClass)
    if activateEdit then @activateEditMode() else @onSaveRankings()

  activateEditMode: () =>
    @$editButton.blur()
    @$editButton.addClass @editClass
    @$editButton.text 'Save Rankings'
    @$playersHolder.addClass 'edit'

  onSaveRankings: =>
    @$editButton.blur()
    @$editButton.removeClass @editClass
    @$editButton.text 'Saving...'
    @$playersHolder.addClass 'disabled'

    @newRankings = @getRankings()
    @saveRankings @newRankings

  saveRankings: (rankings) =>
    order = _.pluck rankings, '_id'
    data =
      rankings: order
    $.post '/rankings', data, @onSaveSuccess

  onSaveSuccess: (response) =>
    if response.errors?
      #TODO: show error
    else
      @$editButton.text 'Edit Rankings'
      @$playersHolder.removeClass('edit').removeClass('disabled')
      @reorderPlayers @newRankings

  getRankings: () =>
    newPlayers = []
    @$playersHolder.find('.player').each (i, el) =>
      $el = $(el)
      val = $el.find('input').val()
      playerId = $el.attr 'data-id'
      newPlayers.push { rank: val, _id: playerId }

    sortedPlayers = _.sortBy newPlayers, (player) ->
      parseInt player.rank, 10
    sortedPlayers

  reorderPlayers: (@order) =>
    newOrder = _.map @order, (player) ->
      _.findWhere window.allPlayers, { Id: player._id }

    _.each newOrder, (el, index) ->
      rank = index + 1
      el.Rank = rank.toString()

    @renderRankings(newOrder)
    window.allPlayers = newOrder

  onRenderRankings: (e) =>
    window.allPlayers = _.sortBy window.allPlayers, (p) -> parseInt(p.Rank, 10)
    @renderRankings window.allPlayers

  renderRankings: (players) =>
    positions = _.groupBy(players, "Position")
    for name, posPlayers of positions
      @renderPosition name, posPlayers
    $('body').trigger 'Players.rendered'

  renderPosition: (name, players) =>
    $position = $("[data-position-name=#{name}]")
    $table = $position.find('tbody')
    $position.find('tr.player').remove()
    _.each players, (player) =>
      html = @playerHtml player
      $table.append $(html)

  playerHtml: (player) ->
    nameData = player["Player Name"].toLowerCase()
    annotation = player['annotation']
    state = player['state']

    classes = "player breadcrumb"
    if annotation? then classes += " #{annotation}"
    if state? then classes += " taken"
    if state is 'mine' then classes += " mine"

    hideDrafted = $('[name="playerToggle"]').prop 'checked'
    display = if (state? and hideDrafted) then 'none' else 'default'

    """<tr data-name="#{nameData}" data-position=#{player["Position"].toLowerCase()} data-id=#{player["Id"]} class="#{classes}" style="display:#{display}">
        <td class="col-md-1 rank">
          <div class="ranking">#{player["Rank"]}</div>
          <input value=#{player["Rank"]} class="rankingInput">
        </td>
        <td class="name">#{player["Player Name"]}</td>
       </tr>"""
