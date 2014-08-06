class PickCounter
  constructor: (@$el) ->
    @originalText = @$el.text()
    $('body').on 'Pick.update', @updateCounter

  updateCounter: =>
    count = $('.positional .taken').length
    text = ""
    if count is 0
      text = @originalText
    else
      pick = count+1
      text = "Currently drafting: #{pick}"
    @$el.text text