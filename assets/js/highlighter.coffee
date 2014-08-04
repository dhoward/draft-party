class Highlighter
  constructor: (@$highlightButton, @$lowlightButton) ->
    @$highlightButton.attr 'data-event', 'Players.highlight'
    @$lowlightButton.attr 'data-event', 'Players.lowlight'
    @$highlightButton.on 'click', @onButtonClick
    @$lowlightButton.on 'click', @onButtonClick

  onButtonClick: (e) =>
    $button = $(e.currentTarget)
    activate = !$button.hasClass('on')
    @$highlightButton.removeClass 'on'
    @$lowlightButton.removeClass 'on'
    $button.toggleClass 'on', activate
    $('body').trigger $button.attr('data-event'), activate
    return false