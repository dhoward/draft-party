class Player
  constructor: (player) ->
    @Id = player.Id
    @["Player Name"] = player["Player Name"]
    @Position = player.Position
    @Rank = player.Rank
    @Owner = player.Owner
    @Attribution = player.Attribution
    @Stats = player.Stats

  isFlexEligible: =>
    @Position is "RB" or @Position is "WR"

  updateOwner: =>
    if !@Owner?
      @Owner = "other"
    else if @Owner is "other"
      @Owner = "me"
    else
      @Owner = null

  toggleHighlighted: =>
    @Attribution = if @Attribution is "highlighted" then null else "highlighted"

  toggleLowlighted: =>
    @Attribution = if @Attribution is "lowlighted" then null else "lowlighted"

  updateState: ->
    if DT.highlighting
      @toggleHighlighted()
    else if DT.lowlighting
      @toggleLowlighted()
    else
      @updateOwner()

    if DT.loggedIn
      $.post '/updatePlayer', @toJSON()

  isTaken: => @Owner?
  isMine: => @Owner is "me"
  isHighlighted: => @Attribution is "highlighted"
  isLowlighted: => @Attribution is "lowlighted"

  toJSON: ->
    json =
      Id: @Id
      "Player Name": @["Player Name"]
      Position: @Position
      Rank: @Rank
      Stats: @Stats

    if @Owner?.length then json.Owner = @Owner
    if @Attribution?.length then json.Attribution = @Attribution

    json
