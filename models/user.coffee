mongoose = require 'mongoose'
Schema = mongoose.Schema
crypto = require 'crypto'
defaultRankings = require '../util/players'

userSchema = mongoose.Schema
  name: String
  email: String
  password: String
  rankings: [ Schema.Types.Mixed ]
  createDate: { type: Date, default: Date.now }


userSchema.methods.validPassword = (attempt) ->
  shasum = crypto.createHash 'sha1'
  shasum.update attempt
  hashedPassword = shasum.digest('hex')
  if(this.password is hashedPassword) then return true else return false


userSchema.statics.emailTaken = (email, callback) ->
  users = this.count { email: email }, (err, users) ->
    callback(users isnt 0)


userSchema.statics.createUser = (name, email, password, callback) ->
  this.emailTaken email, (taken) =>
    if taken
      callback [{ email: "That email address has been taken" }]
    else
      this.saveNewUser name, email, password, callback

userSchema.statics.saveNewUser = (name, email, password, callback) ->
    shasum = crypto.createHash 'sha1'
    shasum.update password
    hashedPassword = shasum.digest 'hex'
    this.create { name: name, email: email, password: hashedPassword, rankings: defaultRankings }, (err, user) ->
      callback err, user

module.exports = mongoose.model "User", userSchema