User = require '../models/user'
players = require '../util/players'

formatResponseJSON = (err, obj) ->
  if(!err?) then return obj
  if(err instanceof Array) then return { errors: err }
  return { errors: [err] }

exports.init = (app, passport) ->

  app.get '/', (req, res) ->
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

  app.get '/import', (req, res) ->
    res.render 'import.jade'

# exports.rankPlayers

# exports.annotatePlayer