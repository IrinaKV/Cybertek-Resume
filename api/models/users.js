var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var userSchema = Schema({
  email: {type: String, unique: true, required: true},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  resume: {type: Schema.ObjectId,ref: 'Resume',required: false},
  profile: {type: Schema.ObjectId,ref: 'Profile',required: false},
  role: {type: String, default:'student', required:true,enum:['student','admin']},
  visa: {type: String, required: false},
  batch_number: {type: String, required: false},
  study_course: {type: String, required: false},
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
      exp: parseInt(expiry.getTime() / 1000),
  }, process.env.PRIVATE_KEY_TOKEN);

  //   exp: parseInt(expiry.getTime() / 1000),
  // }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);
