class Player
  constructor: (player) ->
    @Id = player.Id
    @["Player Name"] = player["Player Name"]
    @Position = player.Position
    @Rank = player.Rank
    @Owner = player.Owner
    @Attribution = player.Attribution
    @Stats = player.Stats

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

    $.post '/updatePlayer', @toJSON()

  toJSON: ->
    Id: @Id
    "Player Name": @["Player Name"]
    Position: @Position
    Rank: @Rank
    Owner: @Owner
    Attribution: @Attribution
