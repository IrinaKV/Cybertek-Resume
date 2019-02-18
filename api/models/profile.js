var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;
var profile = Schema({
    resumeType: {type : String},
    experience: {type: String},
    education: {type: String},
    locationHistory: {type: String},
    specificClient: {type: String},
    specificClientAvoid: {type: String}
});

mongoose.model('Profile',profile);