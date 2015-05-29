class App

  rankings: []
  highlighting: false
  lowLighting: false
  editing: false

  constructor: (@user, players) ->

    players = _.map players, (player) ->
      new Player player

    @rankings = new Rankings players
    @loggedIn = @user?
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

  updateSettings: (settings) =>
    if @user?
      @user.settings = settings
      $.post '/settings', settings

  shouldHideDrafted: =>
    if !@user? then return false
    !@user.settings?.showDrafted

  shouldShowProjections: =>
    @user? and @user.settings?.showProjections
