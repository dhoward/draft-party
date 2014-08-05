class PickCounter
  constructor: (@$el) ->
    $('body').on 'Pick.update', @updateCounter

  updateCounter: =>
    count = $('.positional .taken').length
    pick = count+1;
    @$el.text pick