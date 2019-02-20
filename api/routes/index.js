var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var resume = require('../controllers/resume');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/addProfile',auth,ctrlProfile.addProfileCustomization);
router.get('/get-all-profiles',auth,ctrlProfile.gelAllProfiles);
router.get('/get-profiles',ctrlProfile.gelProfiles);

//router.post('/upload',auth,ctrlProfile.uploadFile);
router.post('/upload',auth,resume.uploadFile);
router.post('/update-resume',auth,resume.updateResume);

// authenticationS
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
