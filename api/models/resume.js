var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;
var resume = Schema({
    student_resume: { type: String },
    cybertek_resume: { type: String },
    status: { type: String, default:'empty', required:true,enum:['empty','submitted','reviewing','completed'] },
    student_comments: { type: String },
    admin_coments: { type: String },
    submitted_date: {type: String}
});

mongoose.model('Resume',resume);