express = require 'express'
newrelic = require 'newrelic'
path = require 'path'
_ = require 'underscore'
players = require './util/players'
app = express()

port = Number(process.env.PORT || 5000)

app.use express.static(path.join(__dirname, '/public'))
app.use(require("connect-assets")())
app.use((req, res, next) ->
  res.locals._ = require 'underscore'
  next()
)

app.get '/', (req, res) ->
  res.render 'index.jade', { players: players }

app.get '/import', (req, res) ->
  res.render 'import.jade'

app.listen port, () ->
  console.log "Listening on port #{port}"

# Routes
# 1. reorder player
# 2. annotate player