class Search
  constructor: (@$el) ->
    @$el.on 'keyup', @search

  search: =>
    searchText = @$el.val().toLowerCase()
    if searchText is ''
      $('.player').show()
    else
      $('.player').hide()
      $( ".player[data-name*='#{searchText}']" ).show()