_ = require 'underscore'
User = require '../models/user'
defaultRankings = require '../util/players'

formatResponseJSON = (err, obj) ->
  if(!err?) then return obj
  if(err instanceof Array) then return { errors: err }
  return { errors: [err] }

exports.init = (app, passport) ->

  app.get '/', (req, res) ->
    loggedIn = req.user?
    players = req.user?.rankings or defaultRankings
    res.render 'index.jade', { loggedIn: loggedIn, players: players, error: req.flash('error') }

  app.post '/register', (req, res) ->
    name = req.body.name
    email = req.body.email
    password = req.body.password

    User.createUser name, email, password, (errors, user) =>
      if(errors)
        res.send(formatResponseJSON errors)
      else
        req.login user, (err) =>
          res.send formatResponseJSON err, user

  app.post "/login", passport.authenticate("local",
    successRedirect: "/"
    failureRedirect: "/"
    failureFlash: true
  )

  app.get "/logout", (req, res) ->
    req.logout()
    res.redirect "/"

  app.post '/rankings', (req, res) ->
    user = req.user
    players = req.body.rankings
    newRankings = _.map players, (id) ->
      _.findWhere user.rankings, { Id: id.toString() }

    _.each newRankings, (el, index) ->
      rank = index + 1
      el.Rank = rank.toString()

    user.rankings = newRankings
    user.save (err) =>
      res.send formatResponseJSON(err, { success:true })

  # TODO: address race conditions caused if this
  # method is called multiple times in rapid succession
  app.post '/updatePlayer', (req, res) ->
    user = req.user
    playerId = req.body.playerId
    key = req.body.key
    value = req.body.value

    partition = _.partition user.rankings, (p) ->
      p.Id is playerId.toString()
    player = partition[0][0]
    rankings = partition[1]

    if value?
      player[key] = value
    else
      delete player[key]
    rankings.push player
    user.rankings = rankings

    User.findByIdAndUpdate user.id, { $set: { rankings: rankings }}, (err, user) ->
      res.send formatResponseJSON(err, { success:true })


  app.get '/import', (req, res) ->
    res.render 'import.jade'