require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

// the provided configuration for express-session sets a secret for session cookie signing 
//and optimizes session storage by not resaving unchanged sessions and not saving sessions
//for users who haven't added any data to them yet. This configuration helps improve the security and
// performance of your Express.js application's session management.

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

//passport.initialize() and passport.session() enable Passport.js to manage user authentication, 
//including strategies like local authentication (username/password), OAuth, and more. 
//They work seamlessly with other middleware and session management to provide a robust 
//authentication system for your Express.js application.

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
    googleId: String,
    secret: String
  });

//these plugins enhance your User schema model by adding functionality for local authentication (using passportLocalMongoose)
// simplifying the process of finding or creating documents in the 
//database (using mongoose-findorcreate), which can be particularly useful for third-party authentication
// strategies like Google OAuth.

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

  
const User = new mongoose.model("User", userSchema);
  
passport.use(User.createStrategy());

// serialization is about saving user identification information, like user IDs,
// in a way that's easy to store and retrieve. Deserialization is about using that saved 
//information to reconstruct the user's data when needed, such as during subsequent requests.


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });


//Google Strategy: This is like a special way your app talks to Google for user login.
//clientID and clientSecret: These are like your app's ID and secret password for talking to Google. They ensure that Google knows it's your app.
//callbackURL: After a user logs in with Google, they come back to your app. This URL is where they land.
//userProfileURL: This tells Google where to find the user's info after they log in.
//Callback Function: This is a set of instructions for what to do after someone logs in. It takes their info and can find or create a user in your app.
//So, this code sets up how your app talks to Google for user login and what to do with the user's info once they log in.

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  // Check if a user with the same Google ID already exists
  User.findOne({ email: profile.id })
  .then(existingUser => {
    if (existingUser) {
      // User with the same Google ID already exists, you can update their information here
      return cb(null, existingUser);
    } else {
      // User with this Google ID doesn't exist, create a new user
      return User.create({ googleId: profile.id });
    }
  })
  .then(newUser => {
    return cb(null, newUser);
  })
  .catch(err => {
    return cb(err);
  });

}
));


app.get("/", function(req, res){
    res.render("home");
  });
  
app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile"] })
  );
  
app.get("/auth/google/secrets",
    passport.authenticate('google', { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, set the user session and redirect to secrets.
        req.login(req.user, function(err) {
        if (err) {
            console.error(err);
            // Handle any errors during login
            return res.redirect("/login");
        }

        return res.redirect("/secrets");
        
        });
  });

app.get("/login", function(req, res){
    res.render("login");
  });
  
app.get("/register", function(req, res){
    res.render("register");
  });
  
app.get("/submit", function(req, res){
    if (req.isAuthenticated()){
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  });

app.get("/secrets", async function(req, res) {
    try {
      const foundUsers = await User.find({ "secret": { $ne: null } });
      if (foundUsers) {
        res.render("secrets", { usersWithSecrets: foundUsers });
      }
    } catch (err) {
      console.error(err);
      console.log("error in 104 line");
      
    }
  });

app.get("/logout", function(req, res){
    req.logout(function(err) {
        if (err) {
        console.error(err);
        // Handle any errors that occur during logout
        }
        res.redirect("/");
    });
});


app.post("/register", function(req, res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/secrets");
        });
      }
    });
  
  });

app.post("/login", function(req, res){

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/secrets");
        });
      }
    });
  
  });

app.post("/submit", function(req, res) {
    const submittedSecret = req.body.secret;
    
    if (!req.isAuthenticated()) {
      // User is not authenticated, redirect to login
      return res.redirect("/login");
    }
    
    User.findById(req.user.id).then(function(foundUser) {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save().then(function() {
          res.redirect("/secrets");
        }).catch(function(err) {
          console.error(err);
          console.log("Error saving user's secret");
          // Handle any errors that occur during the save operation
          res.redirect("/secrets");
        });
      } else {
        console.log("User not found");
        // Handle the case when the user is not found
        res.redirect("/secrets");
      }
    }).catch(function(err) {
      console.error(err);
      console.log("Error finding user by ID");
      // Handle any errors that occur during the find operation
      res.redirect("/secrets");
    });
  });

app.listen(3000, function() {
    console.log("Server started on port 3000.");
  });
  
  
