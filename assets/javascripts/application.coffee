class App

  rankings: []
  highlighting: false
  lowLighting: false
  editing: false
  hidingDrafted: false
  showProjections: false

  constructor: (players) ->
    players = _.map players, (player) ->
      new Player player

    @rankings = new Rankings players
    @team = new Team

    taken = _.where players, { Owner: "me" }
    @team.addPlayer player for player in taken

  toggleHighlighting: =>
    @lowlighting = false
    @highlighting = !@highlighting
    stateObj =
      lowlighting: @lowlighting
      highlighting: @highlighting
    return stateObj

  toggleLowlighting: =>
    @highlighting = false
    @lowlighting = !@lowlighting
    stateObj =
      lowlighting: @lowlighting
      highlighting: @highlighting
    return stateObj

  toggleDrafted: =>
    @hidingDrafted = not @hidingDrafted

  toggleProjections: =>
    @showProjections = not @showProjections

DT = new App(DT_GLOBALS.allPlayers)
delete[DT_GLOBALS.allPlayers]

DT.util = { classNames: classNames };