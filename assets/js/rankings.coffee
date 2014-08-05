class Rankings
  constructor: ->
    @$editButton = $ '.editRankings'
    @$playersHolder = $ '.positional'
    @$editButton.on 'click', @onEditClick
    @editClass = 'btn-info'

  onEditClick: () =>
    activateEdit = !@$editButton.hasClass(@editClass)
    if activateEdit then @activateEditMode() else @saveRankings()

  activateEditMode: () =>
    @$editButton.blur()
    @$editButton.addClass @editClass
    @$editButton.text 'Save Rankings'
    @$playersHolder.addClass 'edit'

  saveRankings: =>
    @$editButton.blur()
    @$editButton.removeClass @editClass
    @$editButton.text 'Edit Rankings'
    @$playersHolder.removeClass 'edit'

    rankings = @getRankings()
    @reorderPlayers rankings

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

  renderRankings: (players) =>
    positions = _.groupBy(players, "Position")
    for name, players of positions
      @renderPosition name, players

  renderPosition: (name, players) =>
    $position = $("[data-position-name=#{name}]")
    $table = $position.find('tbody')
    $position.find('tr.player').remove()
    _.each players, (player) =>
      html = @playerHtml player
      $table.append $(html)

  playerHtml: (player) ->
    nameData = player["Player Name"].toLowerCase()

    """<tr data-name=#{nameData} data-position=#{player["Position"].toLowerCase()} data-id=#{player["Id"]} class="player breadcrumb">
        <td class="col-md-1 rank">
          <div class="ranking">#{player["Rank"]}</div>
          <input value=#{player["Rank"]} class="rankingInput">
        </td>
        <td class="name">#{player["Player Name"]}</td>
       </tr>"""
