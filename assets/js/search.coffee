class Search
  constructor: (@$el) ->
    @$el.on 'keyup', @search

  search: =>
    searchText = @$el.val().toLowerCase()
    if searchText is ''
      $('.player').show()
    else
      $('.positional .player, .absolute .player').hide()
      $( ".player[data-name*='#{searchText}']" ).show()