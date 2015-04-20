class Rankings

  constructor: (players) ->
    players = _.map players, (player) -> new Player(player)
    @players = @sortPlayers players

  setUpdateCallback: (@updateCallback) ->

  getPosition: (pos) ->
    positions = _.groupBy(@players, "Position")
    position = positions[pos]
    sorted = @sortPlayers position

  sortPlayers: (players) ->
    sorted = _.sortBy players, (player) ->
      parseInt player["Rank"], 10
    sorted

  updatePlayer: (player) => #update this api
    # data =
    #   playerId: id
    #   key: key

    # if activate then data.value = value

    @updateCallback() if @updateCallback?

    # $.post '/updatePlayer', player

  rankPlayer: (ranked, rank) =>
    ranked["Rank"] = rank;
    rank-- #rank is 1-based, index is 0-based
    players = _.reject @players, (player) ->
      player["Id"] is ranked["Id"]
    players.splice rank, 0, ranked
    @players = players

    @updateRankings()
    @updateCallback() if @updateCallback?

  updateRankings: (players) =>
    for player, index in @players
      player["Rank"] = index + 1