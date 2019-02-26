const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const mail = require('../util/emailUtils');

const students = [
  'sgadimov@gmail.com',
  'khazarmahmudov@gmail.com',
  'mijatratkovic2@gmail.com',
  'myroslavapavliuk@yahoo.com',
  'zakikhalili11@gmail.com',
  'toufiqn16@gmail.com',
  'misranrifat3@gmail.com',
  'frk.coskunn@gmail.com',
  'akamilova@yahoo.com',
  'albertbayatlantic@gmail.com',
  'serik.batyrkhanov@gmail.com',
  'prfoguz@gmail.com',
  'tarikkzc@gmail.com',
  'miradel123@gmail.com',
  'enesecer@gmail.com',
  'tbcd16@gmail.com',
  'isevertx@gmail.com',
  'aaslanx@gmail.com',
  'rowshenpaltayev@gmail.com',
  'Ibrcakmak@yahoo.com',
  'alikilic27@hotmail.com',
  'macikgozm@gmail.com',
  'tarikgulbas@yahoo.com',
  'kekenus.s@gmail.com'
];

const admins = ['kekenus@cybertekschool.com','jessica@cybertekschool.com','bek@gmail.com'];

function validateRegistration(req){
  const actualEmail = req.body.email.toUpperCase();
  let isValid = false;
  if(req.body.role === 'admin'){
    admins.forEach(function(email){
      if(email.toUpperCase() === actualEmail){
        console.log('VALID ADMIN: '+email);
        isValid = true;
      }
    })
  }else{
    students.forEach(function(email){
      if(email.toUpperCase() === actualEmail){
        console.log('VALID STUDENT: '+email);
        isValid = true;
      }
    })
  }
  return isValid;
}

function validateLogin(req){
  const actualEmail = req.body.email.toUpperCase();
  let isValid = false;

    admins.forEach(function(email){
      if(email.toUpperCase() === actualEmail){
        isValid = true;
      }
    })
    students.forEach(function(email){
      if(email.toUpperCase() === actualEmail){
        isValid = true;
      }
    })
  return isValid;
}

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

exports.register = function(req, res) {
  if(!validateRegistration(req)){
    res.status(401).json({
      "message" : "Your email is not in our system. Please contact Cybertek Team"
    });
    return;
  }
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
      console.log(Object.keys(err));
      console.log(err.code);
      if(err.code === 11000){
        res.status(401).json({
          "message" : "User under this email already exist"
        });
      }else{
        res.status(401).json({
          "message" : "Error During Saving User data"
        });
      }
    }else{
      var token;
      token = user.generateJwt();
      mail.sendEmail("Suranchiyev96@gmail.com",
          `<p>Hello, ${req.body.first_name} ${req.body.last_name}!</p>
                      <br>
                      <p>You have just registered with in our system:</p>
                      <a href=\"https://cybertek-frontend.herokuapp.com\">Cybertek-Resume</a>
                      <ul>
                          <li><strong>email: </strong>${req.body.email}</li>
                          <li><strong>password: </strong>${req.body.password}</li>
                      </ul>
                      <br>
                      <br>
                      <p>Best</p>`);
      res.status(200);
      res.json({
        "token" : token,
        "role": user.role
      });
    }
  });
};

exports.login = function(req, res) {
  if(!validateLogin(req)){
    res.status(401).json({
      "message" : "Your email is not in our system. Please contact Cybertek Team"
    });
    return;
  }

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
      res.status(404).json({
        "message" : "System error. Please try later"
      });
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
      res.status(401).json({
        "message" : "The username or password is incorrect"
      });
    }
  })(req, res);

};
