class Team
  constructor: (@$el) ->
    $('body').on 'Team.update', @updateTeam

  updateTeam: (e, {name, id, position, mine}) =>
    if !mine
      @clearSlot id
    else
      @fillSlot {name, id, position}

  clearSlot: (id) =>
    $player = @$el.find "[data-id='#{id}']"
    $player.removeAttr('data-id').find('.name').empty()

  fillSlot: ({name, id, position}) =>
    $row = @getRow {name, id, position}
    $row.attr('data-id', id).find('.name').text name

  getRow: ({name, id, position}) =>
    $row = @nextOpen position
    if !$row.length and @flexEligible(position)
      $row = @nextOpen 'flx'
    if !$row.length
      $row = @nextOpen 'bn'
    $row

  flexEligible: (position) ->
    position is 'rb' or position is 'wr'

  nextOpen: (position) =>
    @$el.find("tr[data-position='#{position}']:not([data-id])").first()