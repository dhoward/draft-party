class ViewToggle
  constructor: (@$el) ->
    @mainContent = $ '.main-content'
    @$el.on 'change', @updateView

  updateView: =>
    positional = @$el.prop 'checked'
    @mainContent.toggleClass 'show-positional', positional
    @mainContent.toggleClass 'show-absolute', !positional