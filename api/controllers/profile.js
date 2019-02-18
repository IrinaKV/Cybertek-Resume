var mongoose = require('mongoose');
var async = require('async');

var User = mongoose.model('User');
var Profile = mongoose.model('Profile');
var Resume = mongoose.model('Resume');

module.exports.profileRead = function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (!req.payload._id) {
    console.log("Unauthorized");
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    console.log("Getting profile data..");
    User.findById(req.payload._id).populate('profile').populate('resume').exec(function(err,user){
      if(err){
        res.status(500).json({
          "message" : "Error during getting profile"
        });
      }else{
//        console.log(user);
        console.log(res.header);
        res.status(200).send(user);
      }
    });
  }
};

module.exports.addProfileCustomization = function(req,res) {
  console.log("Adding cust profile..");
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {

    var profile = new Profile();
    profile.resumeType = req.body.resumeType;
    profile.experience = req.body.experience;
    profile.education  = req.body.education;
    profile.locationHistory = req.body.locationHistory;
    profile.specificClient = req.body.specificClient;
    profile.specificClientAvoid = req.body.specificClientAvoid;

    async.waterfall([
      function saveProfile(profileCallback) {
        profile.save(function(err,profile){
          if(err){
            console.log("Error during saving cust prof");
            res.status(500).json({
              "message":"Error during the saving profile customization"
            });
          }else{
            console.log("All Good!");
            profileCallback(null, profile);
            res.status(201).send();
          }
        });
      },
      function assignProfileToUser(profile, availableCallback) {
        User.findById(req.payload._id, function(err, user){
          if(err){
            console.log("Error during saving Profile data");
            res.status(500).json({
              "message": "Error during saving Profile data"
            });
          }else{
            user.profile = profile._id;
            user.save(function(err){
              if(err){
                console.log("Error during saving user data");
                res.status(500).json({
                  "message": "Error during saving user data"
                });
              }else{
                console.log("updated!");
                res.status(202).send();
              }
            });
          }

        });
      }
    ], function (error) {
      if (error) {
        //handle readFile error or processFile error here
        console.log("Error occure");
      }
    });

  }
}

module.exports.gelAllProfiles = function(req,res,next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (!req.payload._id) {
    console.log("Unauthorized");
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  }else{
    console.log("Getting Profiles");
    User.find({role:'student'}).populate('profile').populate('resume').sort({ resume: 'desc' })
        .exec(function(err, profiles){
          if(err){return next(err); }
          // Successful, so render
           console.log(res.header);
          res.status(200).json(profiles);
        });
  }
}


