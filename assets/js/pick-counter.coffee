class PickCounter
  constructor: (@$el) ->
    $('body').on 'Pick.update', @updateCounter

  updateCounter: =>
    count = $('.absolute .taken').length
    pick = count+1;
    @$el.text pick