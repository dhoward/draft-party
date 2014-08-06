_ = require 'underscore'
User = require '../models/user'
defaultRankings = require '../util/players'

formatResponseJSON = (err, obj) ->
  if(!err?) then return obj
  if(err instanceof Array) then return { errors: err }
  return { errors: [err] }

exports.init = (app, passport) ->

  app.get '/', (req, res) ->
    players = req.user?.rankings or defaultRankings
    res.render 'index.jade', { players: players, error: req.flash('error') }

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
      res.send formatResponseJSON(err, true)

  app.get '/import', (req, res) ->
    res.render 'import.jade'

# exports.annotatePlayer