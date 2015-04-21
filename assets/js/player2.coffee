class Player
  constructor: (player) ->
    @Id = player.Id
    @["Player Name"] = player["Player Name"]
    @Position = player.Position
    @Rank = player.Rank
    @Owner = player.Owner
    @Highlighted = player.Highlighted
    @Lowlighted = player.Lowlighted

  updateOwner: =>
    if !@owner?
      @owner = "other"
    else if @owner is "other"
      @owner = "me"
    else
      @owner = null

  toggleHighlighted: =>
    @Highlighted = not @Highlighted
    @Lowlighted = no

  toggleLowlighted: =>
    @Lowlighted = not @Lowlighted
    @Highlighted = no

  #TODO: implement save method
  #save: ->