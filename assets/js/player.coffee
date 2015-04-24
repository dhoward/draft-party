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
    json =
      Id: @Id
      "Player Name": @["Player Name"]
      Position: @Position
      Rank: @Rank

    if @Owner?.length then json.Owner = @Owner
    if @Attribution?.length then json.Attribution = @Attribution

    json
