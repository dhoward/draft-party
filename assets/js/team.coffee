class Team
  constructor: (@players = []) ->
    @MAX_QBS = 1
    @MAX_RBS = 2
    @MAX_WRS = 2
    @MAX_TES = 1
    @MAX_FLX = 1
    @MAX_KS = 1
    @MAX_DEFS = 1
    @MAX_BENCH = 6

    @buildPositions()

  addPlayer: (player) ->
    @players.push player
    @slotPlayer player

  slotPlayer: (player) ->
    addPlayerFunc = "add#{player.Position.toUpperCase()}"
    @[addPlayerFunc] player

  buildPositions: ->
    @quarterbacks = []
    @runningbacks = []
    @widereceivers = []
    @tightends = []
    @flex = []
    @kickers = []
    @defenses = []
    @bench = []
    @slotPlayer player for player in @players

  addPositionPlayer: (player, list, max, flexEligible) ->
    if list.length < max then list.push player
    else if flexEligible then @addFlex player
    else if @bench.length < @MAX_BENCH then @addBench player

  addQB: (player) -> @addPositionPlayer player, @quarterbacks, @MAX_QBS, player.isFlexEligible()
  addRB: (player) -> @addPositionPlayer player, @runningbacks, @MAX_RBS, player.isFlexEligible()
  addWR: (player) -> @addPositionPlayer player, @widereceivers, @MAX_WRS, player.isFlexEligible()
  addTE: (player) -> @addPositionPlayer player, @tightends, @MAX_TES, player.isFlexEligible()
  addFlex: (player) -> @addPositionPlayer player, @flex, @MAX_FLX, false
  addK: (player) -> @addPositionPlayer player, @kickers, @MAX_KS, player.isFlexEligible()
  addDEF: (player) -> @addPositionPlayer player, @defenses, @MAX_DEFS, player.isFlexEligible()
  addBench: (player) -> @addPositionPlayer player, @bench, @MAX_BENCH, false

  removePlayer: (player) ->
    @players = _.reject @players, (p) -> return p.Id is player.Id
    @buildPositions()
