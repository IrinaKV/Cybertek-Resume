const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

const secret = process.env.PRIVATE_KEY_TOKEN;


const auth = jwt({
  secret: secret,
  userProperty: 'payload'
});

const ctrlProfile = require('../controllers/profile');
const ctrlAuth = require('../controllers/authentication');
const resume = require('../controllers/resume');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/addProfile',auth,ctrlProfile.addProfileCustomization);
router.get('/get-all-profiles',auth,ctrlProfile.gelAllProfiles);
router.get('/get-profiles',ctrlProfile.gelProfiles);

//resume
router.post('/upload',auth,resume.uploadFile);
router.post('/resubmit-resume',auth,resume.deleteResume);
router.post('/update-resume',auth,resume.updateResume);

// authenticationS
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
