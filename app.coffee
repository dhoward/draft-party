express = require 'express'
path = require 'path'
_ = require 'underscore'
players = require './util/players'
app = express()

port = Number(process.env.PORT || 5000)

app.use express.static(path.join(__dirname, '/public'))

app.get '/', (req, res) ->
  positions = _.groupBy(players, "Position")
  res.render 'index.jade', { players: players, positions: positions }

app.get '/import', (req, res) ->
  res.render 'import.jade'

app.listen port, () ->
  console.log "Listening on port #{port}"