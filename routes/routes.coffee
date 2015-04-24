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

  app.post '/login', (req, res, next) ->
    passport.authenticate('local', (err, user, info) ->
      if err then return next(err)
      else if !user then return res.send formatResponseJSON info.message
      else
        req.logIn user, (err) ->
          if err
            return next(err)
          res.send user
    ) req, res, next
    return


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

  app.post '/updatePlayer', (req, res) ->
    user = req.user
    player = req.body

    rankings = _.reject user.rankings, (p) ->
      p.Id is player["Id"].toString()

    rankings.push player
    user.rankings = rankings

    User.findByIdAndUpdate user.id, { $set: { rankings: rankings }}, (err, user) ->
      res.send formatResponseJSON(err, player)

  app.get '/resetPlayers', (req, res) ->
    user = req.user
    rankings = _.map user.rankings, (p) ->
      delete p.state
      return p

    User.findByIdAndUpdate user.id, { $set: { rankings: rankings }}, (err, user) ->
      res.send formatResponseJSON(err, { players: user.rankings })


  app.get '/import', (req, res) ->
    res.render 'import.jade'