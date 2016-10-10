var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');

var app = express();

app.oauth = new OAuthServer({
  model: {}, // See https://github.com/thomseddon/node-oauth2-server for specification
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.oauth.authorise());

app.use(function(req, res) {
  res.send('Secret area');
});

app.get('/oauth', function(req, res){
  res.send('Extremely secret key');
});

app.listen(3001);
