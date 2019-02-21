const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const secretAccessKey = process.env.SECRETKEY.toString().trim() ;
const accessKeyId = process.env.KEYID.toString().trim();

aws.config.update({
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKeyId,
    region: 'us-east-1'
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'cybertek-resume',
        acl: 'public-read',
        metadata: function (req, file, cb) {
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
