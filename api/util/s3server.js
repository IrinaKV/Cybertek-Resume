const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

//const secretAccessKey = process.env.SECRETKEY.toString().trim() ;
//const accessKeyId = process.env.KEYID.toString().trim();

aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
      secretAccessKey: "zOsO6QeGaVVCT18nUhD1VaKerg1eP1NdOjZ+sY7K",
      //secretAccessKey: secretAccessKey,
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID

//      accessKeyId: "AKIAIXQWQ2VMX4DGNDCA",
      accessKeyId: "AKIAIHXX5UXQBLHEPDIA",
    //accessKeyId: accessKeyId,
    region: 'us-east-1' // region of your bucket
});


const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'cybertek-resume',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            // console.log("AccessKey: "+secretAccessKey);
            // console.log("KeyID: "+accessKeyId);
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const role = req.query.role;
            const profileId = req.query.profileId;
            const name = req.query.name;
            if(role === 'student'){
                cb(null, 'resume/'+req.payload._id+'/submitted-'+name+'.docx');
            }else{
                cb(null, 'resume/'+profileId+'/completed-'+name+'.docx');
            }
        }
    })
})

module.exports = upload;