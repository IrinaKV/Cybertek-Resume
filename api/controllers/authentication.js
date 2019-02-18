var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();
  console.log("Saving User Data :");
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.email = req.body.email;
  user.role = req.body.role;
  user.visa =  req.body.visa;
  user.batch_number = req.body.batch_number;
  user.study_course = req.body.study_course;

  user.setPassword(req.body.password);

  user.save(function(err) {
    if(err){
      console.log(err);
      res.status(401).json({
        "message" : "Error During Saving User data"
      });
    }else{
      var token;
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token,
        "role": user.role
      });
    }
  });
};

module.exports.login = function(req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};