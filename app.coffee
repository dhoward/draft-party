# Modules

express = require 'express'
newrelic = require 'newrelic'
path = require 'path'
flash = require 'connect-flash'
bodyParser = require 'body-parser'
cookieParser = require 'cookie-parser'
cookieSession = require 'cookie-session'
favicon = require 'serve-favicon'
mongoose = require 'mongoose'
passport = require 'passport'
LocalStrategy = require('passport-local').Strategy
_ = require 'underscore'
routes = require './routes/routes'
User = require './models/user'
app = express()


# Middleware

app.use favicon(__dirname + '/public/images/favicon.ico')
app.use require("stylus").middleware(path.join(__dirname, "public"))
app.use express.static(path.join(__dirname, '/public'))
app.use bodyParser()
app.use cookieParser('draft')
app.use cookieSession { keys: ['draft'] }
app.use passport.initialize()
app.use passport.session()
app.use flash()
app.use(require("connect-assets")())
app.use((req, res, next) ->
  res.locals._ = require 'underscore'
  res.locals.user = req.user
  next()
)

# Passport setup

passport.use(new LocalStrategy(
  (username, password, done) ->
    User.findOne({ email: username }, (err, user) ->
      if (err)
        return done(err)
      if (!user)
        return done(null, false, { message: 'Incorrect username' })
      if (!user.validPassword(password))
        return done(null, false, { message: 'Incorrect password' })
      return done(null, user)
    )
))

passport.serializeUser (user, done) ->
  done null, user._id

passport.deserializeUser (id, done) ->
  User.findById id, (err, user) ->
    done err, user


# Routes

routes.init app, passport


# Mongo setup

mongo_uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/draft'
mongoose.connect mongo_uri
db = mongoose.connection
db.on 'error', console.error.bind(console, 'connection error:')
db.once 'open', () ->
  console.log "Database connection established"


# Start server

port = Number(process.env.PORT || 5000)
app.listen port, () ->
  console.log "Listening on port #{port}"
