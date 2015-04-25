#= require_tree .

class App

  rankings: []
  highlighting: false
  lowLighting: false
  editing: false
  hidingDrafted: false

  constructor: (players) ->
    @rankings = new Rankings players

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

DT = new App(DT_GLOBALS.allPlayers)
delete[DT_GLOBALS.allPlayers]