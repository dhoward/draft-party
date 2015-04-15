class Rankings

  constructor: (players) ->
    @players = _.map players, (player) -> new Player(player)

  setUpdateCallback: (@updateCallback) ->

  getPosition: (pos) ->
    positions = _.groupBy(@players, "Position")
    position = positions[pos]
    sorted = _.sortBy position, (player) ->
      parseInt player["Rank"], 10
    sorted

  updatePlayer: (player) => #update this api
    # data =
    #   playerId: id
    #   key: key

    # if activate then data.value = value

    @updateCallback() if @updateCallback?

    # $.post '/updatePlayer', player
