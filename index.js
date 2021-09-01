const express = require('express')
const dotenv = require('dotenv')
const app = express()
const bodyParser = require('body-parser'),

aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

aws.config.update({
  secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  accessKeyId: 'XXXXXXXXXXXXXXX',
  region: 'us-west-2'
})
s3 = new aws.S3();
app.use(bodyParser.json());


const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:4200', '*','']
}));

dotenv.config()
const dbCon = require('./repository/db')
global.db = dbCon.connect()
require('./model/modelExport')


app.listen(process.env.PORT, () => console.log('server is up now'))

app.use((req, res, next) => {
  res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
  });
  next();
});

// Routes
const authRoute = require('./routes/auth')
const postRoutes = require('./routes/post')

app.use(express.json())
app.use('/api/user', authRoute)
app.use('/api/posts', postRoutes)

const session = require('express-session');
app.set('view engine', 'ejs');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));

  //google Login
  const passport = require('passport');
  const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
  const GOOGLE_CLIENT_ID = "1081037475034-dbi0b43jdfgsjm8vqtqfgvm8p9unk9at.apps.googleusercontent.com";
  const GOOGLE_CLIENT_SECRET = "fYIclv4sLpl9vpXmcLXHqrPe";
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4200/auth/google/callback",
      passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));
  
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
   
  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
      // Successful authentication, redirect success.
      res.redirect('/success');
    });


app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'node-aws-image', //use bucket name
      key: function (req, file, cb) {
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
});

app.post('/upload', upload.array('upl',1), function (req, res, next) {
  res.send("Uploaded!");
});

//s3 bucket upload file


