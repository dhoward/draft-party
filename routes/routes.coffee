players = require '../util/players'

exports.init = (app) ->

  app.get '/', (req, res) ->
    res.render 'index.jade', { players: players }

  app.get '/import', (req, res) ->
    res.render 'import.jade'

# exports.rankPlayers

# exports.annotatePlayer