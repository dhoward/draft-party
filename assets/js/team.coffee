class Team
  constructor: (@$el) ->
    $('body').on 'Team.update', @updateTeam
    @$el.on 'mousedown', '.player[data-id] .name', @onPlayerClick

  updateTeam: (e, {name, id, position, mine}) =>
    if !mine
      @clearRow id
    else
      @fillOpenRow {name, id, position}

  clearRow: (id) =>
    $player = @$el.find "[data-id='#{id}']"
    $player.removeAttr('data-id').find('.name').empty()

  fillOpenRow: ({name, id, position}) =>
    $row = @getOpenRow position
    @fillRow $row, name, id

  fillRow: ($row, name, id) =>
    $row.attr('data-id', id).find('.name').text name

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
    else return false

  nextOpen: (position) =>
    @$el.find("tr[data-position='#{position}']:not([data-id])").first()

  onPlayerClick: (e) =>
    @$dragPlayer = $(e.currentTarget)
    @dragPos = @$dragPlayer.closest('.player').attr('data-position')
    @$dropTarget = null
    playerOffset = @$dragPlayer.offset()
    @$dragMarker = @$dragPlayer.clone().addClass 'drag-marker'
    @$dragMarker.offset playerOffset

    offsetX = e.pageX - playerOffset.left
    offsetY = e.pageY - playerOffset.top
    @dragOffset = { top: offsetY, left: offsetX }

    $('body').append @$dragMarker
    @$dragPlayer.attr('data-name', @$dragPlayer.text()).empty()

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
    for player in @$el.find '.player .name'
      $player = $(player)
      top = $player.offset().top
      if centerY > top and centerY < top + $player.height()
        pos = $player.closest('.player').attr('data-position')
        if @validRow(@dragPos, pos) then @$dropTarget = $player

  endPlayerDrag: =>
    $('body').off 'mousemove.playerdrag'
    $('body').off 'mouseup.playerdrag'
    @$dragPlayer.text @$dragPlayer.attr('data-name')
    @$dragPlayer.removeAttr 'data-name'
    @$dragMarker.remove()
    @$dragMarker = null

    return unless @$dropTarget?
    @fillRow @$dropTarget.closest('tr'), 'dropped'
