class Team
  constructor: (@$el) ->
    $('body').on 'Team.update', @updateTeam
    @$el.on 'mousedown', '.player[data-id]', @onPlayerClick
    $('.resetButton').on 'click', @resetTeam
    setTimeout @renderTeam, 10

  renderTeam: =>
    $players = $('.positional .mine').each (i, player) ->
      $player = $(player)
      name = $player.find('.name').text()
      id = $player.attr 'data-id'
      position = $player.attr 'data-position'
      mine = $player.hasClass 'mine'
      $player.trigger 'Team.update', {name, id, position, mine}

  resetTeam: =>
    @$el.find('[data-id]').removeAttr('data-id').removeAttr('data-true-position').empty()

  updateTeam: (e, {name, id, position, mine}) =>
    if !mine
      @clearRow id
    else
      @fillOpenRow name, id, position

  clearRow: (id) =>
    $player = @$el.find "[data-id='#{id}']"
    $player.removeAttr('data-id').removeAttr('data-true-position').empty()

  fillOpenRow: (name, id, position) =>
    $row = @getOpenRow position
    @fillRow $row, name, id, position

  fillRow: ($row, name, id, position) =>
    $row.attr('data-id', id).attr('data-true-position', position).text(name)

  getOpenRow: (position) =>
    $row = @nextOpen position
    if !$row.length and @flexEligible(position)
      $row = @nextOpen 'flx'
    if !$row.length
      $row = @nextOpen 'bn'
    $row

  flexEligible: (position) ->
    position is 'rb' or position is 'wr'

  validRow: (currPos, checkPos) ->
    if checkPos is 'bn'
      return true
    else if checkPos is currPos
      return true
    else if checkPos is 'flx' and @flexEligible(currPos)
      return true
    else if currPos is 'flx' and @flexEligible(checkPos)
      return true
    else return false

  nextOpen: (position) =>
    @$el.find("[data-position='#{position}']:not([data-id])").first()

  onPlayerClick: (e) =>
    @$initialPosition = $(e.currentTarget)
    @$dropTarget = @$initialPosition
    playerOffset = @$initialPosition.offset()
    @$dragMarker = @$initialPosition.clone().addClass 'drag-marker'
    @$dragMarker.offset playerOffset

    offsetX = e.pageX - playerOffset.left
    offsetY = e.pageY - playerOffset.top
    @dragOffset = { top: offsetY, left: offsetX }

    $('body').append @$dragMarker
    @clearRow @$initialPosition.attr('data-id')

    $('body').on 'mousemove.playerdrag', @onPlayerDrag
    $('body').on 'mouseup.playerdrag', @endPlayerDrag

  onPlayerDrag: (e) =>
    offset = { top: e.pageY - @dragOffset.top, left: e.pageX - @dragOffset.left }
    @$dragMarker.offset offset
    @checkPlayerCollision()

  checkPlayerCollision: =>
    markerLocation = @$dragMarker.offset()
    centerX = markerLocation.left + (@$dragMarker.width()/2)
    centerY = markerLocation.top + (@$dragMarker.height()/2)
    for player in @$el.find '.player'
      $player = $(player)
      top = $player.offset().top
      if centerY > top and centerY < top + $player.height()
        newPos = $player.attr('data-position')
        currentPos = @$dragMarker.attr 'data-true-position'
        @$dropTarget.removeClass('drop-target') if @$dropTarget?
        if @validRow(currentPos, newPos)
          @$dropTarget = $player
          @$dropTarget.addClass 'drop-target'
        else
          @$dropTarget = @$initialPosition

  endPlayerDrag: =>
    $('body').off 'mousemove.playerdrag'
    $('body').off 'mouseup.playerdrag'

    if @$dropTarget.text() isnt ''
      @fillOpenRow @$dropTarget.text(), @$dropTarget.attr('data-id'), @$dropTarget.attr('data-true-position')
    @fillRow @$dropTarget, @$dragMarker.text(), @$dragMarker.attr('data-id'), @$dragMarker.attr('data-true-position')
    @$dropTarget.removeClass 'drop-target'

    @$dragMarker.remove()
    @$dragMarker = null
