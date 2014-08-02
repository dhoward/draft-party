express = require 'express'
path = require 'path'
app = express()

port = Number(process.env.PORT || 5000)

app.use express.static(path.join(__dirname, '/public'))

app.get '/', (req, res) ->
  res.render 'index.jade'

app.get '/import', (req, res) ->
  res.render 'import.jade'

app.listen port, () ->
  console.log "Listening on port #{port}"