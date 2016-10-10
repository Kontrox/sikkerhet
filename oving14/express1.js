var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');
var CryptoJS = require('crypto-js');
var jwt = require('jsonwebtoken');

var app = module.exports = express();

app.use(logger('dev'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p>' + err + '</p>';
  if (msg) res.locals.message = '<p>' + msg + '</p>';
  next();
});

var users = {
  Kontrox: { name: 'Kontrox',
    salt: "Oving12_Salt_Kontrox"
  }
};

var salt = "Oving12_Salt_" + users.Kontrox.name;
//users.Kontrox.hash=CryptoJS.PBKDF2("b25c59792cb5f0cb5f1ac7b5e4628ed328c923887ef26db93a7a9b650e9d5ce1636220922f28adca0b99b6b679404bdaf938b94aaedbd1c267256d2f3231eb3a", users.Kontrox.salt, {keySize: 512/32, iterations: 1024}).toString(CryptoJS.enc.hex);

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(new Error('cannot find user'));
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  var hash = CryptoJS.PBKDF2(pass, users.Kontrox.salt, {keySize: 512/32, iterations: 1024}).toString(CryptoJS.enc.hex);
  if (hash == user.hash){
    var token = jwt.sign(user, 'shhhh, very secret', {expiresIn: 3600});
    return fn(null, user, token);
  }
  fn(new Error('invalid password'));
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/index');
  }
}

app.get('/', function(req, res){
  res.redirect('/index');
});

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/index', function(req, res){
  res.render('index');
});

app.get('/login', function(req, res){
  res.writeHead(302,
    {Location: 'https://api.twitter.com/1.1/login',
    Authorization: {Oauth: {
          oauth_consumer_key: req.body.oauth_consumer_key,
          oauth_nonce: req.body.oauth_nonce,
          oauth_signature: req.body.oauth_signature,
          oauth_signature_method: req.body.oauth_signature_method,
          oauth_timestamp: req.body.timestamp,
          oauth_token: req.body.oauth_token,
          oauth_version: req.body.oauth_version
        }
      }
  });
  res.end();
})

app.post('/authenticate', function(req, res){
  var token = req.body.token || req.headers['x-access-token'];
  jwt.verify(token, "shhhh, very secret", function(err, decoded){
    if (err) {
      authenticate(req.body.username, req.body.pwd, function(err, user, token){
        if (user) {

          // Regenerate session when signing in
          // to prevent fixation
          req.session.regenerate(function(){

            // Store the user's primary key
            // in the session store to be retrieved,
            // or in this case the entire user object
            console.log("Authentication successful.");
            req.session.user = user;
            res.json({
              success: true,
              message: 'Success! Here is your token',
              token: token
            });
            req.session.success = 'Authenticated as ' + user.name
              + ' click to <a href="/logout">logout</a>. '
              + ' You may now access <a href="/restricted">/restricted</a>.';
            //res.redirect('back');
          });
        } else {
          req.session.error = 'Authentication failed, please check your '
            + ' username and password.';
          res.redirect('/index');
        }
      });
    } else {
      res.status(200).send("Token authenticated.");
    }
  })

});

app.get('*', function(req, res){
  res.send("It seems like you may have lost your way.");
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
