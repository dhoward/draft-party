class Rankings

  constructor: (players) ->
    players = _.map players, (player) -> new Player(player)
    @players = @sortPlayers players

  getPosition: (pos) ->
    positions = _.groupBy(@players, "Position")
    position = positions[pos]
    sorted = @sortPlayers position

  sortPlayers: (players) ->
    sorted = _.sortBy players, (player) ->
      parseInt player["Rank"], 10
    sorted

  rankPlayer: (ranked, rank) =>
    ranked["Rank"] = rank;
    rank-- #rank is 1-based, index is 0-based
    players = _.reject @players, (player) ->
      player["Id"] is ranked["Id"]
    players.splice rank, 0, ranked
    @players = players

    @updateRankings()

    ranksArray = _.pluck @players, "Id"

    if DT_GLOBALS.loggedIn
      $.post '/rankings', { rankings: ranksArray }

  updateRankings: (players) =>
    for player, index in @players
      player["Rank"] = index + 1

  getNextPick: () =>
    players = _.filter @players, (player) ->
      player["Owner"]?
    players.length + 1