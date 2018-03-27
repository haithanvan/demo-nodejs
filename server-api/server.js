const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./app/config/db');

const app            = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, client) => {
  if (err) return console.log(err)
                      
  // Make sure you add the database name and not the collection name
  const db1 = client.db("test")
  require('./app/routes')(app, db1);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})