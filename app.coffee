express = require 'express'
newrelic = require 'newrelic'
path = require 'path'
favicon = require 'serve-favicon'
_ = require 'underscore'
routes = require './routes/routes'
app = express()

port = Number(process.env.PORT || 5000)

app.use favicon(__dirname + '/public/images/favicon.ico')
app.use express.static(path.join(__dirname, '/public'))
app.use(require("connect-assets")())
app.use((req, res, next) ->
  res.locals._ = require 'underscore'
  next()
)

routes.init app

app.listen port, () ->
  console.log "Listening on port #{port}"
