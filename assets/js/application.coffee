#= require_tree .

class App

  rankings: []
  highlighting: false
  lowLighting: false
  editing: false
  hidingDrafted: false

  constructor: (players) ->
    @rankings = new Rankings players

  updatePlayer: (player) ->
    @rankings.savePlayer player

  updateRankings: () ->

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
    console.log "toggling"
    @hidingDrafted = not @hidingDrafted

  rankPlayer: (player, rank) =>
    @rankings.rankPlayer player, rank

DT = new App(DT_GLOBALS.allPlayers)
delete[DT_GLOBALS.allPlayers]