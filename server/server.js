const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./app/config/db');

const app            = express();

const port = 8000;

// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/*+json' })); // parse application/vnd.api+json as json

// var customParser = bodyParser.json({type: function(req) {
//     return req.headers['content-type'] === '*/*; charset=UTF-8';
// }});
// app.use(customParser); // parse application/vnd.api+json as json
app.use(bodyParser.text({type: '*/*'})); 
app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

MongoClient.connect(db.url, (err, client) => {
  if (err) return console.log(err)
                      
  // Make sure you add the database name and not the collection name
  const db1 = client.db("test")
  require('./app/routes')(app, db1);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})